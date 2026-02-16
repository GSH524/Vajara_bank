import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import {
  collection, query, where, onSnapshot, doc,
  updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import {
  CashStack, CheckCircle, XCircle, Eye, CalendarWeek,
  Person, PatchCheck, ClockHistory, ChevronLeft, ChevronRight,
  ClipboardData, ArrowRightShort
} from 'react-bootstrap-icons';

export default function AdminLoans() {
  const { data, loading: dataLoading } = useBankData();
  const { overrides, updateLoan } = useAdminActions();
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const q = query(collection(userDB, 'loanApplications'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach(doc => apps.push({ id: doc.id, ...doc.data() }));
      setPendingLoans(apps);
      setLoadingApps(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (loan) => {
    const confirmApprove = window.confirm(`Approve loan of ₹${loan.amount.toLocaleString()} for ${loan.userName}?`);
    if (!confirmApprove) return;
    try {
      const disbursementDays = 3 + Math.floor(Math.random() * 5);
      await updateDoc(doc(userDB, 'loanApplications', loan.id), {
        status: 'approved',
        expectedDisbursementDays: disbursementDays,
        approvedAt: serverTimestamp()
      });
      updateLoan(loan.userId, 'Approved');
      await addDoc(collection(userDB, 'notifications'), {
        userId: loan.userId,
        role: 'user',
        type: 'loan',
        message: `Your loan of ₹${loan.amount.toLocaleString()} is approved! Disbursement in ${disbursementDays} days.`,
        read: false,
        redirectTo: '/user/loans',
        createdAt: serverTimestamp()
      });
      setSelectedLoan(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReject = async (loan) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await updateDoc(doc(userDB, 'loanApplications', loan.id), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp()
      });
      updateLoan(loan.userId, 'Rejected');
      await addDoc(collection(userDB, 'notifications'), {
        userId: loan.userId,
        role: 'user',
        type: 'loan',
        message: `Your loan application was rejected: ${reason}`,
        read: false,
        redirectTo: '/user/loans',
        createdAt: serverTimestamp()
      });
      setSelectedLoan(null);
    } catch (err) {
      alert("Error rejecting loan");
    }
  };

  const activeLoans = useMemo(() => {
    return data.filter(c => c.raw['Loan Amount'] > 0 || overrides[c.customerId]?.loanStatus === 'Approved').map(item => ({
      ...item,
      loanId: item.raw['Loan ID'],
      loanAmount: item.raw['Loan Amount'],
      loanType: item.raw['Loan Type'],
      status: overrides[item.customerId]?.loanStatus || item.raw['Loan Status'],
      tenure: item.raw['Loan Term'] || 12
    }));
  }, [data, overrides]);

  // Pagination Logic
  const totalPages = Math.ceil(activeLoans.length / ITEMS_PER_PAGE);
  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeLoans.slice(start, start + ITEMS_PER_PAGE);
  }, [activeLoans, currentPage]);

  if (dataLoading || loadingApps) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-indigo-500 font-mono animate-pulse tracking-widest uppercase">Unlocking Loan Vault...</div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden">
      
      {/* HEADER SECTION */}
      <header className="px-6 lg:px-10 pt-6 lg:pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <CashStack className="text-indigo-500" /> Loan <span className="text-indigo-500">Center</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Internal Credit Control & Disbursement</p>
        </div>
        <div className="flex gap-4">
          <StatBadge label="Queue" value={pendingLoans.length} color="text-amber-500" />
          <StatBadge label="Active Portfolio" value={activeLoans.length} color="text-indigo-500" />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-10 pb-10 overflow-hidden">
        
        {/* LEFT: VETTING QUEUE (COL 1-5) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between flex-shrink-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Vetting Queue</h3>
            <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded-md font-black italic">PRIORITY 1</span>
          </div>

          {pendingLoans.length === 0 ? (
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-12 text-center flex-1 flex items-center justify-center">
              <div>
                <PatchCheck size={40} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No Applications Pending</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
              {pendingLoans.map(loan => (
                <button
                  key={loan.id}
                  onClick={() => setSelectedLoan(loan)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    selectedLoan?.id === loan.id 
                    ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-900 border-white/5 hover:border-indigo-500/50 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className={`font-bold text-sm ${selectedLoan?.id === loan.id ? 'text-white' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                      {loan.userName}
                    </div>
                    <div className={`text-[10px] font-mono mt-1 ${selectedLoan?.id === loan.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {loan.loanType} • ₹{loan.amount.toLocaleString()}
                    </div>
                  </div>
                  <ArrowRightShort size={24} className={selectedLoan?.id === loan.id ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'} />
                </button>
              ))}
              </div>
            </div>
          )}

          {/* DETAIL PANEL */}
          {selectedLoan && (
            <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4 flex-shrink-0">
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                <ClipboardData /> Reviewing Application
              </h4>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <InfoItem icon={<Person />} val={selectedLoan.userName} />
                <InfoItem icon={<CashStack />} val={`₹${selectedLoan.amount.toLocaleString()}`} />
                <InfoItem icon={<CalendarWeek />} val={`${selectedLoan.tenureMonths} Mos`} />
                <InfoItem icon={<ClockHistory />} val={selectedLoan.loanType} />
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Purpose of Loan</p>
                <p className="text-sm text-slate-300 italic">"{selectedLoan.reason}"</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleApprove(selectedLoan)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14}/> Approve
                </button>
                <button 
                   onClick={() => handleReject(selectedLoan)}
                  className="flex-1 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 font-black text-[10px] uppercase py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <XCircle size={14}/> Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: PORTFOLIO INVENTORY (COL 6-12) */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Portfolio Inventory</h3>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-left h-full">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Principal</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedLoans.map(l => (
                    <tr key={l.customerId} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-white group-hover:text-indigo-400">{l.fullName}</div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase">{l.loanType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-emerald-400 font-bold">₹{Number(l.loanAmount).toLocaleString()}</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase">{l.tenure} Months</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* PAGINATION */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Page {currentPage} / {totalPages}</span>
              <div className="flex gap-2">
                <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(prev => prev - 1)}
                   className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft />
                </button>
                <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                   className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatBadge({ label, value, color }) {
  return (
    <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl min-w-[140px]">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}

function InfoItem({ icon, val }) {
  return (
    <div className="bg-slate-800/50 border border-white/5 p-3 rounded-xl flex items-center gap-3">
      <span className="text-indigo-500">{icon}</span>
      <span className="text-xs font-bold text-slate-200 truncate">{val}</span>
    </div>
  );
}

function StatusPill({ status }) {
  const isApproved = status === 'Approved' || status === 'Current';
  const isDefaulted = status === 'Defaulted' || status === 'Rejected';
  
  return (
    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${
      isApproved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
      isDefaulted ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
      'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }`}>
      {status}
    </span>
  );
}