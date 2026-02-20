import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import UserAnalytics from '../../components/user/UserAnalytics';
import RecommendationSection from "../../pages/user/Recommendations";
import { ArrowUpRight, Plus, Activity, PersonBadge, ArrowDownLeft, Wallet, Copy } from 'react-bootstrap-icons';
import { userDB } from "../../firebaseUser";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import CreditUtilization from '../../components/user/CreditUtilization';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [firestoreBankData, setFirestoreBankData] = useState([]);
  const [firestoreNewUserData, setFirestoreNewUserData] = useState([]);
  const [firebaseTxns, setFirebaseTxns] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState("Analyzing...");
  const [displayRisk, setDisplayRisk] = useState("Analyzing...");
  const [rawLatestRecord, setRawLatestRecord] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCibil, setShowCibil] = useState(false);
  const [isCheckingCibil, setIsCheckingCibil] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!user?.email) return;
    const q1 = query(collection(userDB, "users1"), where("Email", "==", user.email));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirestoreBankData(data);
      if (data.length > 0) setDataLoading(false);
    });

    const q2 = query(collection(userDB, "users"), where("Email", "==", user.email));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirestoreNewUserData(data);
      setDataLoading(false);
    });

    const q3 = query(collection(userDB, "transfer"), where("senderEmail", "==", user.email.toLowerCase()));
    const unsub3 = onSnapshot(q3, (snapshot) => {
      const txns = snapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type === "Deposit" ? 'Deposit' : 'Transfer',
        amount: doc.data().amount,
        date: doc.data().timestamp?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        reason: doc.data().reason || "Transaction",
      }));
      setFirebaseTxns(txns);
    });
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [user]);

  const userData = useMemo(() => {
    if (!user) return null;
    const bankRecord = firestoreBankData[0];
    const newRecord = firestoreNewUserData[0];
    const activeRecord = bankRecord || newRecord;
    if (!activeRecord) return null;

    const historicalTxns = firestoreBankData.filter(item => item.TransactionID).map(item => ({
      id: item.TransactionID,
      type: item["Transaction Type"] === "Withdrawal" ? 'Transfer' : 'Deposit',
      amount: item["Transaction Amount"],
      date: item["Transaction Date"],
      reason: item["Transaction_Reason"] || item["Transaction Type"]
    }));

    if (!rawLatestRecord || rawLatestRecord["Customer ID"] !== activeRecord["Customer ID"]) {
      setRawLatestRecord(activeRecord);
    }

    return {
      firstName: activeRecord["First Name"] || "User",
      lastName: activeRecord["Last Name"] || "",
      fullName: `${activeRecord["First Name"] || ""} ${activeRecord["Last Name"] || ""}`.trim(),
      email: activeRecord["Email"],
      profilePic: activeRecord["profilePic"] || null,
      address: activeRecord["Address"] || "Not Set",
      contact: activeRecord["Contact Number"] || "N/A",
      gender: activeRecord["Gender"] || "N/A",
      age: activeRecord["Age"] || "N/A",
      customerId: activeRecord["Customer ID"] || "Pending",
      accountNumber: activeRecord["Account_Number"] || "Processing...",
      accountType: activeRecord["Account Type"] || "Savings",
      branchId: activeRecord["Branch ID"] || "Main",
      ifscCode: activeRecord["IFSC Code"] || "VAJ000524",
      balance: Number(activeRecord["Account Balance"] || 0),
      rewards: Number(activeRecord["Rewards Points"] || 0),
      cibil: Number(activeRecord["CIBIL_Score"] || 0),
      panCard: activeRecord["PAN_Card"] || "N/A",
      creditLimit: Number(activeRecord["Credit Limit"] || 50000),
      ccBalance: Number(activeRecord["Credit Card Balance"] || 0),
      status: activeRecord["ActiveStatus"] || "Pending",
      isExistedUser: !!bankRecord,
      transactions: [...firebaseTxns, ...historicalTxns].sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  }, [firestoreBankData, firestoreNewUserData, user, firebaseTxns, rawLatestRecord]);

  useEffect(() => {
    if (rawLatestRecord) {
      setIsAnalyzing(true);
      fetch("http://localhost:8000/api/predict-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawLatestRecord)
      })
        .then(res => res.json())
        .then(data => setRiskLevel(data.success ? data.predictedRisk : "Low"))
        .catch(() => setRiskLevel("Safe"))
        .finally(() => setIsAnalyzing(false));
    }
  }, [rawLatestRecord]);

  useEffect(() => {
    setDisplayRisk(isAnalyzing ? "Analyzing..." : riskLevel);
  }, [isAnalyzing, riskLevel]);

  const handleCibilCheck = () => {
    setIsCheckingCibil(true);
    setTimeout(() => {
      setIsCheckingCibil(false);
      setShowCibil(true);
      let start = 0;
      const end = Math.round(userData?.cibil || 300);
      const timer = setInterval(() => {
        start += Math.ceil(end / 40);
        if (start >= end) { setAnimatedScore(end); clearInterval(timer); }
        else { setAnimatedScore(Math.floor(start)); }
      }, 30);
    }, 1500);
  };

  const handleApply = (title, category) => {
    const routeMap = {
      'Scheme': '/user/schemes',
      'Investment': '/user/investments',
      'Credit Card': '/user/credit-cards',
      'Debit Card': '/user/debit-cards'
    };
    navigate(routeMap[category] || '/user/dashboard', {
      state: { riskLevel: displayRisk, product: title, userData: userData }
    });
  };

  if (authLoading || (dataLoading && !userData)) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-[10px] tracking-widest uppercase opacity-50">Syncing Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl overflow-hidden">
            {userData?.profilePic ? (
              <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="uppercase">{userData?.firstName[0]}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">{userData?.fullName}</h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest">ID: {userData?.customerId}</p>
          </div>
        </div>
        <button onClick={() => navigate('/user/transfer')} className="flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-200 px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-lg">
          <Plus size={20} /> New Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100/70 text-xs font-bold uppercase tracking-widest">Available Balance</p>
            <h2 className="text-4xl font-black text-white mt-2">₹{userData?.balance.toLocaleString()}</h2>
            <p className="text-white/40 font-mono text-[10px] mt-4 uppercase">A/C: {userData?.accountNumber}</p>
          </div>
          <Wallet size={100} className="absolute -bottom-6 -right-6 text-white/10" />
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem]">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity className={isAnalyzing ? "animate-spin" : ""} size={14} /> Risk Level
          </p>
          <h3 className={`text-2xl font-black mt-2 ${displayRisk === 'High' ? 'text-rose-500' : 'text-emerald-400'}`}>{displayRisk}</h3>
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem]">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Rewards</p>
          <h3 className="text-2xl font-black text-white mt-2">{Math.floor(userData?.rewards)}</h3>
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col justify-center text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
          <span className="px-3 py-1 text-[10px] font-black rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 uppercase mx-auto">{userData?.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6">
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-40 flex items-center gap-2">
              <PersonBadge size={14} /> Profile Credentials
            </h4>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase">PAN Card</span>
                <span className="text-indigo-400 font-mono font-bold uppercase">{userData?.panCard}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase">Gender / Age</span>
                <span className="text-white font-bold">{userData?.gender} / {userData?.age}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase">Nominee</span>
                <span className="text-white font-bold">{userData?.nomineeName} ({userData?.nomineeRelation})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase">Contact</span>
                <span className="text-white">{userData?.contact}</span>
              </div>
              
              <div className="flex justify-between border-b border-white/5 pb-2 items-center">
                <span className="text-slate-500 uppercase">IFSC Code</span>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-300 font-mono">{userData?.ifscCode}</span>
                  <button onClick={() => navigator.clipboard.writeText(userData?.ifscCode)} className="text-slate-500 hover:text-white transition-colors">
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              <div className="py-4 min-h-[140px] flex flex-col items-center justify-center bg-slate-950/50 rounded-2xl border border-white/5 mt-4">
                {!showCibil && !isCheckingCibil && (
                  <button onClick={handleCibilCheck} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-full transition-all shadow-lg">
                    Check Credit Score
                  </button>
                )}
                {isCheckingCibil && <div className="w-8 h-8 border-2 border-t-indigo-500 rounded-full animate-spin"></div>}
                {showCibil && (
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent"
                          strokeDasharray={226} strokeDashoffset={226 - (226 * animatedScore) / 900}
                          strokeLinecap="round" className={`${animatedScore > 700 ? 'text-emerald-400' : 'text-amber-400'} transition-all duration-700`}
                        />
                      </svg>
                      <span className="absolute text-xl font-black font-mono">{Math.floor(animatedScore)}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Financial CREDIT SCORE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <span className="font-black text-white uppercase text-xs tracking-widest">Recent Transactions</span>
              <NavLink to="/user/transactions" className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest">Full History</NavLink>
            </div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
              {userData?.transactions.length > 0 ? userData.transactions.map((txn, i) => (
                <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${txn.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {txn.type === 'Deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{txn.reason}</p>
                      <p className="text-slate-500 text-[10px] uppercase">{txn.date}</p>
                    </div>
                  </div>
                  <div className={`font-mono font-bold ${txn.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {txn.type === 'Deposit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                  </div>
                </div>
              )) : <div className="p-20 text-center text-slate-600 italic text-sm">No activity recorded for this account.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <RecommendationSection riskLevel={displayRisk} onApply={handleApply} />
      </div>
      <div className="mt-8">
        <CreditUtilization used={userData?.ccBalance || 0} limit={userData?.creditLimit || 50000} />
      </div>
      <div className="mt-8">
        <UserAnalytics transactions={userData?.transactions || []} currentProfile={userData} />
      </div>
    </div>
  );
}