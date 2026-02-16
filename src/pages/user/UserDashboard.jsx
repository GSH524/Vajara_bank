import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import UserAnalytics from '../../components/user/UserAnalytics';
import RecommendationSection from "../../pages/user/Recommendations";
import { 
  ArrowUpRight, Plus, ShieldCheck, Wallet, 
  Activity, PersonBadge, GeoAlt, ArrowDownLeft, Bank,
  EyeFill, ShieldLock
} from 'react-bootstrap-icons';

// Firebase Imports
import { userDB } from "../../firebaseUser";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();  
  
  const [firestoreBankData, setFirestoreBankData] = useState([]);
  const [firebaseTxns, setFirebaseTxns] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // AI Risk Prediction States
  const [riskLevel, setRiskLevel] = useState("Analyzing...");
  const [displayRisk, setDisplayRisk] = useState("Analyzing...");
  const [rawLatestRecord, setRawLatestRecord] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // NEW: CIBIL Animation States
  const [showCibil, setShowCibil] = useState(false);
  const [isCheckingCibil, setIsCheckingCibil] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // 1. FETCH LIVE PROFILE DATA
  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(userDB, "users1"), where("Email", "==", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirestoreBankData(data);
      setDataLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setDataLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // 2. FETCH REAL-TIME TRANSFERS
  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(userDB, "transfer"), where("senderEmail", "==", user.email.toLowerCase()));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txns = snapshot.docs.map(doc => {
        const data = doc.data();
        const isDeposit = data.type === "Deposit";
        return {
          id: data.transactionId || doc.id,
          type: isDeposit ? 'Deposit' : 'Transfer',
          amount: data.amount,
          date: data.timestamp?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
          reason: data.reason || (isDeposit ? "Money Received" : "Fund Transfer"),
          isFirebase: true 
        };
      });
      setFirebaseTxns(txns);
    });
    return () => unsubscribe();
  }, [user]);

  // 3. DATA MAPPING
  const userData = useMemo(() => {
    if (!user || (firestoreBankData.length === 0 && dataLoading)) return null;
    const mainRecord = firestoreBankData.find(item => item.Email?.toLowerCase() === user.email?.toLowerCase());
    if (!mainRecord) return null;

    const historicalTxns = firestoreBankData.filter(item => item.TransactionID).map(item => ({
      id: item.TransactionID,
      type: item["Transaction Type"] === "Withdrawal" ? 'Transfer' : 'Deposit',
      amount: item["Transaction Amount"],
      date: item["Transaction Date"],
      reason: item["Transaction_Reason"] || item["Transaction Type"]
    }));

    const combinedTransactions = [...firebaseTxns, ...historicalTxns.slice(0,1)];
    
    if (!rawLatestRecord || rawLatestRecord["Customer ID"] !== mainRecord["Customer ID"]) {
      setRawLatestRecord(mainRecord);
    }

    return {
      firstName: mainRecord["First Name"]?.trim() || "User",
      lastName: mainRecord["Last Name"]?.trim() || "",
      fullName: `${mainRecord["First Name"]} ${mainRecord["Last Name"]}`,
      age: mainRecord["Age"],
      gender: mainRecord["Gender"],
      address: mainRecord["Address"],
      contact: mainRecord["Contact Number"],
      email: mainRecord["Email"],
      dateOpened: mainRecord["Date Of Account Opening"],
      customerId: mainRecord["Customer ID"],
      accountNumber: mainRecord["Account_Number"],
      balance: mainRecord["Account Balance"],
      rewards: mainRecord["Rewards Points"] || 0,
      accountType: mainRecord["Account Type"],
      status: mainRecord["ActiveStatus"],
      cibil: mainRecord["CIBIL_Score"],
      panCard: mainRecord["PAN_Card"],
      loanStatus: mainRecord["Loan Status"],
      transactions: combinedTransactions
    };
  }, [firestoreBankData, user, firebaseTxns, dataLoading, rawLatestRecord]);

  // 4. AI RISK LOGIC
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
      .catch(() => setRiskLevel("Safe"));

      const timer = setTimeout(() => setIsAnalyzing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [rawLatestRecord]);

  useEffect(() => {
    setDisplayRisk(isAnalyzing ? "Analyzing..." : riskLevel);
  }, [isAnalyzing, riskLevel]);

  // CIBIL CHECK HANDLER
  const handleCibilCheck = () => {
    setIsCheckingCibil(true);
    setTimeout(() => {
      setIsCheckingCibil(false);
      setShowCibil(true);
      let start = 0;
      const end = Math.round(userData.cibil);
      const timer = setInterval(() => {
        start += Math.ceil(end / 30);
        if (start >= end) {
          setAnimatedScore(end);
          clearInterval(timer);
        } else {
          setAnimatedScore(start);
        }
      }, 40);
    }, 2500);
  };

  if (authLoading || dataLoading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
          <p className="animate-pulse text-xs tracking-widest uppercase">Syncing Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
            {userData.firstName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest">UID: {userData.customerId}</p>
          </div>
        </div>
        <button onClick={() => navigate('/user/transfer')} className="flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-200 px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-lg">
          <Plus size={20} /> New Transaction
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100/70 text-xs font-bold uppercase tracking-widest">Account Balance</p>
            <h2 className="text-4xl font-black text-white mt-2">₹{userData.balance?.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4">
                <span className="text-white/50 font-mono text-xs tracking-widest">A/C: {userData.accountNumber}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white/80 uppercase">{userData.accountType}</span>
            </div>
          </div>
          <Wallet size={100} className="absolute -bottom-6 -right-6 text-white/10" />
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem]">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity className={isAnalyzing ? "animate-spin" : ""} size={14} /> Risk Analysis
          </p>
          <h3 className={`text-2xl font-black mt-2 ${displayRisk === 'High' ? 'text-rose-500' : 'text-emerald-400'}`}>
            {displayRisk}
          </h3>
          <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-tighter">AI Guardian Active</p>
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem]">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Vajra Rewards</p>
          <h3 className="text-2xl font-black text-white mt-2">{Math.floor(userData.rewards)}</h3>
          <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-tighter italic">Earn 1% on transfers</p>
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col justify-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Account Status</p>
          <span className={`px-3 py-1 text-[10px] font-black rounded-full border w-fit uppercase ${userData.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
            {userData.status}
          </span>
          <p className="text-white/40 text-[10px] mt-2 font-mono uppercase tracking-tighter">Loan: {userData.loanStatus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6">
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-40 flex items-center gap-2">
              <PersonBadge size={14}/> Vault Credentials
            </h4>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 uppercase">Age / Gender</span><span className="text-white font-bold">{userData.age} / {userData.gender}</span></div>
              <div className="flex flex-col border-b border-white/5 pb-2 gap-1"><span className="text-slate-500 uppercase flex items-center gap-1"><GeoAlt size={10}/> Location</span><span className="text-white leading-relaxed">{userData.address}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 uppercase">Contact</span><span className="text-white">{userData.contact}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 uppercase">PAN Card</span><span className="text-indigo-400 font-mono font-bold">{userData.panCard}</span></div>
              
              {/* ANIMATED CIBIL SECTION */}
              <div className="flex flex-col border-b border-white/5 pb-4 min-h-[40px] transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Credit Score</span>
                  {!showCibil && !isCheckingCibil && (
                    <button 
                      onClick={handleCibilCheck}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase rounded-lg border border-indigo-500/20 transition-all"
                    >
                      <EyeFill size={12}/> Check CIBIL
                    </button>
                  )}
                </div>

                {isCheckingCibil && (
                  <div className="mt-4 flex flex-col items-center animate-pulse">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
                    </div>
                    <p className="text-[9px] text-indigo-400 font-bold mt-2 tracking-widest uppercase">Decryption in progress...</p>
                  </div>
                )}

                {showCibil && (
                  <div className="mt-4 flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-24 h-14">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                        <path 
                          d="M 10 50 A 40 40 0 0 1 90 50" 
                          fill="none" 
                          stroke={animatedScore > 750 ? "#10b981" : "#6366f1"} 
                          strokeWidth="6" 
                          strokeLinecap="round" 
                          strokeDasharray="126" 
                          strokeDashoffset={126 - (126 * (animatedScore - 300)) / 600} 
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute top-5 text-center">
                        <span className="text-xl font-black text-white">{animatedScore}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${animatedScore > 750 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {animatedScore > 750 ? 'Excellent' : animatedScore > 650 ? 'Good' : 'Fair'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-1"><span className="text-slate-500 uppercase">A/C Since</span><span className="text-white">{userData.dateOpened}</span></div>
            </div>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <span className="font-black text-white uppercase text-xs tracking-widest">Recent Activity</span>
              <NavLink to="/user/transactions" className="text-indigo-400 text-[10px] hover:underline uppercase font-bold tracking-widest">View Full History</NavLink>
            </div>
            <div className="divide-y divide-white/5 max-h-[450px] overflow-y-auto">
              {userData.transactions.length > 0 ? (
                userData.transactions.map((txn, i) => (
                  <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${txn.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {txn.type === 'Deposit' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold group-hover:text-indigo-400 transition-colors">{txn.reason}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-tighter">{txn.date} {txn.isFirebase && "• Secure"}</p>
                      </div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${txn.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {txn.type === 'Deposit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-slate-600 font-mono text-xs uppercase tracking-widest">No activity detected</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <RecommendationSection riskLevel={displayRisk} />
      </div>

      <div className="mt-8">
        <UserAnalytics />
      </div>

      {/* CSS For Loading Animation */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}