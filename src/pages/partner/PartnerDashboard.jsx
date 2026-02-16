import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { userDB } from "../../firebaseUser";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area, ScatterChart, Scatter
} from 'recharts';

const CHART_THEME = { grid: 'rgba(255, 255, 255, 0.05)', text: '#94a3b8' };
const ACCT_COLORS = ['#f59e0b', '#3b82f6', '#ef4444'];
const LOAN_STATUS_COLORS = { Approved: '#10b981', Closed: '#3b82f6', Rejected: '#ef4444' };
const CHANNEL_COLORS = { Deposit: '#facc15', Withdrawal: '#ffffff', Transfer: '#3b82f6' };
const RISK_COLORS = { High: '#ef4444', Medium: '#facc15', Low: '#3b82f6' };
const CARD_COLORS = ['#ffffff', '#8b5cf6', '#fef08a', '#f97316'];

export default function PartnerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bankData, setBankData] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBankData();
        loadAds();
    }, [user]);

    const loadBankData = async () => {
        try {
            const response = await fetch('/bankData.json');
            const data = await response.json();
            const processed = data.map(row => ({
                raw: row,
                balance: row['Account Balance'] || 0,
                isFrozen: row['Account Status'] === 'Frozen',
                activeStatus: row['Account Status'] === 'Active' ? 'Active' : 'Inactive',
                isHighRisk: row.RiskLevel === 'High'
            }));
            setBankData(processed);
        } catch (err) {
            console.error('Failed to load bank data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadAds = async () => {
        if (!user) return;
        try {
            const q = query(collection(userDB, "ads"), where("partnerId", "==", user.uid));
            const snapshot = await getDocs(q);
            setAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error('Failed to load ads:', err);
        }
    };

    const stats = useMemo(() => {
        const totalCustomers = bankData.length;
        const totalBalance = bankData.reduce((acc, curr) => acc + curr.balance, 0);
        const activeCount = bankData.filter(d => d.activeStatus === 'Active').length;
        const frozenCount = bankData.filter(d => d.isFrozen).length;
        return { totalCustomers, totalBalance, activeCount, frozenCount };
    }, [bankData]);

    const analytics = useMemo(() => {
        const acctCounts = {};
        bankData.forEach(d => {
            const type = d.raw['Account Type'];
            if (type) acctCounts[type] = (acctCounts[type] || 0) + 1;
        });
        const accountTypeData = Object.keys(acctCounts).map(name => ({ name, value: acctCounts[name] }));

        const genderLoan = {};
        ['Other', 'Female', 'Male', 'Unknown'].forEach(g => genderLoan[g] = { name: g, Approved: 0, Closed: 0, Rejected: 0 });
        bankData.forEach(d => {
            const g = d.raw.Gender || 'Unknown';
            const s = d.raw['Loan Status'];
            if (s && genderLoan[g] && genderLoan[g][s] !== undefined) genderLoan[g][s]++;
        });

        const channels = { Deposit: 0, Withdrawal: 0, Transfer: 0 };
        bankData.forEach(d => {
            const t = d.raw['Transaction Type'];
            if (channels[t] !== undefined) channels[t] += d.raw['Transaction Amount'] || 0;
        });

        const riskCounts = { High: 0, Medium: 0, Low: 0 };
        bankData.forEach(d => {
            const r = d.raw.RiskLevel;
            if (riskCounts[r] !== undefined) riskCounts[r]++;
        });

        return {
            accountTypeData,
            loanByGenderData: Object.values(genderLoan),
            channelData: Object.keys(channels).map(name => ({ name, value: channels[name] })),
            riskData: Object.keys(riskCounts).map(name => ({ name, value: riskCounts[name] })),
            ageScatterData: bankData.slice(0, 100).map(d => ({ x: d.raw.Age, y: d.raw['Transaction Amount'] })),
            cardData: [{name: 'Visa', count: 40}, {name: 'MasterCard', count: 30}, {name: 'Rupay', count: 20}] // Mock for brevity
        };
    }, [bankData]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-200 text-xs font-bold mb-1">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} className="text-[11px] leading-tight" style={{ color: p.color || p.fill }}>
                            {p.name}: {p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Initializing Command Center...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <Toaster position="top-right" />

            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Command Center</h1>
                    <p className="text-slate-400 text-sm italic">Live Operations & Security Overview</p>
                </div>
                <button 
                    onClick={() => navigate("/partner/create-ad")}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    + Create New Ad
                </button>
            </header>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), trend: "+12% this month", color: "text-white" },
                    { label: "Total Liquidity", value: `₹${(stats.totalBalance / 10000000).toFixed(2)}Cr`, trend: "Across all accounts", color: "text-blue-400" },
                    { label: "Active Status", value: stats.activeCount, trend: "Healthy Ratio", color: "text-emerald-400" },
                    { label: "Frozen Accounts", value: stats.frozenCount, trend: "Requires Review", color: "text-red-500" },
                    { label: "Ad visitors", value: ads.reduce((s,a) => s + (a.clicks || 0), 0), trend: "Across your campaigns", color: "text-yellow-400" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h2 className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.value}</h2>
                        <p className="text-[10px] text-slate-500 font-medium">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* ANALYTICS GRID */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Analytics Intelligence
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Card Component for Charts */}
                    {[
                        { title: "Account Distribution", chart: (
                            <PieChart>
                                <Pie data={analytics.accountTypeData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                    {analytics.accountTypeData.map((_, i) => <Cell key={i} fill={ACCT_COLORS[i % ACCT_COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        )},
                        { title: "Loan Status by Gender", chart: (
                            <BarChart layout="vertical" data={analytics.loanByGenderData}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={60} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="Approved" stackId="a" fill={LOAN_STATUS_COLORS.Approved} />
                                <Bar dataKey="Closed" stackId="a" fill={LOAN_STATUS_COLORS.Closed} />
                                <Bar dataKey="Rejected" stackId="a" fill={LOAN_STATUS_COLORS.Rejected} />
                            </BarChart>
                        )},
                        { title: "Risk Assessment", chart: (
                            <BarChart data={analytics.riskData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value">
                                    {analytics.riskData.map((entry, i) => <Cell key={i} fill={RISK_COLORS[entry.name]} />)}
                                </Bar>
                            </BarChart>
                        )}
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{item.title}</h4>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {item.chart}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CAMPAIGN MANAGEMENT */}
            <section className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">⚡</span> Campaign Management
                    </h2>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="bg-slate-800/50 px-4 py-2 rounded-lg text-xs whitespace-nowrap">
                            <span className="text-slate-400">Total:</span> <span className="text-white font-bold">{ads.length}</span>
                        </div>
                        <div className="bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs whitespace-nowrap">
                            Approved: {ads.filter(a => a.status === "APPROVED").length}
                        </div>
                    </div>
                </div>

                {ads.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <div className="text-4xl mb-4">📢</div>
                        <h3 className="text-lg font-bold text-white">No Campaigns Yet</h3>
                        <p className="text-slate-400 text-sm mb-6">Start reaching users today.</p>
                        <button onClick={() => navigate("/partner/create-ad")} className="bg-white text-slate-950 px-6 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                            Create Your First Ad
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {ads.map(ad => (
                            <div key={ad.id} className="group relative bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all">
                                <div className="aspect-video w-full bg-slate-700 relative overflow-hidden">
                                    {ad.imageUrl ? (
                                        <img src={ad.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-500 italic text-sm">No Preview Image</div>
                                    )}
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter backdrop-blur-md border ${
                                        ad.status === 'APPROVED' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                        ad.status === 'PENDING' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 
                                        'bg-red-500/20 border-red-500/50 text-red-400'
                                    }`}>
                                        {ad.status}
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    <h4 className="font-bold text-white mb-3 line-clamp-1">{ad.title}</h4>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
                                        <span>📅 {ad.durationDays || 30} Days</span>
                                        <span>🔗 {ad.placements?.length || 0} Placements</span>
                                    </div>

                                    {/* Clicks badge */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-slate-800/60 px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 border border-slate-700">
                                            👆 Clicks: <span className="text-white ml-2">{ad.clicks || 0}</span>
                                        </div>
                                        <div className="bg-white/5 px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 border border-white/5">
                                            ⏱ Last action: {ad.lastClickAt ? new Date(ad.lastClickAt?.seconds * 1000).toLocaleString() : '—'}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => window.open(ad.redirectUrl, '_blank')} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold transition-colors">
                                            Link
                                        </button>
                                        <button className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-xs font-bold transition-colors">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}