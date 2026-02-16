import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Download, Filter, X, ArrowDownLeft, ArrowUpRight, ClockHistory } from 'react-bootstrap-icons';

// Firebase Imports
import { userDB } from "../../firebaseUser";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Transactions() {
  const { currentUser, loading: authLoading } = useCurrentUser();
  const [firebaseTxns, setFirebaseTxns] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [page, setPage] = useState(1);

  // 1. LISTEN TO FIREBASE TRANSFERS (Dynamic Credit/Debit Logic)
  useEffect(() => {
    if (!currentUser?.email) return;

    // We query the "transfer" collection where the user is the logged "senderEmail"
    // Note: Our TransferMoney code saves the receiver's log with their own email in "senderEmail"
    const q = query(
      collection(userDB, "transfer"),
      where("senderEmail", "==", currentUser.email.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txns = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // DYNAMIC TYPE CHECKING:
        // If the transaction type is "Deposit", it is a Credit (Green icon)
        // Otherwise, it is a Debit (Red icon)
        const isCredit = data.type === 'Deposit'; 

        return {
          id: data.transactionId || doc.id,
          type: isCredit ? 'Credit' : 'Debit', 
          amount: data.amount,
          date: data.timestamp?.toDate() || new Date(),
          description: data.reason || (isCredit ? "Received Funds" : "Fund Transfer"),
          status: 'Success',
          isFirebase: true
        };
      });
      setFirebaseTxns(txns);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 2. MERGE & UNIQUE FILTERING
  const allTransactions = useMemo(() => {
    if (!currentUser) return [];

    const staticTxns = (currentUser.transactions || []).map(t => ({
      ...t,
      description: t.reason || (t.type === 'Credit' ? 'Deposit' : 'Withdrawal'),
      date: new Date(t.date),
      status: 'Success',
      isFirebase: false
    }));

    const merged = [...firebaseTxns, ...staticTxns];
    
    return merged.sort((a, b) => b.date - a.date).map(t => ({
      ...t,
      displayDate: t.date.toLocaleDateString()
    }));
  }, [currentUser, firebaseTxns]);

  // 3. FILTER & PAGINATE
  const filteredTxns = useMemo(() => {
    return allTransactions.filter(t => filterType === 'All' || t.type === filterType);
  }, [allTransactions, filterType]);

  const pagedTxns = filteredTxns.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filteredTxns.length / 10) || 1;

  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-slate-400 animate-pulse font-medium">Synchronizing Ledger...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ClockHistory className="text-blue-500" /> Transaction History
          </h1>
          <p className="text-slate-400 mt-1">Real-time records from your secure vault.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="All">All Activities</option>
              <option value="Credit">Credits Only</option>
              <option value="Debit">Debits Only</option>
            </select>
            <Filter className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" size={16} />
          </div>
          
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition border border-slate-700">
            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* TABLE CONTENT */}
      {filteredTxns.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-bold text-white">No Records Found</h3>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-[11px] uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-5 font-bold">Execution Date</th>
                  <th className="px-6 py-5 font-bold">Description</th>
                  <th className="px-6 py-5 font-bold hidden md:table-cell">Transaction ID</th>
                  <th className="px-6 py-5 font-bold text-right">Amount</th>
                  <th className="px-6 py-5 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {pagedTxns.map((txn) => (
                  <tr 
                    key={txn.id} 
                    onClick={() => setSelectedTxn(txn)}
                    className="group hover:bg-white/5 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">{txn.displayDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          txn.type === 'Credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {txn.type === 'Credit' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium group-hover:text-blue-400 transition">{txn.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono hidden md:table-cell">{txn.id}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${
                      txn.type === 'Credit' ? 'text-emerald-400' : 'text-slate-200'
                    }`}>
                      {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded border border-emerald-500/20">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}