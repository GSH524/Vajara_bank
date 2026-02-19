import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import { Bank, CashCoin, CheckCircle, XCircle, ClockHistory, FileEarmarkText, InfoCircle } from 'react-bootstrap-icons';

export default function Loans() {
  const location = useLocation();
  const riskLevel = location.state?.riskLevel || 'Medium';
  const { currentUser, loading: authLoading } = useCurrentUser();
  const [firebaseApplications, setFirebaseApplications] = useState([]);
  const [bankData, setBankData] = useState([]);

  const getEligibleLoans = (risk) => {
    if (risk === 'Low' || risk === 'Safe' || risk === 'High Value Customers') {
      return [
        { Loan_Type: 'Home Loan', Loan_Amount: '30L – 5Cr', Loan_Interest: '8.25 – 9.25%' },
        { Loan_Type: 'Auto Loan', Loan_Amount: '5L – 50L', Loan_Interest: '8.5 – 10%' },
        { Loan_Type: 'Personal Loan', Loan_Amount: '2L – 40L', Loan_Interest: '10 – 12.5%' }
      ];
    } else if (risk === 'Medium' || risk === 'Medium Value Customers') {
      return [
        { Loan_Type: 'Personal Loan', Loan_Amount: '50K – 15L', Loan_Interest: '13 – 18%' },
        { Loan_Type: 'Education Loan', Loan_Amount: '2L – 25L', Loan_Interest: '9 – 12%' },
        { Loan_Type: 'Gold Loan', Loan_Amount: '50K – 10L', Loan_Interest: '8 – 12%' }
      ];
    } else {
      return [
        { Loan_Type: 'Gold Loan', Loan_Amount: '25K – 5L', Loan_Interest: '12 – 20%' },
        { Loan_Type: 'Micro Loan', Loan_Amount: '10K – 2L', Loan_Interest: '18 – 28%' }
      ];
    }
  };

  const eligibleLoans = getEligibleLoans(riskLevel);

  const [formData, setFormData] = useState({
    loanType: eligibleLoans[0].Loan_Type,
    amount: '',
    tenure: '12',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/bankData.json')
      .then((res) => res.json())
      .then((json) => setBankData(json))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(collection(userDB, 'loanApplications'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data(), source: 'firebase' });
      });
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setFirebaseApplications(apps);
    });
    return () => unsubscribe();
  }, [currentUser]);

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
    const combined = [...firebaseApplications, ...legacyHistory.slice(0, 1)];
    return combined.sort((a, b) => {
      const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAtDate || 0).getTime();
      const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAtDate || 0).getTime();
      return dateB - dateA;
    });
  }, [firebaseApplications, bankData, currentUser]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid || !currentUser?.email) return;
    if (!formData.amount || !formData.reason) return;
    setSubmitting(true);
    try {
      await addDoc(collection(userDB, 'loanApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.firstName || "Srihari",
        loanType: formData.loanType,
        amount: Number(formData.amount),
        tenureMonths: Number(formData.tenure),
        reason: formData.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setFormData({ loanType: eligibleLoans[0].Loan_Type, amount: '', tenure: '12', reason: '' });
    } catch (err) {
      console.error(err);
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

      <div className="mb-12">
        <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
          <ClockHistory className="text-blue-400" /> Application & Loan History
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {combinedHistory.map(app => (
            <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4 transition-all hover:border-slate-700">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : (app.status === 'approved' || app.status === 'resolved') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
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
              {eligibleLoans.map((loan) => (
                <option key={loan.Loan_Type} value={loan.Loan_Type}>
                  {loan.Loan_Type} ({loan.Loan_Interest})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-medium">Amount (₹)</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
              placeholder={`e.g. within ${eligibleLoans.find(l => l.Loan_Type === formData.loanType)?.Loan_Amount}`}
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