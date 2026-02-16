import React, { useState, useMemo } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { ShieldCheck, PersonBadge, Check2, X, Fingerprint, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

export default function KYC() {
  const { data, loading } = useBankData();
  const { overrides, updateKYC } = useAdminActions();

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust this number to control page height

  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      kycStatus: overrides[item.customerId]?.kycStatus || 'Pending'
    }));
  }, [data, overrides]);

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0c10]">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-mono text-xs tracking-[0.3em] uppercase">Securing Connection...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-[#0a0c10] text-slate-200 font-['Outfit'] flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Compliance Control</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            KYC <span className="text-slate-500">Verification</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">Validate identity documents and approve customer onboarding.</p>
        </div>

        <div className="bg-slate-900/50 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-md">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pending Review</div>
          <div className="text-xl font-mono font-bold text-amber-500">
            {processedData.filter(c => c.kycStatus === 'Pending').length}
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black">
                <th className="px-6 py-5">Customer Profile</th>
                <th className="px-6 py-5">Identity Proof</th>
                <th className="px-6 py-5">Verification Status</th>
                <th className="px-6 py-5 text-right">Decision Tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map(customer => (
                <tr key={customer.customerId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                        <PersonBadge size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{customer.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase">ID: {customer.customerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Fingerprint className="text-slate-500" />
                      AADHAAR: <span className="text-blue-400/80">**** **** {customer.customerId.slice(-4)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                      ${customer.kycStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        customer.kycStatus === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'}
                    `}>
                      ● {customer.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {customer.kycStatus === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => updateKYC(customer.customerId, 'Verified')}
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all active:scale-90 shadow-lg shadow-emerald-900/20"
                        >
                          <Check2 size={18} />
                        </button>
                        <button 
                          onClick={() => updateKYC(customer.customerId, 'Rejected')}
                          className="p-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 border border-rose-500/20 rounded-lg transition-all active:scale-90"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-bold uppercase italic tracking-widest">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            SHOWING <span className="text-white font-bold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, processedData.length)}</span> OF {processedData.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all border ${
                    currentPage === i + 1 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), currentPage + 2)} 
              {/* Slicing the page numbers so it doesn't overflow if you have 100 pages */}
            </div>

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}