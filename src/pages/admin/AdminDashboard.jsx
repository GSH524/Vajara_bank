import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import DashboardCore from '../../components/admin/DashboardCore';
import { 
  ShieldCheck, 
  ArrowClockwise, 
  FileEarmarkText, 
  Activity
} from 'react-bootstrap-icons';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function AdminDashboard() {
  const { data, loading, error } = useBankData();
  const { overrides, auditLogs } = useAdminActions();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const q = query(collection(userDB, 'users'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setPendingUsers(users);
      } catch (err) {
        console.error('❌ Firestore Error:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchPendingUsers();
  }, []);

  const approveUser = async (userId) => {
    try {
      await updateDoc(doc(userDB, 'users', userId), { status: 'approved' });
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      alert('Approval failed. Check system logs.');
    }
  };

  const rejectUser = async (userId) => {
    try {
      await updateDoc(doc(userDB, 'users', userId), { status: 'rejected' });
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const processedData = useMemo(() => {
    if (!data) return [];
    return data.map(item => {
      const override = overrides[item.customerId];
      if (override) {
        return {
          ...item,
          isFrozen: override.isFrozen ?? item.isFrozen,
          isHighRisk: override.flagged ? true : item.isHighRisk
        };
      }
      return item;
    });
  }, [data, overrides]);

  /* -------------------- LOADING & ERROR STATES -------------------- */

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]"></div>
      <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs">Decrypting Nexus Data...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="bg-slate-900 border-2 border-red-500/20 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="text-red-500" size={40} />
        </div>
        <h2 className="text-white text-2xl font-black mb-3 tracking-tight">System Breach or Error</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-900/30"
        >
          Initialize Re-Sync
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans antialiased selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto px-6 py-8 md:px-10">
        
        {/* TOP UTILITY BAR */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            Terminal Secure <span className="text-slate-700 mx-1">|</span> Node: 77-Alpha
          </div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            System Time: <span className="text-slate-300">Feb 16, 2026 — 15:38:04</span>
          </div>
        </div>

        {/* MAIN HEADER */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md mb-4">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Admin Control Panel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Admin <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-4 text-base max-w-2xl leading-relaxed font-medium">
              Real-time administrative oversight of global banking nodes, compliance queues, and secure audit trails.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300 transition-all">
              <FileEarmarkText size={16} className="text-blue-400" /> Export Data
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 border border-blue-400/20"
            >
              <ArrowClockwise size={18} className="animate-spin-slow" /> Sync Nexus
            </button>
          </div>
        </header>

        {/* CORE CONTENT CARD */}
        <main className="relative">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-50"></div>
          
          <div className="relative bg-[#0b1120]/80 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="p-2">
               <DashboardCore
                 role="ADMIN"
                 data={processedData}
                 pendingUsers={pendingUsers}
                 loadingUsers={loadingUsers}
                 approveUser={approveUser}
                 rejectUser={rejectUser}
                 auditLogs={auditLogs}
               />
            </div>
          </div>
        </main>

        {/* SYSTEM STATUS FOOTER */}
        <footer className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-10 border-t border-white/5">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gateways Active</span>
             </div>
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-500" size={14} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">End-to-End Encrypted</span>
             </div>
          </div>
          
          <div className="md:text-right">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
              &copy; 2026 Nexus Financial <span className="text-slate-800 mx-2">•</span> ISO-27001 Certified <span className="text-slate-800 mx-2">•</span> Authorization Level 4
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}