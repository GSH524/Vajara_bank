import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import DashboardCore from '../../components/admin/DashboardCore';
import { 
  ShieldLockFill, 
  Activity, 
  CpuFill, 
  LightningChargeFill,
  BoxArrowRight,
  ShieldCheck
} from 'react-bootstrap-icons';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function AdminDashboard() {
  const { data, loading, error } = useBankData();
  const { overrides, auditLogs } = useAdminActions();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // FETCH PENDING USERS FROM FIRESTORE
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

  // ADMINISTRATIVE ACTIONS
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

  // DATA TRANSFORMATIONS
  const processedData = useMemo(() => {
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

  /* -------------------- RENDER LOGIC -------------------- */

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={30} />
      </div>
      <p className="mt-6 text-blue-500 font-mono tracking-[0.5em] uppercase text-[10px] animate-pulse">
        Initializing Secure Environment
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6 font-['Outfit']">
      <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2rem] max-w-md w-full text-center backdrop-blur-xl">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity size={32} />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">System Critical Error</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
        >
          Attempt Re-synchronization
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a0c10] to-[#0f1218] text-slate-200 font-['Outfit'] selection:bg-blue-500/30">
      
      <div className="p-6 md:p-10 max-w-[1700px] mx-auto">
        
        {/* PAGE HEADER */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <ShieldLockFill className="text-blue-500" size={20} />
              </div>
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">Surveillance Protocol</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              System <span className="text-slate-500">Overview</span>
            </h1>
            <p className="text-slate-500 mt-2 max-w-xl text-sm leading-relaxed italic font-light">
              Aggregated real-time telemetry from banking nodes and pending user verification queues.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              Generate Report
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <LightningChargeFill /> Force Refresh
            </button>
          </div>
        </header>

        {/* CORE CONTENT AREA */}
        <div className="relative group">
          {/* Decorative Corner Glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 border border-white/5 bg-[#0f1218]/40 rounded-[2.5rem] p-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group-hover:border-white/10">
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

        {/* DATA COMPLIANCE FOOTER */}
        <footer className="mt-12 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <span>&copy; 2026 Nexus Banking Systems</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span className="text-slate-700">ISO 27001 Certified</span>
          </div>
          <div className="text-[10px] font-mono text-slate-700">
            ENCRYPTION: AES-256-GCM | SESSION: ACTIVE
          </div>
        </footer>
      </div>
    </div>
  );
}