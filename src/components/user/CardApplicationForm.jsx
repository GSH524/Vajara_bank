import React, { useState, useEffect } from 'react';
import { PersonBadge, Buildings, CashCoin, Check2Circle, ChevronRight, ChevronLeft, HandThumbsUp, ShieldLock, CardList } from 'react-bootstrap-icons';

const CardApplicationForm = ({ user, onSubmit, onCancel, riskLevel = 'Medium' }) => {
    const [step, setStep] = useState(1);

    const getEligibleCards = (risk) => {
        if (risk === 'Low' || risk === 'Safe' || risk === 'High Value Customers') {
            return [
                { Card_Name: 'Vajra Infinite Credit', Card_Type: 'Ultra Premium Credit Card', color: 'linear-gradient(135deg, #1e1e1e 0%, #000000 100%)', Benefits: ['Very high credit limit (₹10L+)', 'Unlimited airport lounge access', 'Luxury hotel partnerships', '5X reward points on travel', 'Concierge service', 'Complimentary travel insurance'] },
                { Card_Name: 'Vajra Premium Credit', Card_Type: 'Premium Credit Card', color: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', Benefits: ['High credit limit', 'Airport lounge access', 'Reward points on all spends', 'EMI conversion facility', 'Low forex markup'] }
            ];
        } else if (risk === 'Medium' || risk === 'Medium Value Customers') {
            return [
                { Card_Name: 'Vajra Gold Credit', Card_Type: 'Gold Credit Card', color: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)', Benefits: ['Moderate credit limit', 'Cashback on dining & shopping', 'Interest-free period up to 45 days', 'EMI conversion facility'] },
                { Card_Name: 'Vajra Cashback Credit', Card_Type: 'Cashback Credit Card', color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', Benefits: ['5% cashback on online shopping', 'Fuel surcharge waiver', 'Reward points on bill payments'] }
            ];
        } else {
            return [
                { Card_Name: 'Vajra Credit Builder', Card_Type: 'Secured Credit Card', color: 'linear-gradient(135deg, #64748b 0%, #334155 100%)', Benefits: ['Easy approval with FD backing', 'Low credit limit', 'Helps improve credit score', 'Low annual fee'] }
            ];
        }
    };

    const eligibleCards = getEligibleCards(riskLevel);

    const [formData, setFormData] = useState({
        fullName: '',
        income: '',
        employment: 'Salaried',
        pan: '',
        cardType: eligibleCards[0].Card_Name,
        agreed: false
    });

    // Sync form data if user prop changes or loads late
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                pan: user.panCard || user.pan || prev.pan
            }));
        }
    }, [user]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 3) return nextStep();
        onSubmit(formData);
    };

    return (
        <div className="max-w-3xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            {/* Step Progress Bar */}
            <div className="bg-white/5 px-10 py-6 flex justify-between border-b border-white/5">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`flex items-center gap-3 transition-all duration-300 ${step >= s ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ring-4 ring-offset-2 ring-offset-slate-900 transition-all ${step >= s ? 'bg-indigo-500 text-white ring-indigo-500/20' : 'bg-slate-700 text-slate-400 ring-transparent'}`}>
                            {s}
                        </div>
                        <span className="hidden md:block text-[11px] font-black uppercase tracking-widest text-white">
                            {s === 1 ? 'Vitals' : s === 2 ? 'Tier Selection' : 'Authorization'}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-10">
                {/* STEP 1: VITALS */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <header className="mb-8">
                            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Employment & Eligibility</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Verify your financial standing</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <PersonBadge className="text-indigo-400" /> Full Name
                                </label>
                                <input 
                                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                                    type="text" 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Buildings className="text-indigo-400" /> Employment Type
                                </label>
                                <select className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer" value={formData.employment} onChange={e => setFormData({ ...formData, employment: e.target.value })}>
                                    <option className="bg-slate-900">Salaried</option>
                                    <option className="bg-slate-900">Self-Employed</option>
                                    <option className="bg-slate-900">Entrepreneur</option>
                                    <option className="bg-slate-900">Student</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <CashCoin className="text-indigo-400" /> Annual Income (₹)
                                </label>
                                <input className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" type="number" placeholder="Earnings per year" value={formData.income} onChange={e => setFormData({ ...formData, income: e.target.value })} required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <CardList className="text-indigo-400" /> PAN Card Number
                                </label>
                                <input className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase" type="text" placeholder="ABCDE1234F" value={formData.pan} onChange={e => setFormData({ ...formData, pan: e.target.value.toUpperCase() })} maxLength={10} required />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: TIER SELECTION */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <header className="mb-8">
                            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Choose Your Vajra</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Select your preferred credit tier</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {eligibleCards.map(card => {
                                const isSelected = formData.cardType === card.Card_Name;
                                return (
                                    <div key={card.Card_Name} onClick={() => setFormData({ ...formData, cardType: card.Card_Name })} className={`group relative p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${isSelected ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                        <div className="h-24 rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity shadow-lg" style={{ background: card.color }}></div>
                                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{card.Card_Name}</h3>
                                        <p className="text-[9px] text-indigo-300 font-bold mb-3">{card.Card_Type}</p>
                                        <ul className="space-y-2">
                                            {card.Benefits.slice(0, 3).map((b, i) => (
                                                <li key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                                                    <Check2Circle className="text-emerald-500 shrink-0" /> {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* STEP 3: AUTHORIZATION */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                            <HandThumbsUp size={36} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase mb-4">Final Authorization</h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed font-medium">
                            By clicking deploy, you authorize the Vajra credit department to run a secure assessment. Provisioning occurs within <span className="text-white font-bold italic">24 hours</span>.
                        </p>
                        <label className="inline-flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50" checked={formData.agreed} onChange={e => setFormData({ ...formData, agreed: e.target.checked })} required />
                            <span className="text-xs font-black text-white uppercase tracking-widest">Accept Provisioning Terms</span>
                        </label>
                    </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                    <button type="button" onClick={step === 1 ? onCancel : prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all flex items-center gap-2">
                        {step === 1 ? 'Abort' : <><ChevronLeft /> Back</>}
                    </button>
                    <button type="submit" className="px-8 py-3 bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
                        {step === 3 ? 'Deploy Application' : <>Continue <ChevronRight /></>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CardApplicationForm;