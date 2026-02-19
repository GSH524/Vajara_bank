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
    Activity, 
    Cpu, 
    Database, 
    ShieldCheck,
    ClockHistory
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
        <div className="bg-transparent space-y-8 text-slate-300 font-sans p-6">
            
            {/* SUB-HEADER: Operational Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] p-6 rounded-2xl border border-white/10 shadow-xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Executive Summary</h2>
                    <p className="text-slate-400 text-sm font-medium">System-wide monitoring and administrative oversight.</p>
                </div>
                <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/80 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Infrastructure</span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span> 
                            Systems Nominal
                        </span>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10 mx-2"></div>
                    <ShieldCheck size={26} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
            </div>

            {/* STATS SECTION */}
            <section className="transition-all duration-500">
                <DashboardStats data={data} />
            </section>

            {/* ANALYTICS SECTION */}
            <section className="bg-[#111827] rounded-3xl border border-white/5 p-1 shadow-2xl">
                <AdminAnalytics data={data} />
            </section>

            {isAdmin && (
                <>
                    {/* RISK & ATTENTION SECTION */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <Activity size={18} className="text-blue-400" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Critical Oversight</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <RiskCard 
                                icon={<ExclamationTriangle size={20} />}
                                color="red"
                                label="High Risk Flags"
                                count={data.filter(d => d.isHighRisk).length}
                                subtext="Priority Review"
                                link="/admin/customers"
                            />
                            <RiskCard 
                                icon={<FileText size={20} />}
                                color="amber"
                                label="Pending KYC"
                                count={pendingUsers.length} 
                                subtext="Identity Verification"
                                link="/admin/customers"
                            />
                            <RiskCard 
                                icon={<CreditCard size={20} />}
                                color="blue"
                                label="Card Issuance"
                                count={12}
                                subtext="Active Requests"
                                link="/admin/cards"
                            />
                        </div>
                    </section>

                    {/* REGISTRY QUEUE - User Approvals */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Verification Queue</h3>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-bold tracking-wider">
                                {pendingUsers.length} APPLICATIONS PENDING
                            </span>
                        </div>

                        {loadingUsers ? (
                            <div className="bg-[#111827] p-12 rounded-2xl border border-white/5 text-center animate-pulse">
                                <p className="text-slate-500 text-sm font-black uppercase tracking-widest">Synchronizing Queue...</p>
                            </div>
                        ) : pendingUsers.length === 0 ? (
                            <div className="bg-[#111827] p-10 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                                <CheckCircle size={32} className="text-emerald-500/50 mb-3" />
                                <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">Queue Clear</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingUsers.map((user) => (
                                    <div key={user.id} className="bg-[#111827] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-500/40 transition-all shadow-lg group">
                                        <div className="flex items-center gap-5">
                                            {/* SAFE ACCESS: Fixes "Cannot read properties of undefined (reading '0')" */}
                                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-blue-400 border border-white/5 group-hover:border-blue-500/50 transition-colors">
                                                {user?.firstName?.[0] || '?'}{user?.lastName?.[0] || ''}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg tracking-tight">{user?.firstName || 'Unknown'} {user?.lastName || ''}</h4>
                                                <p className="text-xs font-medium text-slate-400">
                                                    {user?.email || 'No Email'} <span className="mx-2 text-slate-700">|</span> <span className="text-blue-400 font-bold uppercase tracking-tighter">{user?.accountType || 'Standard'}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => approveUser(user.id)} 
                                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => rejectUser(user.id)} 
                                                className="px-6 py-2.5 bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/5"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* LOGS & HARDWARE STATUS */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                        <div className="lg:col-span-2 bg-[#111827] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                                <ClockHistory className="text-blue-400" />
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Live Audit Trail</span>
                            </div>
                            <AuditLogPanel logs={auditLogs} />
                        </div>

                        <div className="bg-[#111827] border border-white/5 p-7 rounded-2xl shadow-2xl relative overflow-hidden">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Cpu size={18} className="text-blue-400 animate-pulse"/> Infrastructure
                            </h3>
                            
                            <div className="space-y-6">
                                <StatusRow label="Cloud Core" status="Online" icon={<Activity size={14}/>} />
                                <StatusRow label="Vajra DB" status="Synced" icon={<Database size={14}/>} />
                                <StatusRow label="API Latency" value="12ms" />
                                <StatusRow label="Uptime" value="99.98%" />
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-600 uppercase">
                                    <span>V-Stable 2.9</span>
                                    <span className="text-blue-500/80">Premium Enterprise</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function RiskCard({ icon, color, label, count, subtext, link }) {
    const colors = {
        red: { text: "text-red-400", border: "border-red-500/20 hover:border-red-500/50", bg: "hover:bg-red-500/5" },
        amber: { text: "text-amber-400", border: "border-amber-500/20 hover:border-amber-500/50", bg: "hover:bg-amber-500/5" },
        blue: { text: "text-blue-400", border: "border-blue-500/20 hover:border-blue-500/50", bg: "hover:bg-blue-500/5" }
    };
    const c = colors[color];
    return (
        <div className={`p-6 rounded-2xl border bg-[#111827] transition-all duration-300 group shadow-lg ${c.border} ${c.bg}`}>
            <div className="flex justify-between items-start mb-5">
                <div className={`p-3 rounded-xl bg-slate-900 border border-white/5 ${c.text} shadow-inner`}>
                    {icon}
                </div>
                <NavLink to={link} className="text-[9px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-blue-500 flex items-center gap-2 transition-all shadow-lg">
                    Review <ArrowRight size={10} />
                </NavLink>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</span>
            <div className="text-4xl font-black text-white mt-1 mb-1 tracking-tighter">{count}</div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${c.text} opacity-80`}>{subtext}</p>
        </div>
    );
}

function StatusRow({ label, status, value, icon }) {
    return (
        <div className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-3">
                {icon && <span className="text-blue-400/60">{icon}</span>} {label}
            </span>
            {status ? (
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md shadow-sm">
                    {status}
                </span>
            ) : (
                <span className="text-xs font-mono font-black text-white tracking-wider">{value}</span>
            )}
        </div>
    );
}