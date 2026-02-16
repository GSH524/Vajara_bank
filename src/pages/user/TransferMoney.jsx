import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { userDB } from "../../firebaseUser";
import { 
  collection, addDoc, serverTimestamp, 
  query, where, getDocs, runTransaction, doc, onSnapshot 
} from "firebase/firestore";
import { 
  ArrowLeft, Send, Person, Hash, 
  CashCoin, CheckCircleFill, ExclamationTriangle, 
  Wallet, ChatDots, StarFill, Bank
} from 'react-bootstrap-icons';

export default function TransferMoney() {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [liveBalance, setLiveBalance] = useState(0); // Live balance state

  const [formData, setFormData] = useState({
    transactionId: `TXN${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    receiverAcc: '',
    receiverName: '',
    receiverDocId: '',
    receiverEmail: '',
    ifsc: 'VAJR000524',
    amount: '',
    reason: ''
  });

  // 1. FETCH LIVE SENDER BALANCE (Syncs immediately after transfer)
  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(userDB, "users1"), where("Email", "==", user.email));
    
    // Using onSnapshot ensures the balance updates the moment the transaction completes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setLiveBalance(data["Account Balance"] || 0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 2. ASYNC RECEIVER VERIFICATION
  const handleAccountChange = async (e) => {
    const acc = e.target.value;
    setFormData(prev => ({ ...prev, receiverAcc: acc, receiverName: '', receiverDocId: '', receiverEmail: '' }));
    setError(null);

    if (acc.length >= 8) {
      try {
        const q = query(
          collection(userDB, "users1"), 
          where("Account_Number", "==", Number(acc))
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const receiverDoc = querySnapshot.docs[0];
          const data = receiverDoc.data();
          setFormData(prev => ({ 
            ...prev, 
            receiverName: `${data["First Name"]} ${data["Last Name"]}`,
            receiverDocId: receiverDoc.id,
            receiverEmail: data["Email"]
          }));
        } else {
          setError("Account number not recognized in network.");
        }
      } catch (err) {
        console.error("Verification Error:", err);
      }
    }
  };

  // 3. TRANSACTION LOGIC
  const handleTransfer = async (e) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(formData.amount);
    const earnedPoints = Math.floor(amount * 0.01); 

    if (amount <= 0 || isNaN(amount)) {
        setError("Please enter a valid amount.");
        return;
    }

    if (amount > liveBalance) {
      setError(`Insufficient funds. Your balance: ₹${liveBalance.toLocaleString()}`);
      return;
    }

    if (!formData.receiverDocId) {
      setError("Please enter a valid receiver account.");
      return;
    }

    setLoading(true);

    try {
      await runTransaction(userDB, async (transaction) => {
        const senderQuery = query(collection(userDB, "users1"), where("Email", "==", user.email));
        const senderSnapshot = await getDocs(senderQuery);
        
        if (senderSnapshot.empty) throw new Error("Sender account record missing.");
        
        const senderDocRef = doc(userDB, "users1", senderSnapshot.docs[0].id);
        const receiverDocRef = doc(userDB, "users1", formData.receiverDocId);

        const sDoc = await transaction.get(senderDocRef);
        const rDoc = await transaction.get(receiverDocRef);

        if (!sDoc.exists() || !rDoc.exists()) throw new Error("Synchronization error. Try again.");

        const sData = sDoc.data();
        const rData = rDoc.data();

        const currentSenderBal = sData["Account Balance"] || 0;
        const currentReceiverBal = rData["Account Balance"] || 0;
        const currentPoints = sData["Rewards Points"] || 0;

        const newSenderBal = currentSenderBal - amount;
        const newReceiverBal = currentReceiverBal + amount;
        const newPoints = currentPoints + earnedPoints;

        transaction.update(senderDocRef, { 
            "Account Balance": newSenderBal,
            "Rewards Points": newPoints 
        });
        
        transaction.update(receiverDocRef, { 
            "Account Balance": newReceiverBal 
        });
      });

      // LOG ENTRIES
      await addDoc(collection(userDB, "transfer"), {
        transactionId: formData.transactionId,
        senderEmail: user.email.toLowerCase(),
        receiverAccount: formData.receiverAcc,
        receiverName: formData.receiverName,
        amount: amount,
        reason: formData.reason,
        type: "Withdrawal",
        status: "Success",
        timestamp: serverTimestamp()
      });

      await addDoc(collection(userDB, "transfer"), {
        transactionId: formData.transactionId + "-REC",
        senderEmail: formData.receiverEmail.toLowerCase(),
        senderName: `${user.firstName} ${user.lastName}`,
        amount: amount,
        reason: `Received from ${user.firstName}`,
        type: "Deposit", 
        status: "Success",
        timestamp: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => navigate('/user/dashboard'), 3500);
    } catch (err) {
      setError(err.message || "Vault transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="animate-in zoom-in duration-500 max-w-sm">
          <CheckCircleFill size={64} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Transfer Sent</h2>
          <p className="text-slate-400 font-mono text-xs tracking-widest mb-6">ID: {formData.transactionId}</p>
          <div className="bg-amber-400/10 border border-amber-400/20 py-3 px-6 rounded-2xl text-amber-400 font-bold flex items-center justify-center gap-2">
            <StarFill /> +{Math.floor(parseFloat(formData.amount) * 0.01)} Rewards
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Bank size={120} />
          </div>

          <div className="mb-8 relative z-10">
            <h1 className="text-2xl font-bold text-white">Fund Transfer</h1>
            <p className="text-slate-500 text-[10px] font-mono mt-1 tracking-widest uppercase">Vajra Network</p>
            
            <div className="mt-6 p-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Available Funds</p>
                {/* DISPLAY LIVE BALANCE HERE */}
                <p className="text-2xl font-black text-white">₹{liveBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs flex items-center gap-3">
              <ExclamationTriangle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-5 relative z-10">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2 ml-1">Receiver Account</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input required type="number" value={formData.receiverAcc} onChange={handleAccountChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 pl-12 text-white focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <div className={formData.receiverName ? "opacity-100" : "opacity-50"}>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2 ml-1">Beneficiary Name</label>
              <div className="relative">
                <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input readOnly type="text" value={formData.receiverName} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-indigo-400 font-bold" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2 ml-1">Transfer Amount (₹)</label>
              <div className="relative">
                <CashCoin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 pl-12 text-white focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2 ml-1">Transaction Note</label>
              <div className="relative">
                <ChatDots className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input required type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 pl-12 text-white focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>

            <button disabled={loading || !formData.receiverDocId} className="w-full bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98]">
              {loading ? "Authorizing..." : "Authorize Transaction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}