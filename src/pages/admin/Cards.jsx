import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import { CreditCard as CardIcon, ClockHistory, HourglassSplit } from 'react-bootstrap-icons';
import toast, { Toaster } from 'react-hot-toast';
import CardVisual from '../../components/user/CardVisual';
import CardApplicationForm from '../../components/user/CardApplicationForm';

export default function Cards() {
  const { currentUser } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasCard = !!currentUser?.cardId;

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(collection(userDB, 'creditCardApplications'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleApply = async (formData) => {
    const tid = toast.loading("Submitting to Vault...");
    try {
      // RESOLVED: Name Builder ensures the Admin sees the real name instead of "User"
      const fName = currentUser.firstName || currentUser["First Name"] || "";
      const lName = currentUser.lastName || currentUser["Last Name"] || "";
      const resolvedName = currentUser.fullName || `${fName} ${lName}`.trim() || "Vajra Member";

      await addDoc(collection(userDB, 'creditCardApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email.toLowerCase(), // Store email for Admin
        userName: resolvedName, // Store Name for Admin
        fullName: resolvedName, // Redundant field for visual consistency
        ...formData,
        status: 'pending',
        riskLevel: currentUser.riskLevel || 'Low',
        createdAt: serverTimestamp()
      });

      setShowForm(false);
      toast.success("Application Received", { id: tid });
    } catch (err) {
      toast.error("Submission failed", { id: tid });
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[0.3em]">Syncing Vault...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
          <CardIcon className="text-blue-500" /> VAJRA <span className="text-slate-500">CREDIT</span>
        </h1>
      </div>

      {!hasCard ? (
        showForm ? (
          <CardApplicationForm userData={currentUser} onSubmit={handleApply} onCancel={() => setShowForm(false)} />
        ) : (
          <>
            {applications.some(a => a.status === 'pending') ? (
              <PendingState app={applications.find(a => a.status === 'pending')} />
            ) : (
              <EmptyState onApply={() => setShowForm(true)} />
            )}
          </>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
           <div className="lg:col-span-5 space-y-6">
             <CardVisual userData={currentUser} />
             <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-2xl">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Approved Limit</span>
                <span className="text-2xl font-black text-white">₹{(currentUser.creditLimit || 0).toLocaleString()}</span>
             </div>
           </div>
           <div className="lg:col-span-7 bg-slate-900/30 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center">
              <ClockHistory size={40} className="text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Transaction Intelligence Pending</p>
           </div>
        </div>
      )}
    </main>
  );
}

// Internal Sub-components
const EmptyState = ({ onApply }) => (
  <div className="max-w-xl mx-auto mt-20 bg-slate-900 border border-white/5 rounded-[3rem] p-16 text-center shadow-2xl">
    <CardIcon size={60} className="text-blue-500 mx-auto mb-8" />
    <h2 className="text-2xl font-black text-white mb-4 uppercase">Unlimited Liquidity</h2>
    <p className="text-slate-400 mb-10 text-sm">Unlock ultra-premium credit lines with instant virtual provisioning.</p>
    <button onClick={onApply} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-white uppercase tracking-[0.2em] hover:bg-blue-500 transition-all">Start Application</button>
  </div>
);

const PendingState = ({ app }) => (
  <div className="max-w-xl mx-auto mt-20 bg-slate-900 border border-white/10 rounded-[3rem] p-16 text-center shadow-2xl">
    <HourglassSplit size={60} className="text-amber-500 mx-auto mb-8 animate-pulse" />
    <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Nexus Vetting</h2>
    <p className="text-slate-400 text-sm">Your <span className="text-amber-500 font-black">{app.cardType}</span> request is being verified by the Admin nodes.</p>
  </div>
);