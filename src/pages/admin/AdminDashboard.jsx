import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import DashboardCore from '../../components/admin/DashboardCore';
import { 
  ShieldCheck, 
  ArrowClockwise, 
  Activity,
  DatabaseFillCheck,
  CloudCheckFill,
  Search
} from 'react-bootstrap-icons';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  // 1. Fetch Aggregated Data (Linked via Customer ID)
  const { data, loading, error } = useBankData();
  const { overrides, auditLogs } = useAdminActions();
  
  // 2. Local State
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // For Customer ID search

  // 3. Real-time Listener for New Registrations
  useEffect(() => {
    const q = query(collection(userDB, 'users'), where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: 'New Registration'
      }));
      setPendingUsers(users);
      setLoadingUsers(false);
    }, (err) => {
      console.error('❌ Registration Queue Error:', err);
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, []);

  // 4. Admin Action: Approve User
  const approveUser = async (userId) => {
    const tid = toast.loading("Authorizing user access...");
    try {
      await updateDoc(doc(userDB, 'users', userId), { 
        status: 'approved',
        approvalDate: serverTimestamp() 
      });
      toast.success("User approved. Credentials active.", { id: tid });
    } catch (err) {
      toast.error("Approval sequence failed.", { id: tid });
    }
  };

  // 5. Admin Action: Reject User
  const rejectUser = async (userId) => {
    const tid = toast.loading("Processing rejection...");
    try {
      await updateDoc(doc(userDB, 'users', userId), { 
        status: 'rejected',
        rejectionDate: serverTimestamp() 
      });
      toast.success("Application rejected.", { id: tid });
    } catch (err) {
      toast.error("Rejection sequence failed.", { id: tid });
    }
  };

  // 6. Data Processor: Filter by Search + Merge Admin Overrides
  const processedData = useMemo(() => {
    if (!data) return [];
    
    // First, filter by Customer ID if user is typing
    let filtered = data;
    if (searchTerm.trim() !== "") {
      filtered = data.filter(item => 
        item.customerId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Second, apply admin overrides (Freeze/Flag)
    return filtered.map(item => {
      const override = overrides[item.customerId];
      return override ? {
        ...item,
        isFrozen: override.isFrozen ?? item.isFrozen,
        isHighRisk: override.flagged === true ? true : item.isHighRisk
      } : item;
    });
  }, [data, overrides, searchTerm]);

  /* -------------------- RENDER HELPERS -------------------- */

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-6"></div>
      <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs">Syncing Global Data Nodes...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans antialiased">
      <Toaster position="top-right" />
      
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        
        {/* SYSTEM STATUS BAR */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <DatabaseFillCheck size={14} /> Legacy DB: Connected
            </div>
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <CloudCheckFill size={14} /> Cloud Nodes: Online
            </div>
          </div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Protocol: AES-256 <span className="text-slate-700 mx-2">|</span> Session Active
          </div>
        </div>

        {/* HEADER & SEARCH */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              VAJRA <span className="text-blue-500">Command Center</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium italic">
              Monitoring {processedData.length} records across disparate nodes.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input for Customer ID */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={14} />
              <input 
                type="text"
                placeholder="Search Customer ID..."
                className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
            >
              <ArrowClockwise className="group-hover:rotate-180 transition-transform duration-500" /> Refresh
            </button>
          </div>
        </header>

        {/* MAIN DASHBOARD UI */}
        <main className="relative">
          <div className="relative bg-[#0b1120]/80 border border-white/10 rounded-[1.5rem] shadow-2xl backdrop-blur-xl">
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
        </main>

        {/* FOOTER */}
        <footer className="mt-10 flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          <div>&copy; 2026 Vajra Banking Nexus v4.0</div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> Security Level: Root
          </div>
        </footer>
      </div>
    </div>
  );
}