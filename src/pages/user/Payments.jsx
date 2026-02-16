import React, { useState } from "react";
import { CreditCard, QrCodeScan, PersonPlus, Wallet2, Send, LightningCharge } from 'react-bootstrap-icons';

const Payments = () => {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");

  const quickTransfers = [
    { id: 1, name: "Rahul S.", avatar: "RS" },
    { id: 2, name: "Priya K.", avatar: "PK" },
    { id: 3, name: "Amit V.", avatar: "AV" },
    { id: 4, name: "Sonia M.", avatar: "SM" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Wallet2 className="text-blue-500" /> Payments & Transfers
        </h1>
        <p className="text-slate-400 mt-1">Seamlessly move funds or manage your UPI identity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* UPI CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <CreditCard className="text-blue-400" /> Your UPI ID
          </h2>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center justify-between mb-6">
            <span className="text-blue-400 font-mono font-medium tracking-wide">mahesh@vajrabank</span>
            <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all active:scale-95 font-bold uppercase">
              Copy
            </button>
          </div>

          <div className="group cursor-pointer bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center transition-all border-dashed">
            <div className="text-3xl text-slate-400 group-hover:text-blue-400 transition-colors mb-2">
              <QrCodeScan />
            </div>
            <p className="text-sm font-semibold text-slate-500 group-hover:text-slate-300">Show My QR Code</p>
          </div>
        </div>

        {/* QUICK TRANSFER */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <LightningCharge className="text-yellow-500" /> Quick Transfer
          </h2>

          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {quickTransfers.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-2 min-w-[70px] group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold group-hover:border-blue-500 transition-all group-active:scale-90 shadow-lg">
                  {p.avatar}
                </div>
                <span className="text-xs text-slate-400 font-medium group-hover:text-white truncate w-full text-center">{p.name}</span>
              </div>
            ))}
            
            <div className="flex flex-col items-center gap-2 min-w-[70px]">
              <button className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500 transition-all">
                <PersonPlus size={20} />
              </button>
              <span className="text-xs text-slate-500 font-medium italic">Add New</span>
            </div>
          </div>
        </div>

        {/* SEND MONEY */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Send className="text-blue-500 -rotate-12" /> Send Money
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
                placeholder="UPI ID / Mobile / Account"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner text-xl font-mono"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.99] flex items-center justify-center gap-3 text-lg">
              Proceed to Pay <Send size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;