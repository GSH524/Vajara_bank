import React, { useState, useMemo } from 'react';
import {
    Globe, CashStack, Clock, ShieldCheck,
    ArrowLeftRight, InfoCircle, Airplane
} from 'react-bootstrap-icons';

export default function Global() {
    const [inrAmount, setInrAmount] = useState(100000);
    const [currency, setCurrency] = useState('USD');

    const rates = {
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0094,
        AED: 0.044,
        SGD: 0.016
    };

    const countries = [
        { name: 'USA', flag: '🇺🇸', currency: 'USD', time: '1-2 Days', fee: '₹500' },
        { name: 'UK', flag: '🇬🇧', currency: 'GBP', time: 'Instant', fee: '₹0' },
        { name: 'UAE', flag: '🇦🇪', currency: 'AED', time: '4 Hours', fee: '₹250' },
        { name: 'Europe', flag: '🇪🇺', currency: 'EUR', time: '1 Day', fee: '₹400' },
        { name: 'Singapore', flag: '🇸🇬', currency: 'SGD', time: 'Instant', fee: '₹0' }
    ];

    const converted = useMemo(() => {
        return (inrAmount * rates[currency]).toFixed(2);
    }, [inrAmount, currency]);

    return (
        <main className="max-w-7xl mx-auto px-4 py-10 md:py-16 text-white bg-[#020617]">
            {/* HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Global Banking & Forex
                </h1>
                <p className="text-slate-400 text-sm md:text-lg">Borderless banking for the modern global citizen.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* RATE CALCULATOR (7 columns) */}
                <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <ArrowLeftRight className="text-blue-500" size={24} />
                        <h3 className="text-xl font-bold">Exchange Rate Calculator</h3>
                    </div>

                    <div className="space-y-6">
                        {/* INPUT INR */}
                        <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                            <label className="text-xs font-semibold text-slate-500 block mb-3">You send from India (INR)</label>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-slate-400">₹</span>
                                <input
                                    type="number"
                                    value={inrAmount}
                                    onChange={(e) => setInrAmount(e.target.value)}
                                    className="bg-transparent border-none text-2xl md:text-3xl font-bold text-white outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* DIVIDER BADGE */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/5"></div>
                            <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-black rounded-full whitespace-nowrap uppercase tracking-widest">
                                1 INR = {rates[currency]} {currency}
                            </div>
                            <div className="flex-1 h-px bg-white/5"></div>
                        </div>

                        {/* RECIPIENT GETS */}
                        <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                            <label className="text-xs font-semibold text-slate-500 block mb-3">Recipient gets in {currency}</label>
                            <div className="flex items-center gap-4">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="bg-slate-800 border border-white/10 text-white px-3 py-1 rounded-lg font-bold outline-none cursor-pointer"
                                >
                                    {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input
                                    type="text"
                                    readOnly
                                    value={converted}
                                    className="bg-transparent border-none text-2xl md:text-3xl font-bold text-emerald-400 outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* FEE BREAKDOWN */}
                        <div className="space-y-3 px-2 pt-4">
                            <div className="flex justify-between text-xs md:text-sm text-slate-400">
                                <span>Transfer Fee</span>
                                <span className="text-emerald-500 font-bold">₹0 (Zero Fee promotion)</span>
                            </div>
                            <div className="flex justify-between text-xs md:text-sm text-slate-400">
                                <span>Exchange Rate</span>
                                <span>Standard Mid-Market</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAILS SECTION (5 columns) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Supported Corridors */}
                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                        <h4 className="text-lg font-bold mb-6">Supported Corridors</h4>
                        <div className="space-y-1">
                            {countries.map(c => (
                                <div key={c.name} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{c.flag}</span>
                                        <div>
                                            <p className="font-bold text-sm text-white">{c.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{c.currency} Corridor</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                                            <Clock size={10} /> {c.time}
                                        </p>
                                        <p className="text-[10px] font-bold text-emerald-500 mt-1">{c.fee} fee</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FEMA Compliant Badge */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-center gap-4">
                        <ShieldCheck className="text-emerald-500 shrink-0" size={28} />
                        <div>
                            <h5 className="text-sm font-bold text-emerald-400">FEMA Compliant</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                VajraBank international transfers strictly adhere to RBI and FEMA regulations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADDITIONAL HIGHLIGHTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: <Globe size={32} className="text-blue-500" />, title: "Multi-Currency Accounts", text: "Hold, manage, and spend in 10+ major global currencies without conversion fees." },
                    { icon: <Airplane size={32} className="text-purple-500" />, title: "Waitless Forex", text: "Order physical currency or reload your Forex card instantly through the mobile app." },
                    { icon: <InfoCircle size={32} className="text-emerald-500" />, title: "Global Assistance", text: "24/7 dedicated international concierge for all your travel and banking needs." }
                ].map((item, idx) => (
                    <div key={idx} className="bg-slate-900/30 p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-4 hover:border-white/20 transition-all">
                        <div className="mb-2">{item.icon}</div>
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}