import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import DashboardCore from '../../components/admin/DashboardCore';
// ✅ FIXED: Changed 'activity' to 'Activity'
import { ShieldLockFill, Activity, CpuFill, LightningChargeFill } from 'react-bootstrap-icons';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function AdminDashboard() {
  const { data, loading, error } = useBankData();
  const { overrides, auditLogs } = useAdminActions();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Firestore Fetching Logic (unchanged)
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
      } catch (error) {
        console.error('Error fetching pending users:', error);
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
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to approve user.');
    }
  };

  const rejectUser = async (userId) => {
    try {
      await updateDoc(doc(userDB, 'users', userId), { status: 'rejected' });
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  // Loading State - Professional Skeleton
  if (loading) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-500 font-mono tracking-widest uppercase text-xs">Initializing Secure Terminal...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6">
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md w-full text-center">
        <h2 className="text-red-500 font-bold mb-2">System Critical Error</h2>
        <p className="text-red-400/70 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Top Status Bar */}
      <div className="bg-[#0f1218] border-b border-white/5 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Mainframe Live
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            <CpuFill className="text-blue-500" />
            Admin ID: {userDB.app.options.projectId.slice(0, 8)}
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-600 italic flex items-center gap-2">
          <Activity size={10} className="text-emerald-500" />
          Last Synced: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldLockFill className="text-blue-500 text-2xl" />
              <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">Surveillance Mode</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">System <span className="text-slate-500">Overview</span></h1>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-all">
              Export Audit
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <LightningChargeFill /> Refresh Node
            </button>
          </div>
        </header>

        {/* Core Dashboard Logic */}
        <div className="relative border border-white/5 bg-[#0f1218]/50 rounded-[2rem] p-1 backdrop-blur-xl shadow-2xl">
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
  );
}