import React, { useState, useMemo } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
// Fixed casing for ClockHistory
import { GraphUp, Calculator, ClockHistory } from 'react-bootstrap-icons';

export default function ROI() {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [frequency, setFrequency] = useState(1);

    const results = useMemo(() => {
        const f = Number(frequency);
        const r = (rate / 100) / f;
        const n = years * f;
        const maturity = amount * Math.pow(1 + r, n);
        
        const data = [];
        for (let i = 0; i <= years; i++) {
            const yearMaturity = amount * Math.pow(1 + r, i * f);
            data.push({
                year: `Yr ${i}`,
                total: Math.round(yearMaturity)
            });
        }

        return {
            maturity: Math.round(maturity),
            profit: Math.round(maturity - amount),
            data
        };
    }, [amount, rate, years, frequency]);

    return (
        <main className="min-h-screen bg-[#020617] text-white p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                        ROI Calculator
                    </h1>
                    <p className="text-slate-400 text-sm md:text-lg">
                        Plan your wealth growth with our precision compounding engine.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: INPUTS */}
                    <div className="lg:col-span-1 space-y-6 bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 h-fit">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                                <Calculator className="text-blue-400" /> Investment (₹)
                            </label>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-blue-500 transition-all"
                            />
                            <input 
                                type="range" min="5000" max="10000000" step="5000" 
                                value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                                Annual Rate (%)
                            </label>
                            <input 
                                type="number" 
                                value={rate} 
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-blue-500 transition-all"
                            />
                            <input 
                                type="range" min="1" max="30" step="0.1" 
                                value={rate} onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                                <ClockHistory className="text-blue-400" /> Time Period (Years)
                            </label>
                            <input 
                                type="number" 
                                value={years} 
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-blue-500 transition-all"
                            />
                            <input 
                                type="range" min="1" max="40" 
                                value={years} onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                                Compounding
                            </label>
                            <select 
                                value={frequency} 
                                onChange={(e) => setFrequency(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value={1}>Annually</option>
                                <option value={2}>Half-Yearly</option>
                                <option value={4}>Quarterly</option>
                                <option value={12}>Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS & CHART */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Total Invested</p>
                                <h2 className="text-xl font-bold">₹{amount.toLocaleString()}</h2>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Est. Growth</p>
                                <h2 className="text-xl font-bold text-emerald-400">₹{results.profit.toLocaleString()}</h2>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Maturity Value</p>
                                <h2 className="text-xl font-bold text-blue-400">₹{results.maturity.toLocaleString()}</h2>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <GraphUp className="text-blue-500" /> Wealth Projection
                            </h3>
                            
                            <div className="h-[250px] md:h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={results.data}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} hide={window.innerWidth < 640} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Value']}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}