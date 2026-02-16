import React from "react";
import { Gift, Award, ArrowRightCircle, People } from 'react-bootstrap-icons';

const Rewards = () => {
  const rewards = [
    { id: 1, title: "Amazon Voucher", points: 500, icon: "🌟", color: "#FF9900" },
    { id: 2, title: "Fuel Cashback", points: 250, icon: "⛽", color: "#10b981" },
    { id: 3, title: "Movie Tickets", points: 400, icon: "🎬", color: "#ef4444" },
    { id: 4, title: "Starbucks Card", points: 300, icon: "☕", color: "#00704A" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Award className="text-blue-500" /> Rewards & Offers
      </h1>

      {/* HERO / POINTS BALANCE CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 mb-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Vajra Points Balance</p>
            <h2 className="text-5xl md:text-6xl font-black text-white flex items-baseline gap-2">
              2,450 <span className="text-lg font-medium text-blue-400">Points</span>
            </h2>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95 border border-slate-700">
              History
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95">
              Redeem Points
            </button>
          </div>
        </div>
      </div>

      {/* OFFERS SECTION */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Gift className="text-blue-500" /> Exclusive Offers
        </h2>
        <button className="text-blue-400 text-sm font-semibold hover:underline flex items-center gap-1">
          View All <ArrowRightCircle />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {rewards.map((r) => (
          <div key={r.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-600 transition-all duration-300 shadow-xl group">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 duration-300"
              style={{
                background: `${r.color}15`,
                color: r.color,
                border: `1px solid ${r.color}30`
              }}
            >
              {r.icon}
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{r.title}</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">{r.points} Points Required</p>

            <button className="w-full py-3 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 font-bold rounded-xl transition-all duration-300 active:scale-95 border border-slate-700 hover:border-blue-500">
              Redeem Now
            </button>
          </div>
        ))}
      </div>

      {/* REFERRAL BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-blue-900/20">
        <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-3xl">
            <People />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Refer a Friend</h3>
            <p className="text-blue-100 font-medium">
              Earn <span className="text-white font-bold">1,000 bonus points</span> per successful referral.
            </p>
          </div>
        </div>

        <button className="w-full md:w-auto px-10 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 text-lg">
          Invite Friends
        </button>
      </div>
    </div>
  );
};

export default Rewards;