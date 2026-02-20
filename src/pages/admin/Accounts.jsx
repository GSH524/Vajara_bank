import React, { useMemo, useState } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { 
  ShieldCheck, ShieldExclamation, People, ChevronLeft, ChevronRight, 
  Search, Funnel, ArrowDownRight, ArrowUpRight, X 
} from 'react-bootstrap-icons';
import { collection, query, where, getDocs, writeBatch, increment, doc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import toast from 'react-hot-toast';

export default function Accounts() {
  const { data, loading } = useBankData();
  const { overrides, toggleFreeze } = useAdminActions();
  
  const navigate = useNavigate(); // 2. Initialize navigate
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State for Deposit/Withdraw
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '', 
    user: null,
    amount: ''
  });

  const itemsPerPage = 8;

  // Process, Sort, and Filter
  const filteredData = useMemo(() => {
    let result = data.map(item => {
      const override = overrides[item.customerId];
      return { ...item, isFrozen: override?.isFrozen ?? item.isFrozen };
    });

    result.sort((a, b) => {
      if (a.source === 'Live Cloud' && b.source !== 'Live Cloud') return -1;
      if (a.source !== 'Live Cloud' && b.source === 'Live Cloud') return 1;
      return 0;
    });

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(acc => 
        acc.fullName?.toLowerCase().includes(term) || 
        acc.email?.toLowerCase().includes(term) || 
        acc.customerId?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [data, overrides, searchTerm]);

  const totalAccounts = filteredData.length;
  const totalPages = Math.ceil(totalAccounts / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // ==========================================
  // FIREBASE TRANSACTION LOGIC
  // ==========================================
  const handleTransaction = async (e) => {
    e.preventDefault();
    const { type, user, amount } = modalConfig;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return toast.error("Please enter a valid amount greater than 0.");
    }

    const isDeposit = type === 'deposit';
    
    if (!isDeposit && Number(user.balance || 0) < numAmount) {
      return toast.error("Insufficient funds for this withdrawal.");
    }

    const modifier = isDeposit ? numAmount : -numAmount;

    try {
      const batch = writeBatch(userDB);
      const userEmail = user.email.toLowerCase();

      // 1. Update Standard 'users' Collection
      const qUsers = query(collection(userDB, 'users'), where('email', '==', userEmail));
      const snapUsers = await getDocs(qUsers);
      snapUsers.forEach(document => {
        batch.update(document.ref, { balance: increment(modifier) });
      });

      // 2. Update Legacy 'users1' Collection
      const qUsers1 = query(collection(userDB, 'users1'), where('Email', '==', user.email));
      const snapUsers1 = await getDocs(qUsers1);
      snapUsers1.forEach(document => {
        batch.update(document.ref, { 
          balance: increment(modifier),
          "Account Balance": increment(modifier) 
        });
      });

      // 3. Create Notification Record ONLY IF IT IS A DEPOSIT
      if (isDeposit) {
        const transferRef = doc(collection(userDB, 'transfer'));
        batch.set(transferRef, {
          senderEmail: userEmail,
          type: 'Deposit',
          amount: numAmount,
          reason: 'Vault Admin Deposit',
          timestamp: new Date().toISOString()
        });
      }

      // Commit Batch
      await batch.commit();

      toast.success(
        `${isDeposit ? 'Deposit' : 'Withdrawal'} of ₹${numAmount.toLocaleString()} successful!`,
        { style: { background: '#020617', color: '#fff', border: '1px solid #10b981' } }
      );
      
      closeModal();

      // 4. THE FIX: Use soft navigation instead of hard reload!
      // This routes you to the dashboard instantly without breaking your admin session.
      navigate('/admin/dashboard'); 

    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Check console for details.");
    }
  };

  const openModal = (type, user) => setModalConfig({ isOpen: true, type, user, amount: '' });
  const closeModal = () => setModalConfig({ isOpen: false, type: '', user: null, amount: '' });

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-indigo-500 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 relative">
      
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

        {/* DATA TABLE */}
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Client Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Liquidity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Source</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Funds</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Security Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.length > 0 ? currentItems.map((acc) => (
                  <tr key={acc.customerId} className="group hover:bg-white/[0.02] transition-colors">
                    
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${acc.isFrozen ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' : 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5'}`}>
                          {acc.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{acc.fullName || "Unknown User"}</div>
                          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{acc.customerId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="text-emerald-400 font-black text-lg">₹{Number(acc.balance || 0).toLocaleString()}</div>
                      <div className="text-[9px] text-slate-600 font-bold uppercase">{acc.accountType || 'Standard'}</div>
                    </td>

                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        acc.source === 'Live Cloud' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-500 border-white/5'
                      }`}>
                        {acc.source || 'Legacy'}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openModal('deposit', acc)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider"
                        >
                          <ArrowDownRight size={12} /> Add
                        </button>
                        <button 
                          onClick={() => openModal('withdraw', acc)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider"
                        >
                          <ArrowUpRight size={12} /> Pull
                        </button>
                      </div>
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
                    <td colSpan="5" className="py-20 text-center text-slate-600 italic uppercase tracking-widest text-sm">
                      No Records Matching Query
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
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

      {/* ==========================================
          TRANSACTION MODAL 
      ========================================== */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className={`relative w-full max-w-md bg-slate-900 border-2 rounded-[2rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 ${
            modalConfig.type === 'deposit' ? 'border-emerald-500/30' : 'border-amber-500/30'
          }`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-2 ${
                  modalConfig.type === 'deposit' ? 'text-emerald-400' : 'text-amber-500'
                }`}>
                  {modalConfig.type === 'deposit' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                  {modalConfig.type === 'deposit' ? 'Add Funds' : 'Pull Funds'}
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-1">
                  Target: <span className="text-white">{modalConfig.user?.fullName}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase mt-0.5">
                  Current Liquidity: ₹{Number(modalConfig.user?.balance || 0).toLocaleString()}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-rose-500/20 transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleTransaction} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                  <input
                    type="number"
                    autoFocus
                    required
                    min="1"
                    value={modalConfig.amount}
                    onChange={(e) => setModalConfig({ ...modalConfig, amount: e.target.value })}
                    className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-lg font-mono text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-slate-400 bg-white/5 hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-white shadow-lg transition-transform active:scale-95 ${
                    modalConfig.type === 'deposit' 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50' 
                    : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/50'
                  }`}
                >
                  Confirm {modalConfig.type}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    </div>
  );
}