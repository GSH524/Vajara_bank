import React from 'react';
import { 
  CurrencyExchange, 
  HouseHeart, 
  Briefcase, 
  Lightning, 
  Calculator, 
  FileCheck, 
  Percent, 
  ClockHistory,
  ShieldCheck,
  ArrowRightCircle
} from 'react-bootstrap-icons';

export default function LoanRules() {
  const loanProducts = [
    {
      title: "Instant Personal Loan",
      rate: "10.49%",
      icon: <CurrencyExchange size={32} className="text-blue-500" />,
      features: ["Disbursal in 10 Mins", "Zero Documentation", "Flexi-EMI Options"],
      limit: "Up to ₹25 Lakhs"
    },
    {
      title: "Vajra Home Loans",
      rate: "8.40%",
      icon: <HouseHeart size={32} className="text-emerald-500" />,
      features: ["Digital Sanction", "Overdraft Facility", "Transfer Existing Loan"],
      limit: "Up to ₹10 Crores"
    },
    {
      title: "Business Growth Capital",
      rate: "12.00%",
      icon: <Briefcase size={32} className="text-indigo-500" />,
      features: ["Collateral Free", "Revenue-Based Pay", "Equipment Financing"],
      limit: "Up to ₹1 Crore"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-['Outfit'] selection:bg-blue-500/30">
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-20 px-6">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <Lightning className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">Instant Approval Engine 2.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85]">
            CREDIT <br />
            <span className="text-slate-800 italic">WITHOUT LIMITS.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Stop waiting for approvals. Vajra's AI-driven credit scoring provides instant 
            liquidity for your dreams with zero hidden charges.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-95">
              Check Credit Score
            </button>
            <button className="px-8 py-4 bg-slate-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2">
              <Calculator /> EMI Calculator
            </button>
          </div>
        </div>
      </section>

      {/* LOAN CARDS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {loanProducts.map((loan, i) => (
            <div key={i} className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-blue-500/40 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all" />
              <div className="mb-6">{loan.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{loan.title}</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-6">Starting @ {loan.rate} p.a</p>
              
              <ul className="space-y-4 mb-10">
                {loan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-400">
                    <FileCheck className="text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Max Limit</p>
                  <p className="text-lg font-black text-white">{loan.limit}</p>
                </div>
                <button className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                  <ArrowRightCircle size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REASONS SECTION */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-blue-900/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Why Vajra <span className="text-blue-500">Lending?</span></h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <ClockHistory />, t: "100% Digital", d: "No physical meetings or paperwork required." },
              { icon: <Percent />, t: "Lowest Rates", d: "Competitive pricing based on your credit health." },
              { icon: <ShieldCheck />, t: "No Hidden Costs", d: "What you see is what you pay. No foreclosure fees." },
              { icon: <Lightning />, t: "Flash Disbursement", d: "Funds in your account before you finish coffee." }
            ].map((item, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 mx-auto md:mx-0">
                  {React.cloneElement(item.icon, { size: 24 })}
                </div>
                <h4 className="text-white font-bold mb-3">{item.t}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY BANNER */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-2 uppercase">Ready to elevate?</h3>
            <p className="text-blue-100 font-medium">Check your pre-approved loan offer in 60 seconds.</p>
          </div>
          <button className="relative z-10 px-10 py-5 bg-white text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-2xl">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}