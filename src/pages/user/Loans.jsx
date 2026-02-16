import React, { useState, useEffect, useMemo } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import { 
  Bank, CashCoin, CheckCircle, XCircle, 
  ClockHistory, FileEarmarkText, InfoCircle 
} from 'react-bootstrap-icons';

export default function Loans() {
  // 1. Get current user data with loading state
  const { currentUser, loading: authLoading } = useCurrentUser();
  const [firebaseApplications, setFirebaseApplications] = useState([]);
  const [bankData, setBankData] = useState([]); 
  const [formData, setFormData] = useState({
    loanType: 'Personal Loan',
    amount: '',
    tenure: '12',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // 2. Fetch Legacy History from bankData.json
  useEffect(() => {
    fetch('/bankData.json')
      .then((res) => res.json())
      .then((json) => setBankData(json))
      .catch((err) => console.error("Error loading bank history:", err));
  }, []);

  // 3. Fetch Firebase Applications specifically for Srihari
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(userDB, 'loanApplications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data(), source: 'firebase' });
      });
      // Sort by creation date
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setFirebaseApplications(apps);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 4. Merge JSON and Firebase data without duplicates
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
        interestRate: item["Interest Rate"],
        outstanding: item["Total_Loan_Outstanding"],
        source: 'legacy'
      }));

    // Combine current Firebase apps with unique legacy records
    const combined = [...firebaseApplications, ...legacyHistory.slice(0,1)];
    
    return combined.sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAtDate || 0).getTime();
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAtDate || 0).getTime();
        return dateB - dateA;
    });
  }, [firebaseApplications, bankData, currentUser]);

  // 5. Submit Handler with Firebase validation
  const handleApply = async (e) => {
    e.preventDefault();
    
    // Safety check: ensure user data is loaded before writing to Firestore
    if (!currentUser?.uid || !currentUser?.email) {
      console.error("User context missing");
      return;
    }

    if (!formData.amount || !formData.reason) {
      return;
    }

    setSubmitting(true);
    try {
      // Create record in Firebase
      await addDoc(collection(userDB, 'loanApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        // Use fallbacks for names if display name is missing
        userName: currentUser.displayName || currentUser.firstName || "Srihari", 
        loanType: formData.loanType,
        amount: Number(formData.amount),
        tenureMonths: Number(formData.tenure),
        reason: formData.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setFormData({ loanType: 'Personal Loan', amount: '', tenure: '12', reason: '' });
      console.log("Loan application saved to Firestore");
    } catch (err) {
      console.error("Firestore Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 animate-pulse">
        Synchronizing Loan Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bank className="text-blue-500" /> Loans & Credit
        </h1>
        <p className="text-slate-400 mt-2">Manage your active loans and view historical performance.</p>
      </div>

      {/* HISTORY SECTION */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
          <ClockHistory className="text-blue-400" /> Application & Loan History
        </h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {combinedHistory.map(app => (
            <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4 transition-all hover:border-slate-700">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    app.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    (app.status === 'approved' || app.status === 'resolved') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {app.status}
                  </span>
                  <strong className="text-white font-semibold">{app.loanType}</strong>
                  {app.source === 'legacy' && (
                    <span className="text-[9px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700">Legacy</span>
                  )}
                </div>
                
                <p className="text-slate-300 text-lg font-medium">
                  ₹{app.amount?.toLocaleString()} <span className="text-slate-500 text-sm font-normal mx-2">|</span> 
                  <span className="text-sm font-normal text-slate-400">{app.tenureMonths} Months</span>
                </p>
                {app.interestRate && <p className="text-xs text-blue-400 mt-1">Interest Rate: {app.interestRate}%</p>}
              </div>

              <div className="md:text-right flex flex-col justify-end">
                <p className="text-slate-500 text-xs flex items-center md:justify-end gap-1">
                  <FileEarmarkText /> {app.createdAt ? app.createdAt.toDate().toLocaleDateString() : app.createdAtDate}
                </p>
                <p className="text-[10px] text-slate-700 mt-1 font-mono uppercase">{app.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPLICATION FORM */}
      <div className="max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <CashCoin className="text-blue-500" /> Apply for New Credit
        </h3>

        <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">Loan Type</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition cursor-pointer"
              value={formData.loanType}
              onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
            >
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Business Loan">Business Loan</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">Amount (₹)</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
              placeholder="e.g. 50000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-400 font-medium">Reason for Loan</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
              placeholder="State the purpose of this loan"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-max px-12 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
            >
              {submitting ? 'Verifying Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}