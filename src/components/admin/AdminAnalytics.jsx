import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area, ScatterChart, Scatter
} from 'recharts';

// ================= THEME ADAPTATION =================
const CHART_THEME = {
    grid: 'rgba(255, 255, 255, 0.05)',
    text: '#94a3b8',
    tooltipBg: '#0f172a',
    tooltipBorder: 'rgba(59, 130, 246, 0.2)',
};

const ACCT_COLORS = ['#f59e0b', '#3b82f6', '#ef4444'];
const LOAN_STATUS_COLORS = { Approved: '#10b981', Closed: '#3b82f6', Rejected: '#ef4444', Default: '#94a3b8' };
const CHANNEL_COLORS = { Deposit: '#facc15', Withdrawal: '#ffffff', Transfer: '#3b82f6' };
const RISK_COLORS = { High: '#ef4444', Medium: '#facc15', Low: '#3b82f6' };
const CARD_COLORS = ['#ffffff', '#8b5cf6', '#fef08a', '#f97316'];

export default function AdminAnalytics({ data }) {

    const stats = useMemo(() => {
        // Data processing logic remains the same to ensure chart functionality
        const acctCounts = {};
        let totalAccts = 0;
        data.forEach(d => {
            const type = d.raw['Account Type'];
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
            const g = d.raw.Gender || 'Unknown';
            const s = d.raw['Loan Status'];
            if (s && genderLoan[g]) {
                if (genderLoan[g][s] !== undefined) genderLoan[g][s]++;
            }
        });
        const loanByGenderData = Object.values(genderLoan);

        const loanStatus = {};
        data.forEach(d => {
            const s = d.raw['Loan Status'];
            if (s) loanStatus[s] = (loanStatus[s] || 0) + 1;
        });
        const loanStatusData = Object.keys(loanStatus).map(name => ({ name, value: loanStatus[name] }));

        const channels = { Deposit: 0, Withdrawal: 0, Transfer: 0 };
        data.forEach(d => {
            const t = d.raw['Transaction Type'];
            if (channels[t] !== undefined) channels[t] += d.raw['Transaction Amount'] || 0;
        });
        const channelData = Object.keys(channels).map(name => ({ name, value: channels[name] }));

        const ageScatterData = data
            .filter(d => d.raw.Age && d.raw['Transaction Amount'])
            .map(d => ({
                x: d.raw.Age,
                y: d.raw['Transaction Amount'],
                fill: ACCT_COLORS[Math.floor(Math.random() * ACCT_COLORS.length)]
            }))
            .slice(0, 100);

        const delinquencyMap = {};
        data.forEach(d => {
            const dateStr = d.raw['Payment Due Date'];
            const delay = d.raw['Payment Delay Days'] || 0;
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

        const riskCounts = { High: 0, Medium: 0, Low: 0 };
        data.forEach(d => {
            const r = d.raw.RiskLevel;
            if (riskCounts[r] !== undefined) riskCounts[r]++;
        });
        const riskData = Object.keys(riskCounts).map(name => ({ name, value: riskCounts[name] }));

        const cardCounts = {};
        data.forEach(d => {
            const c = d.raw['Card Type'];
            if (c) cardCounts[c] = (cardCounts[c] || 0) + 1;
        });
        const cardData = Object.keys(cardCounts).map(name => ({ name, count: cardCounts[name] }));

        return { accountTypeData, loanByGenderData, loanStatusData, channelData, ageScatterData, delinquencyTrend, riskData, cardData };
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-2xl">
                    <p className="text-slate-200 text-xs font-bold mb-1 border-b border-slate-700 pb-1">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} className="text-[11px] font-medium leading-relaxed" style={{ color: p.color || p.fill }}>
                            {p.name}: <span className="text-slate-100">{p.value.toLocaleString()}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#020617] p-6 lg:p-10 text-slate-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <span className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            ⚡
                        </span>
                        Analytics Intelligence
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Real-time financial performance and risk assessment metrics.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <button className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md shadow-lg">Live View</button>
                    <button className="px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">Historical</button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* 1. Account Type (Pie Chart) */}
                <ChartCard title="Count of Account Type">
                    <PieChart>
                        <Pie
                            data={stats.accountTypeData}
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {stats.accountTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ACCT_COLORS[index % ACCT_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    </PieChart>
                </ChartCard>

                {/* 2. Loan Status by Gender (Horizontal Bar) */}
                <ChartCard title="Loan Status by Gender">
                    <BarChart layout="vertical" data={stats.loanByGenderData} barSize={12}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} horizontal={false} />
                        <XAxis type="number" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke={CHART_THEME.text} fontSize={10} width={50} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Approved" stackId="a" fill={LOAN_STATUS_COLORS.Approved} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Closed" stackId="a" fill={LOAN_STATUS_COLORS.Closed} />
                        <Bar dataKey="Rejected" stackId="a" fill={LOAN_STATUS_COLORS.Rejected} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ChartCard>

                {/* 3. Delinquency Trend (Area Chart) */}
                <ChartCard title="Loan Delinquency Trend" className="lg:col-span-2">
                    <AreaChart data={stats.delinquencyTrend}>
                        <defs>
                            <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="days" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDays)" animationDuration={1500} />
                    </AreaChart>
                </ChartCard>

                {/* 4. Transaction Volume by Channel */}
                <ChartCard title="Transaction Channel Volume">
                    <BarChart layout="vertical" data={stats.channelData} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} horizontal={false} />
                        <XAxis type="number" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke={CHART_THEME.text} fontSize={10} width={70} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {stats.channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name] || '#6366f1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>

                {/* 5. Age vs Amount Scatter */}
                <ChartCard title="Transaction Density by Age">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} strokeOpacity={0.2} />
                        <XAxis type="number" dataKey="x" name="Age" stroke={CHART_THEME.text} fontSize={9} axisLine={false} tickLine={false} />
                        <YAxis type="number" dataKey="y" stroke={CHART_THEME.text} fontSize={9} tickFormatter={(val) => `₹${val / 1000}k`} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter name="Transactions" data={stats.ageScatterData} fill="#6366f1" fillOpacity={0.6} />
                    </ScatterChart>
                </ChartCard>

                {/* 6. Risk Level */}
                <ChartCard title="Risk Segmentation">
                    <BarChart data={stats.riskData} barSize={30}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {stats.riskData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#6366f1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>

                {/* 7. Card Usage */}
                <ChartCard title="Card Product Distribution">
                    <BarChart data={stats.cardData} barSize={30}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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

// Sub-component for individual Chart Cards to keep code DRY
function ChartCard({ title, children, className = "" }) {
    return (
        <div className={`group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-500 hover:bg-slate-800/60 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[2px] group-hover:text-indigo-400 transition-colors">
                    {title}
                </h4>
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                </div>
            </div>
            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
}