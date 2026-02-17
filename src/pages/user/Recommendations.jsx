import React from 'react';
import { Gift, Briefcase, CreditCard, Cash, Star } from 'react-bootstrap-icons';

const RECOM_DATA = {
  'Low': {
    segmentLabel: 'High Value Customers',
    scheme: { name: 'Platinum / Zero Balance', category: 'Scheme', benefits: ['Priority services', 'Zero balance', 'High limits'] },
    investment: { name: 'Equity Mutual Funds', category: 'Investment', benefits: ['High wealth growth', 'Inflation beating', 'Aggressive'] },
    credit: { name: 'Vajra Infinite Credit', category: 'Credit Card', benefits: ['Limit ₹10L+', 'Lounge access', '5X rewards'] },
    debit: { name: 'Vajra Platinum Debit', category: 'Debit Card', benefits: ['₹2L/day withdrawal', 'Zero fee', 'Dedicated Manager'] }
  },
  'Medium': {
    segmentLabel: 'Medium Value Customers',
    scheme: { name: 'Salary Account Benefits', category: 'Scheme', benefits: ['Zero balance salary', 'Auto EMI', 'Accident Cover'] },
    investment: { name: 'Hybrid Mutual Funds', category: 'Investment', benefits: ['Balanced risk', 'Stable growth', 'Low volatility'] },
    credit: { name: 'Vajra Gold Credit', category: 'Credit Card', benefits: ['Interest-free 45d', 'Cashback', 'EMI facility'] },
    debit: { name: 'Vajra Gold Debit', category: 'Debit Card', benefits: ['Free ATM txns', 'Low annual fee', 'Shopping discounts'] }
  },
  'High': {
    segmentLabel: 'Credit Builder Program',
    scheme: { name: 'Credit Repair Program', category: 'Scheme', benefits: ['Improve CIBIL', 'Discipline', 'Secure limit'] },
    investment: { name: 'Debt Mutual Funds', category: 'Investment', benefits: ['Capital protection', 'Stable income', 'Low risk'] },
    credit: { name: 'Vajra Credit Builder', category: 'Credit Card', benefits: ['Easy approval (FD)', 'Improves score', 'Low fee'] },
    debit: { name: 'Vajra Basic Debit', category: 'Debit Card', benefits: ['Zero min balance', 'Secure PIN txns', 'Very low fee'] }
  }
};

const Card = ({ title, subtitle, items, icon: Icon, color, category, onApply }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
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
      onClick={() => onApply(title, category)}
      className="mt-5 w-full py-2 bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors">
      Apply Now
    </button>
  </div>
);

export default function RecommendationSection({ riskLevel, onApply }) {
  const data = RECOM_DATA[riskLevel];

  if (!data || riskLevel === "Analyzing...") return <div className="mt-12 text-slate-500">AI Recommendation Engine Running...</div>;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-6">AI-Driven Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title={data.scheme.name} category="Scheme" subtitle="Banking Scheme" items={data.scheme.benefits} icon={Gift} color="bg-blue-600" onApply={onApply} />
        <Card title={data.investment.name} category="Investment" subtitle="Investment" items={data.investment.benefits} icon={Briefcase} color="bg-emerald-600" onApply={onApply} />
        <Card title={data.credit.name} category="Credit Card" subtitle="Credit Card" items={data.credit.benefits} icon={CreditCard} color="bg-purple-600" onApply={onApply} />
        <Card title={data.debit.name} category="Debit Card" subtitle="Card Upgrade" items={data.debit.benefits} icon={Cash} color="bg-orange-600" onApply={onApply} />
      </div>
    </div>
  );
}