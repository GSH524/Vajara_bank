import React, { useState } from "react";
import { Globe, ArrowLeftRight, GlobeCentralSouthAsia, InfoCircle, ChevronRight } from 'react-bootstrap-icons';

const InternationalTransfer = () => {
  const [amount, setAmount] = useState("1000");
  const [currency, setCurrency] = useState("USD");

  const rates = {
    USD: 83.25,
    EUR: 90.12,
    GBP: 105.45,
    AED: 22.67,
  };

  const calculated = (amount * rates[currency]).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Globe className="text-blue-500" /> International Transfers
        </h1>
        <p className="text-slate-400 mt-2">Send funds globally with real-time exchange rates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CALCULATOR */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 ml-1">Exchange Calculator</h2>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-5 text-2xl font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-bold"
                  >
                    {Object.keys(rates).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-slate-600 bg-slate-800 p-3 rounded-full border border-slate-700">
                <ArrowLeftRight size={20} />
              </div>

              <div className="w-full bg-blue-600/10 border border-blue-500/20 rounded-2xl px-6 py-5 flex flex-col">
                <span className="text-2xl font-mono font-bold text-blue-400">₹ {calculated}</span>
                <span className="text-[10px] uppercase tracking-tighter text-blue-300/60 font-bold">Estimated INR Amount</span>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <p className="text-xs font-medium text-slate-400 italic">
                1 {currency} = ₹{rates[currency]} • Real-time Market Rate
              </p>
            </div>
          </div>

          <button className="mt-10 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98] text-lg uppercase tracking-wide">
            Initiate Global Transfer
          </button>
        </div>

        {/* COUNTRIES */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 ml-1">Popular Destinations</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            {["USA", "UK", "UAE", "Canada", "Germany", "Singapore"].map((country) => (
              <div 
                key={country} 
                className="group flex flex-col items-center justify-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl hover:bg-slate-800 hover:border-blue-500 transition-all cursor-pointer shadow-lg"
              >
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">🌍</div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white">{country}</span>
              </div>
            ))}
          </div>

          <button className="mt-8 text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center justify-center gap-2 group">
            View All 180+ Countries <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* INFO BOX */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <GlobeCentralSouthAsia size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="bg-blue-600/20 p-4 rounded-3xl text-blue-400">
              <InfoCircle size={32} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-white mb-2">Fast & Secure Global Transfers</h3>
              <p className="text-slate-400 leading-relaxed max-w-4xl">
                Send money to 180+ countries with competitive FX rates and no
                hidden charges. Most transfers complete within 24 hours with 
                end-to-end tracking and bank-grade security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalTransfer;