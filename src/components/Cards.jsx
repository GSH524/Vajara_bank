import React from 'react';
import { 
  CreditCard2Front, 
  LayersHalf, 
  Airplane, 
  Stars, 
  Key, 
  Infinity as InfIcon,
  Fingerprint,
  Wallet,
  Tags,
  ShieldLockFill
} from 'react-bootstrap-icons';

export default function Cards() {
  const cards = [
    {
      name: "VAJRA CARBON",
      type: "Super Premium",
      material: "Handcrafted Carbon Fiber",
      color: "from-slate-800 to-black",
      fee: "₹10,000/yr",
      perks: ["Unlimited Lounge", "Personal Concierge", "5% Unlimited Rewards"]
    },
    {
      name: "VAJRA TITANIUM",
      type: "Lifestyle",
      material: "Brush-finish Metal",
      color: "from-blue-700 to-slate-900",
      fee: "₹2,500/yr",
      perks: ["Golf Access", "BOGO Movie Tickets", "3% Dining Cashback"]
    },
    {
      name: "VAJRA VIRTUAL",
      type: "Everyday",
      material: "Digital Only",
      color: "from-indigo-600 to-indigo-900",
      fee: "Free Forever",
      perks: ["Instant Generation", "Dynamic CVV", "Secure Online Pay"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-['Outfit']">
      
      {/* HEADER SECTION */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none italic uppercase">
            DESIGNED <br />
            <span className="text-indigo-600">TO DISTINGUISH.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Not just a payment tool. A statement of intent. Experience India's 
            most powerful metal credit cards.
          </p>
        </div>
      </section>

      {/* CARD SHOWCASE */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {cards.map((card, i) => (
            <div key={i} className="flex flex-col">
              {/* THE CARD VISUAL */}
              <div className={`aspect-[1.6/1] w-full rounded-2xl bg-gradient-to-br ${card.color} p-8 relative overflow-hidden shadow-2xl mb-8 group cursor-pointer hover:-translate-y-4 transition-transform duration-500`}>
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-widest text-white/40">VAJRABANK</span>
                      <span className="text-xl font-bold italic">{card.name}</span>
                    </div>
                    <LayersHalf size={32} className="text-white/20" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <div className="w-10 h-8 bg-amber-400/80 rounded-md shadow-inner" />
                       <p className="text-sm font-mono tracking-widest">•••• •••• •••• 8829</p>
                    </div>
                    <InfIcon size={24} className="text-white/60" />
                  </div>
                </div>
                {/* Chip detail */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:scale-150 transition-transform">
                  <Fingerprint size={120} />
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-white">{card.type}</h3>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.fee}</span>
                </div>
                <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{card.material}</p>
                <ul className="space-y-3">
                  {card.perks.map((p, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-400">
                      <Stars size={14} className="text-amber-500" /> {p}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldLockFill />, t: "Locked in-App", d: "Freeze, unfreeze and set limits instantly from your phone." },
              { icon: <Wallet />, t: "Global Spend", d: "Accepted at over 40 million merchants worldwide." },
              { icon: <Airplane />, t: "Travel Perks", d: "Complimentary insurance and lounge access across 1200 airports." },
              { icon: <Tags />, t: "Brand Deals", d: "Exclusive tie-ups with Apple, Nike, and Emirates." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-slate-900/40 rounded-3xl border border-white/5">
                <div className="text-indigo-500 mb-6">{item.icon}</div>
                <h4 className="text-white font-bold mb-3 uppercase text-xs tracking-widest">{item.t}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLOSURE */}
      <footer className="py-12 px-6 text-center text-slate-600 text-[9px] uppercase tracking-widest leading-loose max-w-2xl mx-auto">
        Cards are issued by VajraBank Ltd. Subject to credit approval. 
        Terms and conditions apply. Cash-back rewards are subject to monthly caps based on spend categories.
      </footer>
    </div>
  );
}