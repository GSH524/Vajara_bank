import React, { useEffect, useState, useMemo } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { 
  FileEarmarkSpreadsheet, ChatRightText, CheckCircle, 
  ArrowCounterclockwise, ChevronLeft, ChevronRight, Search, Funnel
} from 'react-bootstrap-icons';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import toast from 'react-hot-toast';

export default function Reports() {
  const { data, loading: bankLoading } = useBankData();
  const { overrides } = useAdminActions();
  
  const [tickets, setTickets] = useState([]);
  const [fetchingTickets, setFetchingTickets] = useState(true);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, Pending, Resolved
  const itemsPerPage = 8;

  // FETCH AGGREGATED FEEDBACKS
  const fetchTickets = async () => {
    setFetchingTickets(true);
    try {
      let allTickets = [];

      // 1. Fetch Legacy Feedbacks from 'users1'
      const snap1 = await getDocs(collection(userDB, "users1"));
      snap1.forEach(doc => {
        const d = doc.data();
        if (d["Feedback ID"]) {
          allTickets.push({
            id: doc.id,
            collection: "users1",
            status: d["Resolution Status"] || "Pending",
            subject: d["Feedback Type"] || "Legacy Report",
            message: `Legacy Feedback ID: ${d["Feedback ID"]}. Date: ${d["Feedback Date"]}`,
            userName: d["First Name"] || d["Customer Name"] || "Legacy User",
            userEmail: d["Email"] || "N/A",
            date: d["Feedback Date"] || ""
          });
        }
      });

      // 2. Fetch Legacy Feedbacks from 'users'
      const snap2 = await getDocs(collection(userDB, "users"));
      snap2.forEach(doc => {
        const d = doc.data();
        if (d["Feedback ID"] || d.feedbackType) {
          allTickets.push({
            id: doc.id,
            collection: "users",
            status: d["Resolution Status"] || d.status || "Pending",
            subject: d["Feedback Type"] || d.feedbackType || "Legacy Report",
            message: d.message || `Legacy Feedback ID: ${d["Feedback ID"] || 'N/A'}`,
            userName: d.firstName || d.fullName || "Legacy User",
            userEmail: d.email || "N/A",
            date: d["Feedback Date"] || d.createdAt || ""
          });
        }
      });

      // 3. Fetch New Live Feedbacks & Contacts from 'feedbacks'
      const snap3 = await getDocs(collection(userDB, "feedbacks"));
      snap3.forEach(doc => {
        const d = doc.data();
        allTickets.push({
          id: doc.id,
          collection: "feedbacks",
          status: d.status || "Pending",
          subject: d.subject || d.category || "Support Request",
          message: d.message,
          userName: d.userName || d.name || "User",
          userEmail: d.userEmail || d.email || "N/A",
          date: d.createdAt || ""
        });
      });

      setTickets(allTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load feedback registry.");
    } finally {
      setFetchingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // TOGGLE STATUS IN DATABASE
  const handleToggleStatus = async (ticket) => {
    try {
      const newStatus = ticket.status === 'Pending' ? 'Resolved' : 'Pending';
      const docRef = doc(userDB, ticket.collection, ticket.id);
      
      // Update payload covers both standard and legacy field names
      await updateDoc(docRef, { 
        status: newStatus,
        "Resolution Status": newStatus 
      });

      toast.success(`Ticket marked as ${newStatus}`);
      fetchTickets(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleExport = (type) => {
    let exportData = data;
    const merged = data.map(d => ({
      ...d,
      isFrozen: overrides[d.customerId]?.isFrozen ?? d.isFrozen,
      isHighRisk: overrides[d.customerId]?.flagged ? true : d.isHighRisk
    }));

    if (type === 'HIGH_RISK') {
      exportData = merged.filter(d => d.isHighRisk);
    } else if (type === 'FROZEN') {
      exportData = merged.filter(d => d.isFrozen);
    } else if (type === 'KYC_PENDING') {
      const pendingIds = Object.keys(overrides).filter(id => overrides[id].kycStatus === 'Pending');
      exportData = merged.filter(d => pendingIds.includes(d.customerId));
    }

    const headers = ["Customer ID", "Name", "Email", "Balance", "Risk Level", "Status"];
    const rows = exportData.map(c => [
      c.customerId, c.fullName, c.email, c.balance, c.riskLevel, c.activeStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${type.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // FILTER & PAGINATION LOGIC
  // ==========================================
  const filteredTickets = useMemo(() => {
    let result = tickets;

    // 1. Status Filter
    if (statusFilter !== "ALL") {
      result = result.filter(t => t.status === statusFilter);
    }

    // 2. Search Text
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.userName?.toLowerCase().includes(term) ||
        t.userEmail?.toLowerCase().includes(term) ||
        t.subject?.toLowerCase().includes(term) ||
        t.message?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [tickets, searchTerm, statusFilter]);

  const totalTickets = filteredTickets.length;
  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  // Reset to page 1 if search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);


  if (bankLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Analytics & <span className="text-slate-500">Reports</span></h1>
        <p className="text-slate-400 mt-2">Generate compliant reports for audit and risk analysis.</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* REPORT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-red-500/30 transition-all group">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <FileEarmarkSpreadsheet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">High Risk Customers</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Export all customers flagged as high risk.</p>
            <button onClick={() => handleExport('HIGH_RISK')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
              Download CSV
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <FileEarmarkSpreadsheet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Frozen Accounts</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Details of suspended or frozen accounts.</p>
            <button onClick={() => handleExport('FROZEN')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
              Download CSV
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-slate-600 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
              <FileEarmarkSpreadsheet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full Database</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Complete snapshot of all system records.</p>
            <button onClick={() => handleExport('ALL')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
              Download CSV
            </button>
          </div>
        </div>

        {/* FEEDBACK SECTION HEADER & CONTROLS */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
              <ChatRightText className="text-blue-500" /> User Feedback Log
            </h2>
            <span className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">
              {totalTickets} Records Found
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-40 bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending Only</option>
                <option value="Resolved">Resolved Only</option>
              </select>
              <Funnel className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14}/>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-500 text-[11px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 w-1/3">Issue / Details</th>
                  <th className="px-6 py-5">Source Node</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {fetchingTickets ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-slate-500 animate-pulse font-bold tracking-widest uppercase text-xs">
                      Fetching Registry...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-slate-600 italic">No tickets match your filters.</td>
                  </tr>
                ) : (
                  currentItems.map((ticket, idx) => (
                    <tr key={`${ticket.id}-${idx}`} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 max-w-xs">
                        <div className="font-bold text-white mb-1 truncate">{ticket.subject}</div>
                        <div className="text-xs text-slate-400 line-clamp-2">{ticket.message}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm text-white font-bold">{ticket.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-tighter">{ticket.userEmail}</div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {ticket.status === 'Pending' ? (
                          <button
                            onClick={() => handleToggleStatus(ticket)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 flex items-center gap-2 ml-auto shadow-lg shadow-blue-900/40"
                          >
                            <CheckCircle size={14} /> Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(ticket)}
                            className="text-slate-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-800 hover:border-slate-600 flex items-center gap-2 ml-auto"
                          >
                            <ArrowCounterclockwise size={14} /> Reopen
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {!fetchingTickets && totalTickets > 0 && (
            <div className="p-6 bg-slate-800/20 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages || 1}</span>
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 disabled:opacity-30 hover:text-white transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-slate-700 self-center">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${
                            currentPage === p 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30' 
                            : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 disabled:opacity-30 hover:text-white transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}