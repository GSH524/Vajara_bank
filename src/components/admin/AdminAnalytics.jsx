import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from 'recharts';

// ================= HIGH-VISIBILITY BUSINESS THEME =================
const CHART_THEME = {
    grid: 'rgba(148, 163, 184, 0.05)', 
    text: '#64748b',                   
    tooltipBg: '#1e293b',
    border: '#334155'
};

const ACCT_COLORS = ['#38bdf8', '#fbbf24', '#818cf8']; 
const LOAN_STATUS_COLORS = { Approved: '#10b981', Closed: '#60a5fa', Rejected: '#f87171' };
const CHANNEL_COLORS = { Deposit: '#34d399', Withdrawal: '#fb7185', Transfer: '#38bdf8' };
const CARD_COLORS = ['#60a5fa', '#a78bfa', '#fbbf24', '#4ade80'];

export default function AdminAnalytics({ data }) {

    const stats = useMemo(() => {
        const acctCounts = {};
        let totalAccts = 0;
        data.forEach(d => {
            const type = d.raw?.['Account Type'];
            if (type) {
                acctCounts[type] = (acctCounts[type] || 0) + 1;
                totalAccts++;
            }
        });
        const accountTypeData = Object.keys(acctCounts).map(name => ({
            name,
            value: acctCounts[name],
            percent: totalAccts ? ((acctCounts[name] / totalAccts) * 100).toFixed(1) : 0
        }));

        const genderLoan = {};
        const genders = ['Other', 'Female', 'Male', 'Unknown'];
        genders.forEach(g => genderLoan[g] = { name: g, Approved: 0, Closed: 0, Rejected: 0 });
        data.forEach(d => {
            const g = d.raw?.Gender || 'Unknown';
            const s = d.raw?.['Loan Status'];
            if (s && genderLoan[g]) {
                if (genderLoan[g][s] !== undefined) genderLoan[g][s]++;
            }
        });
        const loanByGenderData = Object.values(genderLoan);

        const channels = { Deposit: 0, Withdrawal: 0, Transfer: 0 };
        data.forEach(d => {
            const t = d.raw?.['Transaction Type'];
            if (channels[t] !== undefined) channels[t] += d.raw?.['Transaction Amount'] || 0;
        });
        const channelData = Object.keys(channels).map(name => ({ name, value: channels[name] }));

        const delinquencyMap = {};
        data.forEach(d => {
            const dateStr = d.raw?.['Payment Due Date'];
            const delay = d.raw?.['Payment Delay Days'] || 0;
            if (dateStr && delay > 0) {
                const date = new Date(dateStr);
                if (!isNaN(date)) {
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    const label = date.toLocaleString('default', { month: 'short' });
                    if (!delinquencyMap[key]) delinquencyMap[key] = { name: label, fullDate: key, days: 0 };
                    delinquencyMap[key].days += delay;
                }
            }
        });
        const delinquencyTrend = Object.values(delinquencyMap).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

        const cardCounts = {};
        data.forEach(d => {
            const c = d.raw?.['Card Type'];
            if (c) cardCounts[c] = (cardCounts[c] || 0) + 1;
        });
        const cardData = Object.keys(cardCounts).map(name => ({ name, count: cardCounts[name] }));

        return { accountTypeData, loanByGenderData, channelData, delinquencyTrend, cardData };
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl ring-1 ring-black/50">
                    <p className="text-white text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-slate-800 pb-1.5">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} className="text-[12px] font-medium flex justify-between gap-8 py-0.5">
                            <span style={{ color: p.color || p.fill }}>{p.name}:</span>
                            <span className="text-slate-100 font-mono">{p.value.toLocaleString()}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 md:p-10 space-y-10 bg-[#070b14] min-h-screen font-sans selection:bg-blue-500/30">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">Vajra Analytics</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Enterprise intelligence & transaction monitoring.</p>
                </div>
                <div className="flex p-1.5 bg-slate-900/50 rounded-xl border border-white/5 shadow-inner">
                    <button className="px-5 py-2 text-[12px] font-bold bg-blue-600 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">Live Insights</button>
                    <button className="px-5 py-2 text-[12px] font-bold text-slate-500 hover:text-white transition-colors">Historical Logs</button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <ChartCard title="Account Distribution">
                    <PieChart>
                        <Pie
                            data={stats.accountTypeData}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {stats.accountTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ACCT_COLORS[index % ACCT_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b', fontWeight: '600', paddingTop: '15px' }} />
                    </PieChart>
                </ChartCard>

                <ChartCard title="Loan Approval Flow">
                    <BarChart layout="vertical" data={stats.loanByGenderData} barSize={14}>
                        <CartesianGrid strokeDasharray="4 4" stroke={CHART_THEME.grid} horizontal={false} />
                        <XAxis type="number" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke={CHART_THEME.text} fontSize={10} width={60} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Approved" stackId="a" fill={LOAN_STATUS_COLORS.Approved} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Closed" stackId="a" fill={LOAN_STATUS_COLORS.Closed} />
                        <Bar dataKey="Rejected" stackId="a" fill={LOAN_STATUS_COLORS.Rejected} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ChartCard>

                <ChartCard title="Risk Exposure Trend">
                    <AreaChart data={stats.delinquencyTrend}>
                        <defs>
                            <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="days" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDays)" />
                    </AreaChart>
                </ChartCard>

                <ChartCard title="Volume per Channel">
                    <BarChart data={stats.channelData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {stats.channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name] || '#6366f1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>

                <ChartCard title="Card Market Penetration" className="lg:col-span-2">
                    <BarChart data={stats.cardData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {stats.cardData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CARD_COLORS[index % CARD_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>

            </div>
        </div>
    );
}

// ================= UI REFINEMENT: SEPARATED CARDS =================
function ChartCard({ title, children, className = "" }) {
    return (
        <div className={`bg-[#111827] border border-white/[0.05] rounded-2xl p-6 shadow-xl shadow-black/40 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden ${className}`}>
            {/* Subtle Inner Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                    {title}
                </h4>
            </div>
            
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
}