import React from 'react';
import { Gift, Briefcase, CreditCard, Cash, Star } from 'react-bootstrap-icons';

const RECOM_DATA = {
  'Low': { // Mapping to High Value
    segmentLabel: 'High Value Customers',
    scheme: { name: 'Platinum / Zero Balance', benefits: ['Priority banking services', 'Zero balance requirement', 'Higher transaction limits'] },
    investment: { name: 'Equity Mutual Funds', benefits: ['High long-term wealth', 'Inflation-beating growth', 'Aggressive growth'] },
    credit: { name: 'Vajra Infinite Credit', type: 'Ultra Premium', benefits: ['Limit ₹10L+', 'Unlimited lounge access', '5X reward points'] },
    debit: { name: 'Vajra Platinum Debit', benefits: ['Withdrawal ₹2L/day', 'Zero annual fee', 'Dedicated Manager'] }
  },
  'Medium': {
    segmentLabel: 'Medium Value Customers',
    scheme: { name: 'Salary Account Benefits', benefits: ['Zero balance salary', 'Auto debit EMI facility', 'Personal Accident Cover'] },
    investment: { name: 'Hybrid Mutual Funds', benefits: ['Balanced risk/return', 'Equity + debt stability', 'Lower volatility'] },
    credit: { name: 'Vajra Gold Credit', type: 'Gold Card', benefits: ['Interest-free 45 days', 'Cashback on dining', 'EMI conversion'] },
    debit: { name: 'Vajra Gold Debit', benefits: ['Free 5 ATM txns/month', 'Low annual fee', 'Shopping discounts'] }
  },
  'High': { // Mapping to Low Value
    segmentLabel: 'Credit Builder Program',
    scheme: { name: 'Credit Repair Program', benefits: ['Improve CIBIL score', 'Financial discipline', 'Secure limit'] },
    investment: { name: 'Debt Mutual Funds', benefits: ['Capital protection', 'Stable income', 'Low market risk'] },
    credit: { name: 'Vajra Credit Builder', type: 'Secured Card', benefits: ['Easy approval (FD backed)', 'Improves credit score', 'Low annual fee'] },
    debit: { name: 'Vajra Basic Debit', benefits: ['Zero min balance', 'Secure PIN txns', 'Very low fee'] }
  }
};

const Card = ({ title, subtitle, items, icon: Icon, color, onApply }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col h-full group">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500 mb-1">{subtitle}</p>
    <h4 className="text-white font-bold text-lg mb-3 leading-tight">{title}</h4>
    <ul className="space-y-2 flex-grow">
      {items.map((b, i) => (
        <li key={i} className="text-slate-400 text-xs flex items-start gap-2">
          <span className="text-emerald-500 font-bold">✓</span> {b}
        </li>
      ))}
    </ul>
    <button 
      onClick={() => onApply(title)}
      className="mt-5 w-full py-2 bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors">
      Apply Now
    </button>
  </div>
);

export default function RecommendationSection({ riskLevel, onApply }) {
  // Logic: Map ML risk to data keys
  const data = RECOM_DATA[riskLevel];

  if (!data || riskLevel === "Analyzing..." || riskLevel === "Server Offline") {
    return (
      <div className="mt-12 p-8 border border-dashed border-slate-800 rounded-3xl text-center">
        <p className="text-slate-500 text-sm animate-pulse">Running AI Recommendation Engine...</p>
      </div>
    );
  }

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-500/10 p-2 rounded-lg"><Star className="text-amber-500" size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-white">AI-Driven Recommendations</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest">Profile Risk: {riskLevel} • Targeted for {data.segmentLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title={data.scheme.name} subtitle="Banking Scheme" items={data.scheme.benefits} icon={Gift} color="bg-blue-600" onApply={onApply} />
        <Card title={data.investment.name} subtitle="Investment" items={data.investment.benefits} icon={Briefcase} color="bg-emerald-600" onApply={onApply} />
        <Card title={data.credit.name} subtitle={data.credit.type} items={data.credit.benefits} icon={CreditCard} color="bg-purple-600" onApply={onApply} />
        <Card title={data.debit.name} subtitle="Card Upgrade" items={data.debit.benefits} icon={Cash} color="bg-orange-600" onApply={onApply} />
      </div>
    </div>
  );
}