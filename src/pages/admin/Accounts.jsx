import React, { useMemo, useState } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ShieldCheck, ShieldExclamation, People, ChevronLeft, ChevronRight, Search } from 'react-bootstrap-icons';

export default function Accounts() {
  const { data, loading } = useBankData();
  const { overrides, toggleFreeze } = useAdminActions();
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const processedData = useMemo(() => {
    return data.map(item => {
      const override = overrides[item.customerId];
      return { ...item, isFrozen: override?.isFrozen ?? item.isFrozen };
    });
  }, [data, overrides]);

  // Derived Stats
  const totalAccounts = processedData.length;
  const frozenCount = processedData.filter(a => a.isFrozen).length;
  const activeCount = totalAccounts - frozenCount;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalAccounts / itemsPerPage);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="text-indigo-500 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">Initializing Terminal...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="p-6 md:px-10 md:pt-10 border-b border-white/5 bg-[#020617]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
              <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
              Account <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">Terminal</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              Live Node Surveillance Active
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={<People />} label="Total" val={totalAccounts} color="text-indigo-400" />
            <StatCard icon={<ShieldCheck />} label="Active" val={activeCount} color="text-emerald-400" />
            <StatCard icon={<ShieldExclamation />} label="Frozen" val={frozenCount} color="text-rose-400" />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-grow p-4 md:px-10">
        <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">User Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Liquidity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Protocol Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Security Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.map((acc) => (
                  <tr key={acc.customerId} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${acc.isFrozen ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                          {acc.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{acc.fullName}</div>
                          <div className="text-[10px] font-mono text-slate-500 tracking-tight lowercase">{acc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="font-mono text-sm text-emerald-400 font-bold bg-emerald-500/5 px-3 py-1 rounded-lg inline-block">
                        ₹{acc.balance.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                        acc.isFrozen 
                        ? 'bg-rose-500/10 text-rose-500 border-rose-400/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-400/20'
                      }`}>
                        {acc.isFrozen ? 'System Locked' : 'Verified Active'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => toggleFreeze(acc.customerId, acc.isFrozen)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                          acc.isFrozen 
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' 
                          : 'bg-slate-800 text-rose-400 border border-white/5 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                        }`}
                      >
                        {acc.isFrozen ? 'Release' : 'Freeze'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-6 bg-white/[0.01] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Showing <span className="text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalAccounts)}</span> of <span className="text-white">{totalAccounts}</span> Nodes
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-white/5 text-slate-400 hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                      currentPage === i + 1 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-white/5 text-slate-400 hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Stats to keep code clean
function StatCard({ icon, label, val, color }) {
  return (
    <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4 min-w-[120px]">
      <div className={`p-2.5 bg-white/5 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`text-xl font-mono font-bold ${color}`}>{val}</p>
      </div>
    </div>
  );
}