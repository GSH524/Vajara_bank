import React, { useState } from 'react';
// Importing icons
import { 
  LuTrendingUp, 
  LuShieldCheck, 
  LuZap, 
  // LuPieChart, // REMOVED to prevent error
  LuGem, 
  LuArrowRight, 
  LuCircleCheck, 
  LuGlobe,
  LuLayoutDashboard,
  LuHistory,
  LuStar
} from "react-icons/lu";

// Added MdPieChart here
import { 
  MdOutlineCorporateFare, 
  MdOutlineAccountBalanceWallet, 
  MdPieChart 
} from "react-icons/md";

import { HiOutlineInformationCircle } from "react-icons/hi2";

export default function Investments() {
  const [activeCategory, setActiveCategory] = useState('mutual-funds');

  const investmentPlans = {
    'mutual-funds': [
      { name: "SRK Bluechip Growth Fund", returns: "18.4%", risk: "Low to Moderate", minInvest: "500", rating: 5, category: "Large Cap", trend: "+2.4%" },
      { name: "Global Technology ETF", returns: "24.1%", risk: "High Risk", minInvest: "1,000", rating: 4, category: "Thematic", trend: "+5.1%" },
      { name: "Vajra Tax Saver (ELSS)", returns: "16.8%", risk: "Moderate", minInvest: "500", rating: 5, category: "Tax Saving", trend: "+1.2%" },
    ],
    'stocks': [
      { name: "SRK Top 10 Smallcase", returns: "32.1%", risk: "High Risk", minInvest: "15,000", rating: 5, category: "Quant Strategy", trend: "+8.4%" },
      { name: "Dividend Aristocrats", returns: "14.2%", risk: "Low Risk", minInvest: "5,000", rating: 4, category: "Income", trend: "+0.5%" },
      { name: "Bluechip Momentum", returns: "21.5%", risk: "Moderate", minInvest: "2,500", rating: 5, category: "Equity", trend: "+3.1%" },
    ],
    'bonds': [
      { name: "RBI Tax-Free Bonds", returns: "7.1%", risk: "Sovereign", minInvest: "10,000", rating: 5, category: "Govt", trend: "Stable" },
      { name: "Corporate Gold Debenture", returns: "11.5%", risk: "Moderate", minInvest: "25,000", rating: 4, category: "Corporate", trend: "-0.2%" },
      { name: "Infrastructure Bonds", returns: "9.2%", risk: "Low", minInvest: "5,000", rating: 4, category: "Tax-Free", trend: "Stable" },
    ]
  };

  const stats = [
    { label: "Assets Managed", value: "₹45,000Cr+" },
    { label: "Active Investors", value: "2.4M" },
    { label: "Avg. Returns", value: "14.2% p.a" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-['Outfit'] selection:bg-indigo-500/30 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <LuGem className="text-indigo-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">SRK Bank Wealth Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Invest Smarter. <br />
            <span className="text-slate-500">Live Better.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
             Institutional-grade portfolios powered by SRK Bank's proprietary algorithms. 
            Join 2 million+ Indians building their future today.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-900/20 active:scale-95 flex items-center gap-2">
              Start Investing <LuArrowRight />
            </button>
            <button className="px-8 py-4 bg-slate-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2">
              Advisor Connect <HiOutlineInformationCircle />
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-950/50 border border-white/5 rounded-[2.5rem] backdrop-blur-md">
          {stats.map((s, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">{s.value}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INVESTMENT CATEGORIES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-4xl font-black text-white mb-4">Choose Your <span className="text-indigo-500">Path</span></h2>
            <div className="w-20 h-1 bg-indigo-600 rounded-full mb-8"></div>
            
            {/* TAB SELECTOR */}
            <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10 backdrop-blur-xl sticky top-24 z-10">
              {[
                // Using MdPieChart here
                { id: 'mutual-funds', label: 'Mutual Funds', icon: <MdPieChart /> },
                { id: 'stocks', label: 'Equity Markets', icon: <LuTrendingUp /> },
                { id: 'bonds', label: 'Fixed Income', icon: <MdOutlineCorporateFare /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeCategory === tab.id 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                    : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC PLAN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentPlans[activeCategory].map((plan, idx) => (
              <div key={idx} className="relative group bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:bg-slate-950 transition-all hover:border-indigo-500/40 hover:-translate-y-2">
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                    plan.risk === 'High Risk' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {plan.category}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <LuStar size={14} fill="currentColor" />
                    <span className="text-sm font-bold">{plan.rating}.0</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 leading-tight">{plan.name}</h3>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-8">
                  <LuTrendingUp /> {plan.trend} performance today
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Returns</div>
                    <div className="text-xl font-black text-white">{plan.returns}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Min. Entry</div>
                    <div className="text-xl font-black text-white">₹{plan.minInvest}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <LuCircleCheck className="text-indigo-500" />
                    <span>Instant Redemption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <LuShieldCheck className="text-indigo-500" />
                    <span>Risk-adjusted Strategy</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95">
                  Secure This Investment
                </button>
              </div>
            ))}

            {/* AI SUGGESTION CARD */}
            <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
              <LuZap className="absolute top-10 right-10 text-white/10" size={120} />
              <div className="relative z-10">
                <LuLayoutDashboard size={48} className="mb-6 mx-auto" />
                <h3 className="text-2xl font-black mb-2">Not Sure?</h3>
                <p className="text-indigo-100 text-sm mb-8 leading-relaxed opacity-80">
                  Take our 2-minute goal assessment and let SRK AI suggest a customized wealth map for you.
                </p>
                <button className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  Analyze My Goals
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALPHA ENGINE VISUAL */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto bg-slate-950 border border-white/10 rounded-[3rem] p-10 lg:p-20 shadow-3xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                    <LuZap /> Active Intelligence
                 </div>
                 <h2 className="text-5xl font-black text-white mb-6">SRK Alpha <br /><span className="text-slate-600">Engine v4.0</span></h2>
                 <p className="text-slate-400 mb-8 leading-relaxed">
                   Our proprietary Quant models rebalance your equity portfolio in real-time based on 
                   volatility shifts. Beat the market with automated precision.
                 </p>
                 <div className="flex items-center gap-6 mb-10">
                    <div className="flex items-center gap-2">
                       <LuTrendingUp className="text-emerald-500" />
                       <span className="text-sm font-bold">22.4% Alpha</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <LuHistory className="text-indigo-500" />
                       <span className="text-sm font-bold">5 Year Track Record</span>
                    </div>
                 </div>
                 <button className="px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all">
                    View Model Performance
                 </button>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 shadow-inner relative group">
                 <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-bold text-slate-400">Live Strategy Growth</span>
                    <span className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded font-black uppercase tracking-tighter">Live Beat</span>
                 </div>
                 <div className="h-64 flex items-end gap-3">
                    {[35, 55, 40, 85, 60, 75, 95, 80, 100].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-indigo-600/40 rounded-t-lg group-hover:bg-indigo-600 transition-all duration-500" />
                    ))}
                 </div>
                 <div className="mt-6 flex justify-between text-slate-600 text-[10px] font-mono tracking-widest">
                    <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* DISCLOSURE FOOTER */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-10 mb-12 text-slate-700 grayscale">
             <LuGlobe size={32}/>
             <MdOutlineAccountBalanceWallet size={32}/>
             <LuShieldCheck size={32}/>
             <MdOutlineCorporateFare size={32}/>
          </div>
          <p className="text-slate-600 text-[10px] leading-relaxed uppercase tracking-tighter">
            Investment in securities market are subject to market risks. Read all the related documents carefully before investing. 
            SRK Bank Ltd. is a SEBI registered investment advisor INA000012345. Headquarters: Guntur, AP.
          </p>
        </div>
      </section>
    </div>
  );
}