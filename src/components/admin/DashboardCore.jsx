import React from 'react';
import DashboardStats from './DashboardStats';
import AdminAnalytics from './AdminAnalytics';
import AuditLogPanel from './AuditLogPanel';
import { NavLink } from 'react-router-dom';
import { 
    ArrowRight, 
    ExclamationTriangle, 
    CreditCard, 
    Activity, 
    Cpu, 
    Database, 
    ShieldCheck,
    ClockHistory,
    PersonBadge,
    CardList,
    EnvelopeAt
} from 'react-bootstrap-icons';

export default function DashboardCore({
    role = 'ADMIN',
    data = [],
    pendingUsers = [],
    loadingUsers = false,
    approveUser,
    rejectUser,
    cardApps = [],
    loadingCards = false,
    approveCard,
    rejectCard,
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
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <RiskCard 
                            icon={<ExclamationTriangle size={20} />}
                            color="red"
                            label="High Risk Flags"
                            count={data.filter(d => d.isHighRisk).length}
                            subtext="Priority Review"
                            link="/admin/customers"
                        />
                        <RiskCard 
                            icon={<PersonBadge size={20} />}
                            color="amber"
                            label="User Requests"
                            count={pendingUsers.length} 
                            subtext="New Registrations"
                            link="/admin/customers"
                        />
                        <RiskCard 
                            icon={<CreditCard size={20} />}
                            color="blue"
                            label="Card Issuance"
                            count={cardApps.length}
                            subtext="Card Applications"
                            link="/admin/cards"
                        />
                    </section>

                    {/* COMBINED VERIFICATION QUEUE */}
                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* 1. USER REGISTRATIONS */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2 px-2">
                                <PersonBadge className="text-emerald-500" /> Registration Queue
                            </h3>
                            {loadingUsers ? (
                                <div className="h-32 flex items-center justify-center bg-[#111827] rounded-2xl border border-white/5 animate-pulse">Syncing...</div>
                            ) : pendingUsers.length === 0 ? (
                                <div className="bg-[#111827]/50 border border-dashed border-white/10 p-10 rounded-2xl text-center text-slate-600 font-bold uppercase text-xs">No pending registrations</div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingUsers.map((user) => (
                                        <div key={user.id} className="bg-[#111827] p-5 rounded-2xl border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{user?.fullName || "New Member"}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user?.email}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => approveUser(user.id)} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Approve</button>
                                                <button onClick={() => rejectUser(user.id)} className="px-4 py-1.5 bg-slate-800 hover:bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Reject</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. CREDIT CARD APPLICATIONS (UPDATED WITH USER DETAILS) */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2 px-2">
                                <CreditCard className="text-blue-500" /> Card Issuance Queue
                            </h3>
                            {loadingCards ? (
                                <div className="h-32 flex items-center justify-center bg-[#111827] rounded-2xl border border-white/5 animate-pulse">Scanning Nexus...</div>
                            ) : cardApps.length === 0 ? (
                                <div className="bg-[#111827]/50 border border-dashed border-white/10 p-10 rounded-2xl text-center text-slate-600 font-bold uppercase text-xs">Queue Clear</div>
                            ) : (
                                <div className="space-y-3">
                                    {cardApps.map((app) => (
                                        <div key={app.id} className="bg-[#111827] p-5 rounded-2xl border border-blue-500/20 flex flex-col justify-between group shadow-lg shadow-blue-900/5">
                                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20 uppercase font-black text-lg">
                                                        {app.userName?.[0] || 'V'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-base tracking-tight">{app.userName || "Applicant"}</h4>
                                                        <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                                            <EnvelopeAt size={10} className="text-blue-500"/> {app.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-widest">
                                                        {app.cardType}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-slate-500 uppercase">Annual Income</span>
                                                        <span className="text-xs font-bold text-slate-200">₹{Number(app.income).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex flex-col border-l border-white/10 pl-4">
                                                        <span className="text-[8px] font-black text-slate-500 uppercase">Employment</span>
                                                        <span className="text-xs font-bold text-slate-200">{app.employment}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveCard(app.id)} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">Issue Card</button>
                                                    <button onClick={() => rejectCard(app.id)} className="px-5 py-2 bg-slate-800 hover:bg-red-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">Deny</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </section>

                    {/* LOGS SECTION */}
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
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

// Reusable Helper Components
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