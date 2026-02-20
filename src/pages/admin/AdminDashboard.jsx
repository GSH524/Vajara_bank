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
  Search,
  CpuFill
} from 'react-bootstrap-icons';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  increment // Added increment for real-time balance updates
} from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const { data, loading: bankLoading, error } = useBankData();
  const { overrides, auditLogs } = useAdminActions();
  
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [cardApps, setCardApps] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(userDB, 'users'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingUsers(false);
    }, (err) => toast.error("User Sync Error"));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(userDB, 'creditCardApplications'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCardApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingCards(false);
    }, (err) => toast.error("Card Sync Error"));
    return () => unsubscribe();
  }, []);

  /* -------------------- ADMINISTRATIVE ACTIONS -------------------- */

  const approveUser = async (userId) => {
    const tid = toast.loading("Authorizing account...");
    try {
      await updateDoc(doc(userDB, 'users', userId), { 
        status: 'approved', 
        approvalDate: serverTimestamp() 
      });
      toast.success("User access granted.", { id: tid });
    } catch (err) { toast.error("Approval failed.", { id: tid }); }
  };

  const rejectUser = async (userId) => {
    try {
      await updateDoc(doc(userDB, 'users', userId), { status: 'rejected' });
      toast.success("User application declined.");
    } catch (err) { toast.error("Rejection failed."); }
  };

  // UPDATED: Approve Card with Robust Name Resolution
  const approveCard = async (appId) => {
    const tid = toast.loading("Provisioning Virtual Vault Card...");
    try {
      const appRef = doc(userDB, 'creditCardApplications', appId);
      const appSnap = await getDoc(appRef);
      const appData = appSnap.data();

      const cardNumber = `4532 ${Math.floor(1000+Math.random()*8999)} ${Math.floor(1000+Math.random()*8999)} ${Math.floor(1000+Math.random()*8999)}`;
      const expiry = "02/31";
      const cvv = Math.floor(100 + Math.random()*899).toString();

      await updateDoc(appRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        cardNumber, expiry, cvv
      });

      const userRef = doc(userDB, 'users', appData.userId);
      
      // Inject Card Data into User Profile
      await updateDoc(userRef, {
        cardId: cardNumber,
        cardType: appData.cardType || "Vajra Infinite",
        cardExpiry: expiry,
        cardCvv: cvv,
        creditLimit: 150000,
        creditBalance: 0,
        creditUtilization: 0
      });

      toast.success("Card Issued & User Synced!", { id: tid });
    } catch (err) { toast.error("Provisioning failed.", { id: tid }); }
  };

  const rejectCard = async (appId) => {
    try {
      await updateDoc(doc(userDB, 'creditCardApplications', appId), { status: 'rejected' });
      toast.success("Card application rejected.");
    } catch (err) { toast.error("Action failed."); }
  };

  /* -------------------- DATA PROCESSING -------------------- */

  const processedData = useMemo(() => {
    if (!data) return [];
    let filtered = data;
    if (searchTerm.trim() !== "") {
      filtered = data.filter(item => 
        item.customerId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered.map(item => {
      const override = overrides[item.customerId];
      return override ? {
        ...item,
        isFrozen: override.isFrozen ?? item.isFrozen,
        isHighRisk: override.flagged === true ? true : item.isHighRisk
      } : item;
    });
  }, [data, overrides, searchTerm]);

  if (bankLoading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-6"></div>
      <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs">Syncing Global Nexus...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans antialiased">
      <Toaster position="top-right" />
      
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <DatabaseFillCheck size={14} /> DB Status: Connected
            </div>
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <CloudCheckFill size={14} /> Nexus Nodes: Online
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <Activity size={12} className="text-emerald-500" />
            Live OPS: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CpuFill className="text-blue-500" />
              <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">Command Center</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Vajra <span className="text-slate-500">Control</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={14} />
              <input 
                type="text"
                placeholder="Search Identity..."
                className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold w-64 focus:border-blue-500/50 transition-all text-white outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
            >
              <ArrowClockwise /> Refresh
            </button>
          </div>
        </header>

        <main className="relative bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
           <DashboardCore
             role="ADMIN"
             data={processedData}
             pendingUsers={pendingUsers}
             loadingUsers={loadingUsers}
             approveUser={approveUser}
             rejectUser={rejectUser}
             cardApps={cardApps}
             loadingCards={loadingCards}
             approveCard={approveCard}
             rejectCard={rejectCard}
             auditLogs={auditLogs}
           />
        </main>

        <footer className="mt-10 flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          <div>&copy; 2026 Vault Administration v4.1</div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> Security Level: Root Access
          </div>
        </footer>
      </div>
    </div>
  );
}