import React, { useMemo, useState } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ShieldCheck, ShieldExclamation, People, ChevronLeft, ChevronRight, Search, Funnel } from 'react-bootstrap-icons';

export default function Accounts() {
  const { data, loading } = useBankData();
  const { overrides, toggleFreeze } = useAdminActions();
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  // 1. Process, Sort (New Users First), and Filter
  const filteredData = useMemo(() => {
    let result = data.map(item => {
      const override = overrides[item.customerId];
      return { ...item, isFrozen: override?.isFrozen ?? item.isFrozen };
    });

    // Sort: "Live Cloud" (New Users) or "NEW" customerIds first
    result.sort((a, b) => {
      if (a.source === 'Live Cloud' && b.source !== 'Live Cloud') return -1;
      if (a.source !== 'Live Cloud' && b.source === 'Live Cloud') return 1;
      return 0;
    });

    // Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(acc => 
        acc.fullName.toLowerCase().includes(term) || 
        acc.email.toLowerCase().includes(term) || 
        acc.customerId.toLowerCase().includes(term)
      );
    }

    return result;
  }, [data, overrides, searchTerm]);

  // Derived Stats
  const totalAccounts = filteredData.length;
  const totalPages = Math.ceil(totalAccounts / itemsPerPage);

  // Pagination Logic
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-indigo-500 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10">
      
      {/* HEADER & SEARCH */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Vault <span className="text-indigo-500">Accounts</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              {totalAccounts} Node(s) Identified
            </p>
          </div>

          {/* Search Bar - Responsive */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by Name, Email or ID..."
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-md"
            />
          </div>
        </header>

        {/* MOBILE CARDS / DESKTOP TABLE */}
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Client Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Liquidity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Source</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Security Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.length > 0 ? currentItems.map((acc) => (
                  <tr key={acc.customerId} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${acc.isFrozen ? 'border-rose-500/30 text-rose-500' : 'border-indigo-500/30 text-indigo-400'}`}>
                          {acc.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{acc.fullName}</div>
                          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{acc.customerId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-emerald-400 font-black text-lg">₹{acc.balance.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-600 font-bold uppercase">{acc.accountType}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        acc.source === 'Live Cloud' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-500 border-white/5'
                      }`}>
                        {acc.source || 'Legacy'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => toggleFreeze(acc.customerId, acc.isFrozen)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          acc.isFrozen 
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                          : 'bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white'
                        }`}
                      >
                        {acc.isFrozen ? 'Activate' : 'Freeze'}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-slate-600 italic uppercase tracking-widest text-sm">
                      No Records Matching Query
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* COMPACT RESPONSIVE PAGINATION */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages || 1}</span>
            </span>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 disabled:opacity-10 hover:text-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Smart Pagination: Shows only 3 buttons on mobile, more on desktop */}
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
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                          : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
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
                className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 disabled:opacity-10 hover:text-white transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}