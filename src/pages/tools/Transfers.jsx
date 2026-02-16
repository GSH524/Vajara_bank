import React, { useState } from 'react';
import {
    Send, Phone, Bank, CheckCircleFill, ClockHistory,
    ExclamationTriangle, ShieldCheck
} from 'react-bootstrap-icons';

export default function Transfers() {
    const [mode, setMode] = useState('upi');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [status, setStatus] = useState('idle');
    const [recent, setRecent] = useState([
        { id: 1, name: 'Rahul Sharma', info: 'rahul@upi', amount: 1500, date: '2 hours ago', type: 'upi' },
        { id: 2, name: 'Aditya Birla', info: 'Acc: ...9921', amount: 12500, date: 'Yesterday', type: 'bank' },
        { id: 3, name: 'Priya Iyer', info: 'priya.i@okaxis', amount: 450, date: '3 Jan', type: 'upi' }
    ]);

    const handleTransfer = (e) => {
        e.preventDefault();
        if (!amount || !recipient) return;
        setStatus('processing');
        setTimeout(() => {
            setStatus('success');
            const newTransfer = {
                id: Date.now(),
                name: recipient.includes('@') ? recipient.split('@')[0] : recipient,
                info: recipient,
                amount: Number(amount),
                date: 'Just now',
                type: mode
            };
            setRecent([newTransfer, ...recent]);
        }, 2000);
    };

    if (status === 'success') {
        return (
            <main className="max-w-7xl mx-auto px-5 py-10 md:py-20 text-white min-h-screen flex items-center justify-center">
                <div className="w-full max-w-xl bg-zinc-900/80 backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] border border-emerald-500/20 text-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]">
                    <div className="mb-8 flex justify-center scale-125 md:scale-150">
                        <CheckCircleFill size={80} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Transfer Sent!</h2>
                    <p className="text-zinc-400 text-lg mb-8">
                        ₹{Number(amount).toLocaleString()} successfully moved to <span className="text-emerald-400 font-bold">{recipient}</span>
                    </p>
                    <button 
                        onClick={() => setStatus('idle')} 
                        className="w-full py-5 bg-emerald-500 text-zinc-950 rounded-2xl font-black text-lg hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
                    >
                        New Transfer
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-5 py-10 md:py-20 text-white min-h-screen">
            <div className="text-center mb-12 md:mb-16">
                <h1 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Instant Transfers
                </h1>
                <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
                    Secure, lightning-fast payments across the Vajra network.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* FORM PANEL */}
                <div className="lg:col-span-7 bg-zinc-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10">
                        <button
                            onClick={() => setMode('upi')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${mode === 'upi' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
                        >
                            <Phone size={16} /> UPI
                        </button>
                        <button
                            onClick={() => setMode('bank')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${mode === 'bank' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
                        >
                            <Bank size={16} /> Bank
                        </button>
                    </div>

                    <form onSubmit={handleTransfer} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Recipient Address</label>
                            <input
                                type="text"
                                required
                                placeholder={mode === 'upi' ? 'vpa@upi' : 'Account Number'}
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Amount (INR)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-3xl font-black text-emerald-400 focus:outline-none focus:border-emerald-500/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'processing'}
                            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-zinc-950 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
                        >
                            {status === 'processing' ? 'Encrypting...' : 'Authorize Transfer'}
                        </button>
                    </form>
                </div>

                {/* RECENT PANEL */}
                <div className="lg:col-span-5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <ClockHistory /> Activity
                    </h3>

                    <div className="space-y-4">
                        {recent.map(item => (
                            <div 
                                key={item.id} 
                                className="group flex items-center gap-4 p-5 bg-zinc-900/30 rounded-3xl border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all"
                                onClick={() => { setRecipient(item.info); setMode(item.type); }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl font-black text-emerald-400">
                                    {item.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{item.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">{item.info}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-zinc-100">₹{item.amount.toLocaleString()}</p>
                                    <p className="text-[9px] text-zinc-600 uppercase tracking-tighter">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}