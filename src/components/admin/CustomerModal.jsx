import React, { useState } from 'react';
import { 
  X, 
  ShieldExclamation, 
  Activity, 
  Fingerprint, 
  Wallet2, 
  CreditCard, 
  Snow
} from 'react-bootstrap-icons';

export default function CustomerModal({ customer, overrides, onAction, onClose }) {
    if (!customer) return null;

    const [remarkText, setRemarkText] = useState(overrides?.remarks || "");

    const isFrozen = overrides?.isFrozen ?? customer.isFrozen;
    const isFlagged = overrides?.flagged ?? false;

    const handleRemarkSave = () => {
        onAction.addRemark(customer.customerId, remarkText);
        alert("Case Remarks Synchronized Successfully.");
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#0f1218] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col font-sans">
                
                {/* HEADER - Visual Alert System */}
                <div className={`p-8 flex items-center justify-between border-b transition-all duration-500 ${
                    isFlagged ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/[0.02] border-white/5'
                }`}>
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${
                            isFlagged ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-blue-600 text-white shadow-blue-600/20'
                        }`}>
                            <Fingerprint size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-black text-white tracking-tight">{customer.fullName}</h2>
                                {isFlagged && (
                                    <span className="flex items-center gap-1.5 bg-rose-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        <ShieldExclamation size={12} /> High Alert
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
                                UUID: {customer.customerId}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all active:scale-90"
                    >
                        <X size={32} />
                    </button>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    
                    {/* 1. TELEMETRY CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { 
                                label: 'Liquidity', 
                                value: `₹${customer.balance.toLocaleString('en-IN')}`, 
                                color: customer.balance < 0 ? 'text-rose-400' : 'text-blue-400',
                                icon: <Wallet2 size={14}/> 
                            },
                            { 
                                label: 'Risk Profile', 
                                value: customer.riskLevel, 
                                badge: true,
                                icon: <Activity size={14}/>
                            },
                            { 
                                label: 'Credit Intel', 
                                value: customer.cibilScore || '742', 
                                color: (customer.cibilScore || 742) < 650 ? 'text-rose-400' : 'text-emerald-400',
                                icon: <ShieldExclamation size={14}/>
                            },
                            { 
                                label: 'Network', 
                                value: isFrozen ? 'Restricted' : 'Live', 
                                color: isFrozen ? 'text-blue-400' : 'text-emerald-400',
                                icon: isFrozen ? <Snow size={14}/> : <Activity size={14}/>
                            }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-3">
                                    {stat.icon} {stat.label}
                                </div>
                                {stat.badge ? (
                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest ${
                                        stat.value === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                        {stat.value}
                                    </span>
                                ) : (
                                    <div className={`text-xl font-mono font-bold tracking-tight ${stat.color}`}>{stat.value}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* LEFT: DATA PANELS */}
                        <div className="lg:col-span-3 space-y-10">
                            <section>
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">
                                    <Fingerprint size={14}/> Identity Parameters
                                </h4>
                                <div className="space-y-1 bg-white/[0.02] rounded-2xl p-2 border border-white/5">
                                    <InfoRow label="Access Key" value={customer.email} />
                                    <InfoRow label="Secure Line" value={customer.raw?.['Contact Number'] || 'N/A'} />
                                    <InfoRow label="Registered Hub" value={customer.raw?.['Address'] || 'Verified Location'} isLongText />
                                    <InfoRow label="Biometrics" value={`${customer.gender || 'M'} | ${customer.age || '32'} YRS`} />
                                </div>
                            </section>

                            <section>
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">
                                    <CreditCard size={14}/> Financial Ledger
                                </h4>
                                <div className="space-y-1 bg-white/[0.02] rounded-2xl p-2 border border-white/5">
                                    <InfoRow label="Exposure" value={`${Math.round((customer.raw?.['Credit Utilization'] || 0.42) * 100)}%`} />
                                    <InfoRow label="Cap Limit" value={`₹${(customer.raw?.['Credit Limit'] || 500000).toLocaleString()}`} />
                                    <InfoRow label="Account Age" value="1,240 Days" />
                                    <InfoRow label="Payment Lag" value={`${customer.paymentDelay || 0} Days`} isDanger={(customer.paymentDelay || 0) > 30} />
                                </div>
                            </section>
                        </div>

                        {/* RIGHT: COMMAND CENTER */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-950/40 border border-white/10 rounded-[2rem] p-8 sticky top-0 shadow-inner">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                    Command & Control
                                </h4>

                                <div className="space-y-5">
                                    <ActionToggle 
                                        title="Asset Freeze" 
                                        desc="Instant lock on outgoing wire transfers" 
                                        checked={isFrozen} 
                                        onChange={() => onAction.toggleFreeze(customer.customerId, isFrozen)}
                                        activeColor="bg-blue-600"
                                    />
                                    <ActionToggle 
                                        title="Security Flag" 
                                        desc="Escalate to High-Risk Surveillance" 
                                        checked={isFlagged} 
                                        onChange={() => onAction.toggleFlag(customer.customerId, isFlagged)}
                                        activeColor="bg-rose-600"
                                    />

                                    <div className="pt-6">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">
                                            Investigative Remarks
                                        </label>
                                        <textarea
                                            rows="5"
                                            className="w-full bg-[#0a0c10] border border-white/10 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-700 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none shadow-inner"
                                            placeholder="Document findings for the audit log..."
                                            value={remarkText}
                                            onChange={(e) => setRemarkText(e.target.value)}
                                        />
                                        <button 
                                            onClick={handleRemarkSave} 
                                            className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:border-blue-500/50"
                                        >
                                            Commit to Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STICKY FOOTER */}
                <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
                    <div className="text-[10px] font-mono text-slate-600">
                        SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        Close Terminal
                    </button>
                </div>
            </div>
        </div>
    );
}

// Refined Helper Components
function InfoRow({ label, value, isLongText, isDanger }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-colors group">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-400 transition-colors">{label}</span>
            <span className={`text-xs font-mono font-bold text-slate-200 text-right ${isLongText ? 'max-w-[200px] truncate' : ''} ${isDanger ? 'text-rose-500' : ''}`}>
                {value}
            </span>
        </div>
    );
}

function ActionToggle({ title, desc, checked, onChange, activeColor }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
            <div>
                <p className="text-xs font-black text-white uppercase tracking-wide mb-1 group-hover:text-blue-400 transition-colors">{title}</p>
                <p className="text-[10px] text-slate-500 font-medium italic">{desc}</p>
            </div>
            <button 
                onClick={onChange}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ring-2 ring-offset-2 ring-offset-[#0f1218] ${checked ? `${activeColor} ring-white/20` : 'bg-slate-800 ring-transparent'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}