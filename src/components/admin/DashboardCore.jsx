import React from 'react';
import DashboardStats from './DashboardStats';
import AdminAnalytics from './AdminAnalytics';
import AuditLogPanel from './AuditLogPanel';

import { NavLink } from 'react-router-dom';
import { 
    ArrowRight, 
    ExclamationTriangle, 
    FileText, 
    CreditCard, 
    CheckCircle, 
    XCircle, 
    Activity, 
    Cpu, 
    Database, 
    ShieldCheck 
} from 'react-bootstrap-icons';

export default function DashboardCore({
    role = 'ADMIN',
    data = [],
    pendingUsers = [],
    loadingUsers = false,
    approveUser,
    rejectUser,
    auditLogs = []
}) {
    const isAdmin = role === 'ADMIN';

    return (
        <div className="min-h-screen bg-[#020617] p-4 md:p-8 space-y-8 text-slate-300">
            
            {/* HEADER - High Contrast Surveillance Style */}
            <div className="relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Command Center</h1>
                    </div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">VajraOS • Live Operations & Security Overview</p>
                </div>
                <div className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl border border-white/5">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase">System Status</p>
                        <p className="text-xs font-bold text-emerald-400 uppercase">All Nodes Operational</p>
                    </div>
                    <ShieldCheck size={28} className="text-indigo-500" />
                </div>
            </div>

            {/* ROW 1: OVERVIEW METRICS */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DashboardStats data={data} />
            </section>

            {/* ANALYTICS SECTION */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <AdminAnalytics data={data} />
            </section>

            {/* ADMIN ONLY SECTIONS */}
            {isAdmin && (
                <>
                    {/* ROW 2: RISK & ALERTS */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
                            <Activity size={14} className="text-indigo-500" /> Critical Risk Vectors
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* CARD 1: HIGH RISK */}
                            <RiskCard 
                                icon={<ExclamationTriangle size={24} />}
                                color="red"
                                label="High Risk Accounts"
                                count={data.filter(d => d.isHighRisk).length}
                                subtext="Immediate Attention Required"
                                link="/admin/customers"
                            />

                            {/* CARD 2: KYC PENDING */}
                            <RiskCard 
                                icon={<FileText size={24} />}
                                color="amber"
                                label="Pending KYC"
                                count={data.length} // Replace with real pending count
                                subtext="Identity Verifications"
                                link="/admin/kyc"
                            />

                            {/* CARD 3: CARD REQUESTS */}
                            <RiskCard 
                                icon={<CreditCard size={24} />}
                                color="blue"
                                label="Card Issuance"
                                count={12}
                                subtext="+4 Recent Requests"
                                link="/admin/cards"
                            />
                        </div>
                    </section>

                    {/* USER APPROVAL SECTION */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Registry Queue</h3>
                        {loadingUsers ? (
                            <div className="bg-slate-900/50 p-12 rounded-3xl border border-white/5 text-center animate-pulse text-slate-600 font-bold uppercase tracking-widest text-xs">
                                Synchronizing Approval Queue...
                            </div>
                        ) : pendingUsers.length === 0 ? (
                            <div className="bg-slate-900/30 p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-3">
                                <div className="p-4 bg-emerald-500/10 rounded-full">
                                    <CheckCircle size={32} className="text-emerald-500" />
                                </div>
                                <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Approval queue clear</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pendingUsers.map((user) => (
                                    <div key={user.id} className="group bg-slate-900/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-500/30 hover:bg-slate-900 transition-all shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-indigo-400 border border-white/5">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h4 className="font-bold text-white text-lg leading-none mb-1">{user.firstName} {user.lastName}</h4>
                                                <p className="text-xs text-slate-500 font-medium tracking-tight">
                                                    {user.email} • <span className="text-indigo-400 font-bold">{user.accountType}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => approveUser(user.id)} 
                                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                                            >
                                                <CheckCircle size={14} /> Authorize
                                            </button>
                                            <button 
                                                onClick={() => rejectUser(user.id)} 
                                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                                            >
                                                <XCircle size={14} /> Terminate
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* AUDIT LOG & SYSTEM STATUS */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md">
                            <AuditLogPanel logs={auditLogs} />
                        </div>

                        {/* HARDWARE STATUS CARD */}
                        <div className="bg-slate-950 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-3xl rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
                            
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Cpu size={14}/> System Architecture
                            </h3>
                            
                            <div className="space-y-6 flex-grow">
                                <StatusRow label="Banking Engine" status="Online" icon={<Activity size={14}/>} />
                                <StatusRow label="Firestore DB" status="Connected" icon={<Database size={14}/>} />
                                <StatusRow label="API Latency" value="18ms" />
                                <StatusRow label="Last Backup" value="6m ago" />
                            </div>

                            <div className="mt-12 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-600">
                                    <span>KERNEL: VAJRA_V2.9.5</span>
                                    <span className="text-indigo-500/50">PRO_LICENSED</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

// Helper Components
function RiskCard({ icon, color, label, count, subtext, link }) {
    const colors = {
        red: "bg-red-500/10 text-red-500 border-red-500/20 hover:border-red-500/40",
        amber: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:border-amber-500/40",
        blue: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:border-indigo-500/40"
    };

    return (
        <div className={`p-6 rounded-3xl border transition-all group ${colors[color]} bg-slate-900/40 backdrop-blur-sm`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-black/20`}>
                    {icon}
                </div>
                <NavLink to={link} className="text-[10px] font-black text-white bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter hover:bg-white/10 flex items-center gap-1 transition-all">
                    Intercept <ArrowRight size={10} />
                </NavLink>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <div className="text-4xl font-black text-white my-2 tracking-tighter">{count}</div>
            <p className={`text-[10px] font-black uppercase tracking-widest opacity-80`}>{subtext}</p>
        </div>
    );
}

function StatusRow({ label, status, value, icon }) {
    return (
        <div className="flex justify-between items-center border-b border-white/[0.03] pb-4">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-2">{icon} {label}</span>
            {status ? (
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span> {status}
                </span>
            ) : (
                <span className="text-xs font-mono font-bold text-indigo-400">{value}</span>
            )}
        </div>
    );
}