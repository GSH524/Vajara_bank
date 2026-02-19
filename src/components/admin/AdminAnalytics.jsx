import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from 'recharts';

// ================= VAJRA NEXUS DESIGN SYSTEM =================
const CHART_THEME = {
    grid: 'rgba(148, 163, 184, 0.05)', 
    text: '#94a3b8',                  
    tooltipBg: '#0f172a',
    accentIndigo: '#6366f1',
    accentEmerald: '#10b981',
    accentAmber: '#f59e0b',
    accentRose: '#f43f5e'
};

const ACCT_COLORS = ['#6366f1', '#06b6d4', '#ec4899', '#8b5cf6']; 
const LOAN_STATUS_COLORS = { Approved: '#10b981', Closed: '#6366f1', Rejected: '#f43f5e' };
const CHANNEL_COLORS = { Deposit: '#10b981', Withdrawal: '#f43f5e', Transfer: '#06b6d4' };
const CARD_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#2dd4bf', '#f59e0b'];

export default function AdminAnalytics({ data = [] }) {

    const stats = useMemo(() => {
        // 1. Account Types
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

        // 2. Loan Approval by Gender
        const genderLoan = {};
        const genders = ['Other', 'Female', 'Male', 'Unknown'];
        genders.forEach(g => genderLoan[g] = { name: g, Approved: 0, Closed: 0, Rejected: 0 });
        
        data.forEach(d => {
            const g = d.raw?.Gender || 'Unknown';
            const s = d.raw?.['Loan Status'];
            if (s && genderLoan[g] && genderLoan[g][s] !== undefined) {
                genderLoan[g][s]++;
            }
        });
        // Filter out genders that have absolutely zero loan activity to keep chart clean
        const loanByGenderData = Object.values(genderLoan).filter(
            g => g.Approved > 0 || g.Closed > 0 || g.Rejected > 0
        );

        // 3. Capital Flow Channels
        const channels = { Deposit: 0, Withdrawal: 0, Transfer: 0 };
        data.forEach(d => {
            const t = d.raw?.['Transaction Type'];
            if (channels[t] !== undefined) {
                channels[t] += Number(d.raw?.['Transaction Amount'] || 0);
            }
        });
        const channelData = Object.keys(channels).map(name => ({ name, value: channels[name] }));

        // 4. Delinquency Risk Gradient (Trend over time)
        const delinquencyMap = {};
        data.forEach(d => {
            const dateStr = d.raw?.['Payment Due Date'];
            const delay = Number(d.raw?.['Payment Delay Days'] || 0);
            
            if (dateStr && delay > 0 && dateStr !== "—" && dateStr !== "N/A") {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) { // Safe date check
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
                    
                    if (!delinquencyMap[key]) {
                        delinquencyMap[key] = { name: label, fullDate: key, days: 0 };
                    }
                    delinquencyMap[key].days += delay;
                }
            }
        });
        const delinquencyTrend = Object.values(delinquencyMap).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

        // 5. Card Market Density
        const cardCounts = {};
        data.forEach(d => {
            const c = d.raw?.['Card Type'];
            if (c && c !== "None" && c !== "N/A") {
                cardCounts[c] = (cardCounts[c] || 0) + 1;
            }
        });
        const cardData = Object.keys(cardCounts).map(name => ({ name, count: cardCounts[name] }));

        return { accountTypeData, loanByGenderData, channelData, delinquencyTrend, cardData };
    }, [data]);

    // Custom Tooltip for sleek UI
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl shadow-black/50 z-50">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-[0.2em]">{label}</p>
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-8 py-1.5 border-t border-white/5 first:border-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }}></div>
                                <span className="text-[11px] font-bold text-slate-300">{p.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-white font-mono">
                                {p.name.includes('Deposit') || p.name.includes('Withdrawal') || p.name.includes('Transfer') 
                                    ? `₹${p.value.toLocaleString()}` 
                                    : p.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return null; // Don't render empty charts while loading
    }

    return (
        <div className="space-y-6 bg-transparent p-4 md:p-6">
            
            {/* Command Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Analytics Node</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase italic">
                        Intelligence <span className="text-indigo-500">Suite</span>
                    </h3>
                </div>
            </div>

            {/* Charts Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                
                <ChartCard title="A/C Distribution">
                    <PieChart>
                        <Pie
                            data={stats.accountTypeData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {stats.accountTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ACCT_COLORS[index % ACCT_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', paddingTop: '10px' }} />
                    </PieChart>
                </ChartCard>

                <ChartCard title="Loan Approval Vector">
                    <BarChart layout="vertical" data={stats.loanByGenderData} barSize={14} margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke={CHART_THEME.text} fontSize={10} width={60} axisLine={false} tickLine={false} fontWeight="bold" />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
                        <Bar dataKey="Approved" stackId="a" fill={LOAN_STATUS_COLORS.Approved} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Closed" stackId="a" fill={LOAN_STATUS_COLORS.Closed} />
                        <Bar dataKey="Rejected" stackId="a" fill={LOAN_STATUS_COLORS.Rejected} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ChartCard>

                <ChartCard title="Delinquency Risk Gradient">
                    <AreaChart data={stats.delinquencyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_THEME.accentIndigo} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={CHART_THEME.accentIndigo} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" dy={10} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="days" name="Total Delay Days" stroke={CHART_THEME.accentIndigo} strokeWidth={3} fillOpacity={1} fill="url(#colorDays)" />
                    </AreaChart>
                </ChartCard>

                <ChartCard title="Capital Flow Channel">
                    <BarChart data={stats.channelData} barSize={36} margin={{ top: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" dy={10} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {stats.channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name] || CHART_THEME.accentIndigo} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartCard>

                <ChartCard title="Card Market Density" className="md:col-span-2 lg:col-span-2">
                    <BarChart data={stats.cardData} barSize={40} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" dy={10} />
                        <YAxis stroke={CHART_THEME.text} fontSize={10} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
                        <Bar dataKey="count" name="Cards Issued" radius={[6, 6, 0, 0]}>
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

// ================= THEMED DATA CONTAINER =================
function ChartCard({ title, children, className = "" }) {
    return (
        <div className={`bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-5 md:p-6 shadow-2xl transition-all duration-500 hover:bg-[#0f172a]/80 hover:border-indigo-500/40 group ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>
                    {title}
                </h4>
            </div>
            
            <div className="h-[220px] md:h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
}