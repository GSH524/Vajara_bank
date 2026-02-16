import React, { useState } from 'react';
import {
    Building, Rocket, Briefcase, People, CashStack,
    TelephoneForward, CheckCircle
} from 'react-bootstrap-icons';

export default function Business() {
    const [showContact, setShowContact] = useState(false);

    return (
        <main className="max-w-7xl mx-auto px-5 py-10 md:py-16 text-white bg-[#020617]">
            {/* HEADER */}
            <div className="text-center mb-12 md:mb-16">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent leading-tight">
                    SRK Business Solutions
                </h1>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                    Empowering India's entrepreneurs with next-gen corporate banking.
                </p>
            </div>

            {/* HERO SECTION */}
            <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md p-8 md:p-14 rounded-[2rem] border border-white/10 mb-16 flex flex-col md:flex-row items-center justify-between">
                <div className="relative z-10 max-w-2xl text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-6 leading-tight">
                        The Banking Partner Your Business Deserves
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
                        From early-stage startups to established enterprises, we provide the financial infrastructure
                        to scale your operations globally. Zero hidden fees, infinite possibilities.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white">50k+</h3>
                            <p className="text-slate-500 text-sm">Business Clients</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white">₹100Cr+</h3>
                            <p className="text-slate-500 text-sm">Monthly Payroll</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white">24/7</h3>
                            <p className="text-slate-500 text-sm">RM Support</p>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block opacity-30">
                    <Building size={160} className="text-blue-500/40" />
                </div>
            </div>

            {/* SEGMENTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 flex flex-col hover:border-blue-500/30 transition-all">
                    <Rocket size={32} className="text-[#bef280]" />
                    <h3 className="text-xl font-bold mt-5 mb-3 text-white">Startups</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">Incorporate, set up accounts, and get funded with zero paperwork.</p>
                    <ul className="mt-auto space-y-3 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> No Minimum Balance</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Developer-first APIs</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Venture Debt Access</li>
                    </ul>
                </div>

                <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 flex flex-col hover:border-blue-500/30 transition-all">
                    <Briefcase size={32} className="text-blue-500" />
                    <h3 className="text-xl font-bold mt-5 mb-3 text-white">SMEs</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">Manage your cash flow and GST compliance like a pro.</p>
                    <ul className="mt-auto space-y-3 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Working Capital Loans</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Integrated Accounting</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Multi-user Access</li>
                    </ul>
                </div>

                <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 flex flex-col hover:border-blue-500/30 transition-all sm:col-span-2 lg:col-span-1">
                    <People size={32} className="text-emerald-500" />
                    <h3 className="text-xl font-bold mt-5 mb-3 text-white">Enterprises</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">Scale globally with advanced treasury and payroll solutions.</p>
                    <ul className="mt-auto space-y-3 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Bulk Payouts System</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Forex & Trade Finance</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Custom ERP Integration</li>
                    </ul>
                </div>
            </div>

            {/* FEATURE SECTION */}
            <div className="mb-20">
                <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">Built for High-Growth Teams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="flex gap-5">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <CashStack size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Automated Payroll</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Run salaries, compliance (PF/ESIC), and taxes in just two clicks.</p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <People size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Vendor Payments</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Schedule bulk payments to thousand of vendors instantly.</p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Rocket size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Business Loans</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Unsecured credit lines up to ₹50 Lakhs for eligible businesses.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Ready to transform your business?</h3>
                    <p className="text-slate-400">Our relationship managers are standing by.</p>
                </div>
                <button 
                    onClick={() => setShowContact(true)}
                    className="w-full md:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors"
                >
                    <TelephoneForward /> Contact Relationship Manager
                </button>
            </div>

            {/* CONTACT MODAL */}
            {showContact && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={() => setShowContact(false)}
                >
                    <div 
                        className="w-full max-w-sm bg-[#020617] p-8 rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-2">Relationship Manager</h3>
                        <p className="text-slate-400 text-sm mb-6">Reach out to your dedicated business support</p>

                        <div className="space-y-3 mb-6">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 font-mono text-center">
                                📞 <span className="ml-2 font-bold tracking-wider">6300608164</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 font-mono text-center text-sm">
                                ✉️ <span className="ml-2">mahesh@gmail.com</span>
                            </div>
                        </div>

                        <button 
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            onClick={() => setShowContact(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}