import React from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { 
  FileEarmarkSpreadsheet, 
  ChatRightText, 
  ClockHistory, 
  CheckCircle, 
  ArrowCounterclockwise // Corrected from ArrowPath
} from 'react-bootstrap-icons';
import { feedbackService } from '../../services/feedbackService';

export default function Reports() {
  const { data, loading } = useBankData();
  const { overrides } = useAdminActions();
  const [tickets, setTickets] = React.useState([]);

  React.useEffect(() => {
    setTickets(feedbackService.getAllTickets());
    const unsubscribe = feedbackService.subscribe(() => {
      setTickets(feedbackService.getAllTickets());
    });
    return () => unsubscribe();
  }, []);

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    feedbackService.updateTicketStatus(id, newStatus);
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Analytics & <span className="text-slate-500">Reports</span></h1>
        <p className="text-slate-400 mt-2">Generate compliant reports for audit and risk analysis.</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* REPORT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-red-500/30 transition-all group">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <FileEarmarkSpreadsheet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">High Risk Customers</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Export all customers flagged as high risk.</p>
            <button
              onClick={() => handleExport('HIGH_RISK')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Download CSV
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <FileEarmarkSpreadsheet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Frozen Accounts</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Details of suspended or frozen accounts.</p>
            <button
              onClick={() => handleExport('FROZEN')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Download CSV
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-slate-600 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
              <FileEarmarkSpreadsheet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full Database</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Complete snapshot of all system records.</p>
            <button
              onClick={() => handleExport('ALL')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Download CSV
            </button>
          </div>
        </div>

        {/* FEEDBACK TABLE SECTION */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <ChatRightText className="text-blue-500" /> User Feedback
          </h2>
          <span className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">
            {tickets.length} Total
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-500 text-[11px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Issue</th>
                  <th className="px-6 py-5">User</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-slate-600 italic">No tickets found.</td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-white mb-1">{ticket.subject}</div>
                        <div className="text-sm text-slate-400 line-clamp-1">{ticket.message}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm text-white font-medium">{ticket.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{ticket.userEmail}</div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {ticket.status === 'Pending' ? (
                          <button
                            onClick={() => handleToggleStatus(ticket.id, ticket.status)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 flex items-center gap-2 ml-auto"
                          >
                            <CheckCircle size={14} /> Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(ticket.id, ticket.status)}
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
        </div>
      </div>
    </div>
  );
}