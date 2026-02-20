import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import { Bank, CashCoin, ClockHistory, FileEarmarkText } from 'react-bootstrap-icons';
import toast, { Toaster } from 'react-hot-toast';

export default function Loans() {
  const location = useLocation();
  const riskLevel = location.state?.riskLevel || 'Medium';
  const { currentUser, loading: authLoading } = useCurrentUser();
  
  const [firebaseApplications, setFirebaseApplications] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // 1. Dynamic Loan Eligibility based on Risk Level
  const getEligibleLoans = (risk) => {
    if (['Low', 'Safe', 'High Value Customers'].includes(risk)) {
      return [
        { Loan_Type: 'Home Loan', Loan_Amount: '30L – 5Cr', Loan_Interest: '8.25%' },
        { Loan_Type: 'Auto Loan', Loan_Amount: '5L – 50L', Loan_Interest: '8.5%' },
        { Loan_Type: 'Personal Loan', Loan_Amount: '2L – 40L', Loan_Interest: '10.5%' }
      ];
    } else if (['Medium', 'Medium Value Customers'].includes(risk)) {
      return [
        { Loan_Type: 'Personal Loan', Loan_Amount: '50K – 15L', Loan_Interest: '14%' },
        { Loan_Type: 'Education Loan', Loan_Amount: '2L – 25L', Loan_Interest: '9.5%' },
        { Loan_Type: 'Gold Loan', Loan_Amount: '50K – 10L', Loan_Interest: '8.5%' }
      ];
    }
    return [
      { Loan_Type: 'Gold Loan', Loan_Amount: '25K – 5L', Loan_Interest: '12%' },
      { Loan_Type: 'Micro Loan', Loan_Amount: '10K – 2L', Loan_Interest: '18%' }
    ];
  };

  const eligibleLoans = getEligibleLoans(riskLevel);

  const [formData, setFormData] = useState({
    loanType: eligibleLoans[0].Loan_Type,
    amount: '',
    tenure: '12',
    reason: ''
  });

  // 2. Fetch Legacy Records
  useEffect(() => {
    fetch('/bankData.json')
      .then((res) => res.json())
      .then((json) => setBankData(json))
      .catch((err) => console.error("Legacy data fetch error:", err));
  }, []);

  // 3. REAL-TIME Listener for Loan Applications
  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(collection(userDB, 'loanApplications'), where('userId', '==', currentUser.uid));
    
    return onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirebaseApplications(apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });
  }, [currentUser]);

  // 4. Combined History Logic
  const combinedHistory = useMemo(() => {
    if (!currentUser?.email) return firebaseApplications;
    const legacyHistory = bankData
      .filter(item => item.Email?.toLowerCase() === currentUser.email.toLowerCase())
      .map((item, index) => ({
        id: item["Loan ID"] || `legacy-${index}`,
        loanType: (item["Loan Type"] || "General") + " Loan",
        amount: item["Loan Amount"] || 0,
        tenureMonths: item["Loan Term"] || 0,
        status: item["Loan Status"]?.toLowerCase() || 'resolved',
        createdAtDate: item["Approval/Rejection Date"],
        source: 'legacy'
      }));
    
    return [...firebaseApplications, ...legacyHistory].sort((a, b) => {
      const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAtDate || 0).getTime();
      const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAtDate || 0).getTime();
      return dateB - dateA;
    });
  }, [firebaseApplications, bankData, currentUser]);

  // 5. Submit Application (UPDATED: RESOLVED NAME LOGIC)
  const handleApply = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid || !currentUser?.email) return;
    if (!formData.amount || !formData.reason) return;

    // RESOLVE REAL NAME: Checks firstName/lastName (New users) or First Name/Last Name (Legacy)
    const fName = currentUser.firstName || currentUser["First Name"] || "";
    const lName = currentUser.lastName || currentUser["Last Name"] || "";
    const resolvedName = currentUser.fullName || `${fName} ${lName}`.trim() || "Vajra Member";

    setSubmitting(true);
    const toastId = toast.loading("Transmitting application to Vault...");

    try {
      await addDoc(collection(userDB, 'loanApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email.toLowerCase(),
        userName: resolvedName, // Fixed Name passed to Admin
        loanType: formData.loanType,
        amount: Number(formData.amount),
        tenureMonths: Number(formData.tenure),
        reason: formData.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      toast.success("Application successfully filed!", { id: toastId });
      setFormData({ ...formData, amount: '', reason: '' });
    } catch (err) {
      console.error(err);
      toast.error("Transmission failed", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-indigo-500 font-black tracking-widest uppercase">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Syncing Financial Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
          <Bank className="text-blue-500" /> Loans <span className="text-slate-500">&</span> Credit
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Capital Access Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl sticky top-24">
            <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 uppercase">
              <CashCoin className="text-emerald-500" /> Request Capital
            </h3>
            
            <form onSubmit={handleApply} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Loan Category</label>
                <select
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-4 text-white focus:border-blue-500 outline-none transition cursor-pointer appearance-none"
                  value={formData.loanType}
                  onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                >
                  {eligibleLoans.map((loan) => (
                    <option key={loan.Loan_Type} value={loan.Loan_Type} className="bg-slate-900">
                      {loan.Loan_Type} ({loan.Loan_Interest})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Principal Amount (₹)</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-4 text-white focus:border-blue-500 outline-none transition"
                  placeholder={`Limit: ${eligibleLoans.find(l => l.Loan_Type === formData.loanType)?.Loan_Amount}`}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Purpose of Credit</label>
                <textarea
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-4 text-white focus:border-blue-500 outline-none transition h-24 resize-none"
                  placeholder="Reason for application"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-white hover:bg-slate-200 disabled:bg-slate-800 text-slate-950 font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95"
              >
                {submitting ? 'Authenticating...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 uppercase">
              <ClockHistory className="text-blue-500" /> Transactional Feed
            </h3>
            <div className="space-y-4">
              {combinedHistory.map((app) => (
                <div key={app.id} className="group bg-slate-950/50 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-blue-500/30 transition-all duration-500">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-white text-xl font-black uppercase tracking-tight">{app.loanType}</p>
                    <p className="text-blue-400 font-mono text-lg font-bold">₹{app.amount?.toLocaleString()}</p>
                  </div>
                  <div className="md:text-right flex flex-col justify-end">
                    <div className="text-slate-500 text-[10px] font-bold flex items-center md:justify-end gap-2 uppercase">
                      <FileEarmarkText size={12} />
                      {app.createdAt ? app.createdAt.toDate().toLocaleDateString() : app.createdAtDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}