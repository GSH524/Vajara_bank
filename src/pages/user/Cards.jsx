import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import {
  CreditCard as CardIcon,
  HourglassSplit,
} from 'react-bootstrap-icons';
import toast, { Toaster } from 'react-hot-toast';
import CardVisual from '../../components/user/CardVisual';
import CardApplicationForm from '../../components/user/CardApplicationForm';

export default function Cards() {
  const { currentUser } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  // Check if user already has an active card provisioned in their profile
  const hasCard = !!currentUser?.cardId;

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(userDB, 'creditCardApplications'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleApply = async (formData) => {
    const tid = toast.loading("Transmitting application to Vault...");
    try {
      // RESOLVED: Robust Name Builder to avoid "User" display
      const fName = currentUser.firstName || currentUser["First Name"] || "";
      const lName = currentUser.lastName || currentUser["Last Name"] || "";
      const resolvedName = formData.fullName || currentUser.fullName || `${fName} ${lName}`.trim() || "Member";

      await addDoc(collection(userDB, 'creditCardApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email.toLowerCase(),
        userName: resolvedName, 
        income: Number(formData.income),
        employment: formData.employment,
        cardType: formData.cardType,
        status: 'pending',
        riskLevel: currentUser.riskLevel || 'Low',
        createdAt: serverTimestamp()
      });

      setShowForm(false);
      toast.success("Application transmitted successfully", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Transmission failed: Network Error", { id: tid });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-black uppercase tracking-widest">Syncing Vault...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
          <CardIcon className="text-blue-500" /> VAJRA <span className="text-slate-500">CREDIT</span>
        </h1>
      </div>

      {!hasCard ? (
        showForm ? (
          <CardApplicationForm
            userData={currentUser}
            onSubmit={handleApply}
            onCancel={() => setShowForm(false)}
          />
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
        <div className="space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ACTIVE CARD VIEW */}
                <section className="lg:col-span-5 space-y-6">
                    <CardVisual
                        type={currentUser.cardType}
                        number={currentUser.cardId}
                        holder={currentUser.fullName}
                        expiry={currentUser.cardExpiry || "12/28"}
                        cvv={currentUser.cvv || "000"} // Added CVV support
                        blocked={isBlocked}
                    />
                    <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Approved Credit Line</h4>
                        <div className="text-3xl font-black text-white">₹{(currentUser.creditLimit || 0).toLocaleString()}</div>
                        <p className="text-xs text-emerald-500 font-bold mt-2 uppercase tracking-tighter">Available for instant use</p>
                    </div>
                </section>

                <section className="lg:col-span-7 bg-slate-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-6">Activity Intelligence</h3>
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">Real-time analysis pending...</p>
                    </div>
                </section>
            </div>
        </div>
      )}
    </main>
  );
}

// SUB-COMPONENTS
const EmptyState = ({ onApply }) => (
  <div className="max-w-xl mx-auto mt-16 bg-slate-900 border border-white/5 rounded-[3rem] p-16 text-center shadow-2xl">
    <CardIcon size={60} className="text-blue-500 mx-auto mb-8" />
    <h2 className="text-2xl font-black text-white mb-4 uppercase">Infinite Credit Awaits</h2>
    <p className="text-slate-400 mb-10 text-sm leading-relaxed">Access premium liquidity with the Vajra Virtual Card. Automated vetting and instant provisioning for high-value accounts.</p>
    <button onClick={onApply} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-white uppercase tracking-[0.2em] hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
      Start Provisioning
    </button>
  </div>
);

const PendingState = ({ app }) => (
  <div className="max-w-xl mx-auto mt-16 bg-slate-900 border border-white/5 rounded-[3rem] p-16 text-center shadow-2xl">
    <HourglassSplit size={60} className="text-amber-500 mx-auto mb-8 animate-pulse" />
    <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Vetting Protocol</h2>
    <p className="text-slate-400 text-sm leading-relaxed">Your request for <span className="text-amber-500 font-black">{app.cardType}</span> is currently being processed by the Admin nodes. You will be notified upon approval.</p>
  </div>
);