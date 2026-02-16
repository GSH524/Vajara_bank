import React from 'react';
import { ShieldLock, Clock, PersonCircle, Fingerprint } from 'react-bootstrap-icons';

export default function AuditLogPanel({ logs }) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col h-full transition-all duration-300 hover:border-indigo-500/20">
            
            {/* HEADER */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <ShieldLock size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                        Operational Audit Log
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Feed</span>
                </div>
            </div>

            {/* LOG LIST */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[500px]">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Clock size={32} className="mb-3 opacity-20" />
                        <p className="text-xs font-medium italic">No actions recorded in current session.</p>
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div 
                            key={log.id} 
                            className="relative group bg-slate-950/30 border border-white/5 rounded-xl p-4 transition-all hover:bg-slate-950/60 hover:border-indigo-500/30"
                        >
                            {/* Vertical "Trace" Line */}
                            {index !== logs.length - 1 && (
                                <div className="absolute left-7 top-14 bottom-[-12px] w-[1px] bg-slate-800 z-0"></div>
                            )}

                            <div className="flex items-start gap-4">
                                {/* Icon/Avatar Slot */}
                                <div className="relative z-10 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 group-hover:text-indigo-400 transition-colors">
                                    <Fingerprint size={16} />
                                </div>

                                <div className="flex-grow space-y-2">
                                    {/* Action & Time */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-tighter">
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    {/* Metadata: Monospace IDs look more technical/secure */}
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider">Ref ID:</span>
                                        <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                                            {log.customerId}
                                        </code>
                                    </div>

                                    {/* Details */}
                                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-white/[0.02]">
                                        {log.details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER */}
            <div className="p-4 bg-slate-950/50 border-t border-white/5 rounded-b-2xl">
                <button className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
                    Download Full Export (.CSV)
                </button>
            </div>
        </div>
    );
}