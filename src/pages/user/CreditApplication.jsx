import React from 'react';
import { CreditCard2Front, ArrowLeft, CheckCircleFill } from 'react-bootstrap-icons';

export default function CreditApplication({ riskLevel, onBack }) {
  const isHighRisk = riskLevel === 'High';

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Card Preview */}
        <div className={`rounded-[2.5rem] p-8 flex flex-col justify-between bg-gradient-to-br ${isHighRisk ? 'from-slate-800 to-slate-900 border-amber-500/30' : 'from-indigo-600 to-violet-700'} shadow-2xl border`}>
          <CreditCard2Front size={50} className="text-white/20" />
          <div>
            <h3 className="text-2xl font-black text-white uppercase italic">{isHighRisk ? "Vajra Secured" : "Vajra Infinite"}</h3>
            <p className="text-white/60 text-xs tracking-widest mt-2 uppercase font-bold">{isHighRisk ? "Credit Builder Card" : "Ultra Premium Series"}</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5">
          <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 mb-6 text-xs uppercase font-bold"><ArrowLeft /> Back</button>
          <h2 className="text-xl font-black text-white uppercase mb-6">Card Application</h2>
          
          <div className="space-y-4">
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm" placeholder="Current Monthly Income" />
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircleFill className="text-emerald-500" />
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Instant Approval Eligibility Verified</p>
            </div>
            <button className="w-full bg-white text-slate-950 py-4 rounded-xl font-black uppercase text-xs tracking-widest">Confirm & Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}