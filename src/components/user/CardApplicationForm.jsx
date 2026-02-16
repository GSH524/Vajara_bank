import React, { useState } from 'react';
import {
    PersonBadge,
    Buildings,
    CashCoin,
    Check2Circle,
    ChevronRight,
    ChevronLeft,
    HandThumbsUp,
    ShieldLock
} from 'react-bootstrap-icons';
import { getCardDetailsByType } from '../../utils/cardUtils';

const CardApplicationForm = ({ user, onSubmit, onCancel }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        income: '',
        employment: 'Salaried',
        pan: '',
        cardType: 'Vajra Classic',
        agreed: false
    });

    const cardTypes = ['Vajra Classic', 'Vajra Gold', 'Vajra Platinum'];

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 3) return nextStep();
        onSubmit(formData);
    };

    return (
        <div className="max-w-3xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            
            {/* PROGRESS HEADER */}
            <div className="bg-white/5 px-10 py-6 flex justify-between border-b border-white/5">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`flex items-center gap-3 transition-opacity duration-300 ${step >= s ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ring-4 ring-offset-2 ring-offset-slate-900 transition-all ${
                            step >= s ? 'bg-indigo-500 text-white ring-indigo-500/20' : 'bg-slate-700 text-slate-400 ring-transparent'
                        }`}>
                            {s}
                        </div>
                        <span className="hidden md:block text-[11px] font-black uppercase tracking-widest text-white">
                            {s === 1 ? 'Vitals' : s === 2 ? 'Tier Selection' : 'Authorization'}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-10">

                {/* STEP 1: PERSONAL/EMPLOYMENT */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <header className="mb-8">
                            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Employment & Eligibility</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Verify your financial standing</p>
                        </header>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <PersonBadge className="text-indigo-400" /> Full Name
                                </label>
                                <input 
                                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-not-allowed" 
                                    type="text" value={formData.fullName} readOnly 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Buildings className="text-indigo-400" /> Employment Type
                                </label>
                                <select
                                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={formData.employment}
                                    onChange={e => setFormData({ ...formData, employment: e.target.value })}
                                >
                                    <option className="bg-slate-900">Salaried</option>
                                    <option className="bg-slate-900">Self-Employed</option>
                                    <option className="bg-slate-900">Entrepreneur</option>
                                    <option className="bg-slate-900">Student</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <CashCoin className="text-indigo-400" /> Annual Income (₹)
                                </label>
                                <input
                                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    type="number"
                                    placeholder="Earnings per year"
                                    value={formData.income}
                                    onChange={e => setFormData({ ...formData, income: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldLock className="text-indigo-400" /> PAN Card Number
                                </label>
                                <input
                                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase"
                                    type="text"
                                    placeholder="ABCDE1234F"
                                    value={formData.pan}
                                    onChange={e => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                                    maxLength={10}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: CARD SELECTION */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <header className="mb-8">
                            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Choose Your Vajra</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Select your preferred credit tier</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {cardTypes.map(type => {
                                const details = getCardDetailsByType(type);
                                const isSelected = formData.cardType === type;
                                return (
                                    <div
                                        key={type}
                                        onClick={() => setFormData({ ...formData, cardType: type })}
                                        className={`group relative p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                                            isSelected 
                                            ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.15)]' 
                                            : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div 
                                            className="h-24 rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity shadow-lg"
                                            style={{ background: details.color }}
                                        ></div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3">{type}</h3>
                                        <ul className="space-y-2">
                                            {details.benefits.map((b, i) => (
                                                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
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

                {/* STEP 3: CONSENT */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                            <HandThumbsUp size={36} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase mb-4">Final Authorization</h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed font-medium">
                            By clicking confirm, you authorize the credit department to run a secure assessment. 
                            Results typically materialize within <span className="text-white font-bold italic underline">24 standard hours</span>.
                        </p>
                        
                        <label className="inline-flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-white/10 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                                checked={formData.agreed}
                                onChange={e => setFormData({ ...formData, agreed: e.target.checked })}
                                required
                            />
                            <span className="text-xs font-black text-white uppercase tracking-widest">Accept Terms & Conditions</span>
                        </label>
                    </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                    <button
                        type="button"
                        onClick={step === 1 ? onCancel : prevStep}
                        className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                    >
                        {step === 1 ? 'Abort' : <><ChevronLeft /> Back</>}
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:shadow-indigo-500/40 transition-all flex items-center gap-2"
                    >
                        {step === 3 ? 'Deploy Application' : <>Continue <ChevronRight /></>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CardApplicationForm;