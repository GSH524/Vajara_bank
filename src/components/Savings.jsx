import React from 'react';
import { 
  PiggyBank, 
  Wallet2, 
  PhoneVibrate, 
  Percent, 
  ShieldShaded, 
  ArrowUpRight, 
  Cpu, 
  Gift, 
  Infinity as InfinityIcon,
  CreditCard2Back
} from 'react-bootstrap-icons';

export default function Savings() {
  const accountTypes = [
    {
      name: "Vajra Infinity",
      interest: "7.25%",
      minBalance: "Zero",
      color: "from-indigo-600 to-blue-600",
      features: ["Priority Banking", "Metal Debit Card", "Personal Concierge"]
    },
    {
      name: "Neo Savings",
      interest: "6.50%",
      minBalance: "₹10,000",
      color: "from-emerald-600 to-teal-600",
      features: ["Digital Only", "Virtual Card", "Smart Budgeting"]
    },
    {
      name: "Junior Saver",
      interest: "5.50%",
      minBalance: "₹1,000",
      color: "from-amber-600 to-orange-600",
      features: ["Gamified Goals", "Parental Control", "Debit Card"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-['Outfit']">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="p-3 bg-white/5 rounded-2xl mb-8 border border-white/10 animate-pulse">
            <PiggyBank className="text-indigo-500" size={32} />
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            REDEFINING <br />
            <span className="text-slate-700">LIQUIDITY.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Earn industry-leading interest rates on your idle money with 
            Vajra's automated smart-sweep savings technology.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-full transition-all text-xs uppercase tracking-widest">
              Join the Waitlist
            </button>
            <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/50 rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available on</span>
              <div className="flex gap-3">
                <span className="text-white text-xs font-bold font-mono">iOS</span>
                <span className="text-white text-xs font-bold font-mono">Android</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIERED ACCOUNTS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">Account <span className="text-indigo-500">Tiers</span></h2>
            <p className="text-slate-500 mt-2">Choose the experience that fits your financial status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accountTypes.map((tier, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900/50 border border-white/5 p-1 transition-all hover:border-white/20">
                <div className="p-8 h-full bg-[#0a0c10] rounded-[2.3rem] flex flex-col">
                  <div className={`inline-flex px-4 py-1 rounded-full bg-gradient-to-r ${tier.color} text-[10px] font-black uppercase tracking-widest text-white mb-6`}>
                    {tier.name}
                  </div>
                  <div className="mb-8">
                    <span className="text-5xl font-black text-white tracking-tighter">{tier.interest}</span>
                    <span className="text-slate-600 text-sm font-bold block mt-1 uppercase tracking-widest">Interest Rate p.a</span>
                  </div>
                  
                  <div className="space-y-4 mb-10 flex-grow">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-3 text-sm text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-indigo-400">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMART SAVINGS FEATURES */}
      <section className="py-24 px-6 bg-indigo-600/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl mt-12">
                <Cpu size={32} className="text-indigo-400 mb-4" />
                <h4 className="font-bold text-white mb-2">Smart Sweep</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Automatically transfers idle funds above a limit to High Yield FDs.</p>
              </div>
              <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl">
                <ShieldShaded size={32} className="text-indigo-400 mb-4" />
                <h4 className="font-bold text-white mb-2">DICGC Insured</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Every account is insured up to ₹5 Lakhs as per RBI mandates.</p>
              </div>
              <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl mt-4">
                <Gift size={32} className="text-indigo-400 mb-4" />
                <h4 className="font-bold text-white mb-2">Vajra Perks</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Complimentary airport lounge access and brand subscriptions.</p>
              </div>
              <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl -mt-8">
                <InfinityIcon size={32} className="text-indigo-400 mb-4" />
                <h4 className="font-bold text-white mb-2">0% Forex</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Spend anywhere in the world with zero markups on exchange.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-5xl font-black text-white leading-none">BANKING THAT <br /><span className="text-indigo-500">THINKS.</span></h2>
              <p className="text-slate-400 text-lg">
                Vajra Savings isn't just a place to store money. It's a financial ecosystem that tracks 
                your spending, suggests savings goals, and automates your growth.
              </p>
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl text-black">
                  <CreditCard2Back size={24} />
                </div>
                <div>
                  <h5 className="font-black text-white uppercase text-xs tracking-widest">Instant Virtual Card</h5>
                  <p className="text-slate-500 text-xs">Generated immediately after KYC approval.</p>
                </div>
              </div>
              <button className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-[0.3em] hover:gap-6 transition-all">
                See all features <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE (Condensed version) */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black text-slate-500">Feature</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black text-indigo-400 text-right">Vajra Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { f: "Interest Rate", v: "Up to 7.25% p.a" },
                { f: "Minimum Balance", v: "Zero Balance Account" },
                { f: "Debit Card", v: "Lifetime Free Metal Card" },
                { f: "Online Transfers", v: "Unlimited IMPS / NEFT" },
                { f: "Atm Withdrawals", v: "Unlimited at any ATM" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 text-sm font-medium text-slate-300">{row.f}</td>
                  <td className="px-8 py-5 text-sm font-black text-white text-right font-mono">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}