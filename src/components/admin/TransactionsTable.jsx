import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2 } from 'lucide-react';

export default function TransactionsTable() {
  const transactions = [
    { id: 1, user: 'Mahesh', type: 'Transfer', amount: 25000, status: 'Completed', date: '2 mins ago' },
    // You can map through more data here
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* TABLE HEADER */}
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">
          Recent Transactions
        </h4>
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md uppercase tracking-tighter">
          Live Feed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Entity</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vector</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Magnitude</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.02]">
            {transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                      {tx.user.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-none mb-1">{tx.user}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{tx.date}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    {tx.type === 'Transfer' ? (
                      <ArrowUpRight size={14} className="text-indigo-400" />
                    ) : (
                      <ArrowDownLeft size={14} className="text-emerald-400" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-tight">{tx.type}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-mono font-black text-white tracking-tighter">
                    ₹{tx.amount.toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                      tx.status === 'Completed' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {tx.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {tx.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-3 bg-black/20 border-t border-white/5">
        <button className="w-full py-2 text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-[0.3em] transition-colors">
          View Full Ledger
        </button>
      </div>
    </div>
  );
}