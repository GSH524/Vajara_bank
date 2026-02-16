import React, { useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import CardVisual from '../../components/user/CardVisual';
import {
    ShieldLock, ShieldCheck, PlusCircle, InfoCircle, StarFill,
    X, Wallet2, GraphUp, ShieldShaded, LockFill
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function CardsTool() {
    const { currentUser, updateUserProfile } = useCurrentUser();
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(false);

    const cards = [
        {
            id: "primary",
            name: currentUser?.cardType || "Vajra Platinum",
            type: "Credit",
            number: currentUser?.cardId || "4532 1211 8842 1024",
            holder: currentUser?.fullName || "AUTHORIZED USER",
            expiry: "12/28",
            isBlocked: currentUser?.isBlocked || false,
            benefits: ["5% Unlimited Cashback", "Airport Lounge Access", "Zero Forex Markup"],
            limits: { daily: "₹2,00,000", monthly: "₹10,00,000" }
        },
        {
            id: "secondary",
            name: "Vajra Gold",
            type: "Debit",
            number: "5421 8890 1024 9921",
            holder: currentUser?.fullName || "AUTHORIZED USER",
            expiry: "08/29",
            isBlocked: false,
            benefits: ["2% Rewards on Fuel", "Dining Discounts", "Fraud Liability Cover"],
            limits: { daily: "₹50,000", monthly: "₹2,00,000" }
        }
    ];

    const handleFreezeToggle = async (card) => {
        if (card.id !== "primary") {
            alert("Only primary card can be managed in demo mode.");
            return;
        }
        setLoading(true);
        try {
            await updateUserProfile({ isBlocked: !card.isBlocked });
        } catch (err) {
            console.error("Freeze failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 text-white min-h-screen">
            {/* HEADER */}
            <div className="text-center mb-10 md:mb-14">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Card Management Suite
                </h1>
                <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
                    Full control over your physical and virtual cards with military-grade security.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* CARD LIST (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 transition-all hover:border-white/20">
                            {/* Visual Component */}
                            <div className="shrink-0 shadow-2xl shadow-black/50">
                                <CardVisual
                                    type={card.name}
                                    number={card.number}
                                    holder={card.holder}
                                    expiry={card.expiry}
                                    blocked={card.isBlocked}
                                />
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-50">{card.name}</h3>
                                        <p className="text-[10px] md:text-xs uppercase tracking-[2px] text-slate-500 font-black mt-1">
                                            {card.type} Card
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest ${
                                        card.isBlocked 
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                        {card.isBlocked ? 'FROZEN' : 'ACTIVE'}
                                    </span>
                                </div>

                                {/* Benefits Tags */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {card.benefits.map((b, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg text-xs text-slate-300">
                                            <StarFill size={10} className="text-amber-500" />
                                            <span>{b}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleFreezeToggle(card)}
                                        disabled={loading}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
                                            card.isBlocked 
                                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10' 
                                            : 'text-red-400 border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
                                        }`}
                                    >
                                        {card.isBlocked ? <ShieldCheck /> : <ShieldLock />}
                                        {card.isBlocked ? 'Unfreeze' : 'Freeze'}
                                    </button>
                                    <button 
                                        onClick={() => setSelectedCard(card)}
                                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 font-bold text-sm hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <InfoCircle /> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Apply New Card (Empty State) */}
                    <div
                        className="bg-blue-500/5 border-2 border-dashed border-blue-500/20 p-10 rounded-[2rem] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-500/10 transition-all"
                        onClick={() => navigate(currentUser ? '/user/cards' : '/login')}
                    >
                        <PlusCircle size={40} className="text-blue-500 mb-4" />
                        <h3 className="text-lg font-bold">Apply for a New Card</h3>
                        <p className="text-slate-500 text-sm mt-1">Boost your spending power with Vajra Infinite</p>
                    </div>
                </div>

                {/* SIDEBAR (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Security Module */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldShaded size={28} className="text-emerald-500" />
                            <h4 className="font-bold text-lg">Vajra Guardian™</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Your assets are protected by real-time AI monitoring. Any unusual activity triggers an instant freeze.
                        </p>
                        <ul className="space-y-3">
                            {['256-bit encryption', 'Zero Liability Policy', '24/7 Fraud Support'].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                                    <LockFill className="text-emerald-500/60" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Settings Module */}
                    <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5">
                        <GraphUp size={28} className="text-blue-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">Manage Limits</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Adjust your daily ATM and POS limits instantly to control your spending habits.
                        </p>
                        <button 
                            onClick={() => setSelectedCard(cards[0])}
                            className="w-full py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-bold text-sm hover:bg-blue-500/20 transition-all"
                        >
                            Set Limits
                        </button>
                    </div>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedCard && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCard(null)} />
                    
                    {/* Modal Box */}
                    <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button 
                            className="absolute top-6 right-6 text-slate-500 hover:text-white"
                            onClick={() => setSelectedCard(null)}
                        >
                            <X size={28} />
                        </button>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
                            <p className="text-slate-400 text-sm mt-1">Detailed overview & security settings</p>
                        </div>

                        <div className="space-y-8 mb-10">
                            {/* Spending Limits */}
                            <div>
                                <h4 className="text-blue-500 text-xs font-black uppercase tracking-widest mb-4">Spending Limits</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Daily Limit</span>
                                        <span className="font-bold">{selectedCard.limits.daily}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Monthly Limit</span>
                                        <span className="font-bold">{selectedCard.limits.monthly}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Controls */}
                            <div>
                                <h4 className="text-blue-500 text-xs font-black uppercase tracking-widest mb-4">Security Controls</h4>
                                <div className="space-y-3">
                                    {['Online Transactions', 'International Usage', 'Contactless (NFC)'].map((label) => (
                                        <label key={label} className="flex justify-between items-center cursor-pointer group">
                                            <span className="text-slate-300 group-hover:text-white transition-colors">{label}</span>
                                            <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-700 rounded-full appearance-none checked:bg-blue-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all checked:after:translate-x-5" />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setSelectedCard(null)}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}