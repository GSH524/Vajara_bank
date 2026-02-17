import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import CreditUtilization from './CreditUtilization';

// 1. Keep your existing category mapping
const mapCategory = (reason) => {
    const r = (reason || '').toLowerCase();
    if (r.includes('shop')) return 'Shopping';
    if (r.includes('bill')) return 'Bills';
    if (r.includes('emi')) return 'EMI';
    if (r.includes('recharge')) return 'Recharge';
    if (r.includes('transfer')) return 'Transfer';
    if (r.includes('rent')) return 'Rent';
    return 'Others';
};

// 2. Accept props from UserDashboard to enable real-time updates
export default function UserAnalytics({ transactions = [], currentProfile = null }) {
    
    const metrics = useMemo(() => {
        // Use props if available, otherwise return empty state
        if (!currentProfile || transactions.length === 0) {
            return {
                cashFlow: [],
                spending: [{ name: 'No Activity', value: 1 }],
                balance: [],
                creditUsed: 0,
                creditLimit: 50000,
                upcoming: [],
                emiVsOthers: []
            };
        }

        // --- REAL-TIME DATA PROCESSING ---
        // Sort transactions by date (combining JSON and Firebase data)
        const normalizedTxns = transactions.map(t => {
            const dateObj = new Date(t.date);
            const amt = Number(t.amount);
            const isDeposit = t.type === 'Deposit';
            
            return {
                date: dateObj,
                amount: amt,
                type: isDeposit ? 'deposit' : (t.reason?.toUpperCase().includes('EMI') ? 'emi' : 'withdrawal'),
                reason: t.reason || '',
                balanceAfter: currentProfile.balance || 0, // Latest balance snapshot
                month: dateObj.toLocaleString('default', { month: 'long' }),
                monthYear: `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`,
                day: dateObj.getDate()
            };
        }).sort((a, b) => a.date - b.date);

        // Map logic for charts (Keep your existing visual logic)
        const monthFlowMap = {};
        const spendingMap = {};
        const monthlyEMIMap = {};

        normalizedTxns.forEach(t => {
            if (!monthFlowMap[t.month]) {
                monthFlowMap[t.month] = { name: t.month, deposits: 0, withdrawals: 0, emi: 0, sortId: t.monthYear };
            }
            if (t.type === 'deposit') monthFlowMap[t.month].deposits += t.amount;
            else if (t.type === 'withdrawal') monthFlowMap[t.month].withdrawals += t.amount;
            else if (t.type === 'emi') monthFlowMap[t.month].emi += t.amount;

            if (t.type !== 'deposit') {
                const category = mapCategory(t.reason);
                spendingMap[category] = (spendingMap[category] || 0) + t.amount;
            }
        });

        const balanceTrend = normalizedTxns.map(t => ({
            name: `${t.day} ${t.month.slice(0, 3)}`,
            balance: t.balanceAfter,
            sortKey: `${t.monthYear}-${t.day}`
        }));

        return {
            cashFlow: Object.values(monthFlowMap).sort((a, b) => a.sortId.localeCompare(b.sortId)),
            spending: Object.keys(spendingMap).map(k => ({ name: k, value: spendingMap[k] })),
            balance: balanceTrend.slice(-30),
            creditUsed: currentProfile.creditUsed || 0,
            creditLimit: currentProfile.creditLimit || 50000,
            emiVsOthers: Object.values(monthlyEMIMap).sort((a, b) => a.sortId.localeCompare(b.sortId))
        };
    }, [transactions, currentProfile]); // Re-run when transactions prop changes

    // --- RENDER LOGIC (Keep exactly as your current visual design) ---
    if (!metrics) return <div className="p-10 text-slate-500 animate-pulse">Syncing...</div>;

    const formatCurrency = (val) => val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`;
    const totalSpend = metrics.spending.reduce((sum, item) => sum + item.value, 0);
    const PIE_COLORS = ['#3b82f6', '#1e3a8a', '#f97316', '#a21caf', '#db2777', '#4ade80'];

    const AnalyticsCard = ({ title, children }) => (
        <div className="h-[350px] p-6 flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <h4 className="text-white text-base font-bold text-center mb-5 tracking-tight uppercase">{title}</h4>
            <div className="flex-1 min-h-0">{children}</div>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl">
                    <p className="text-white text-xs font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} className="text-[11px] font-medium py-0.5" style={{ color: p.color }}>
                            {p.name}: <span className="text-white">₹{p.value.toLocaleString()}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#080f25] p-6 lg:p-10 rounded-3xl mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnalyticsCard title="Monthly Cash Flow">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.cashFlow}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Bar dataKey="deposits" stackId="a" fill="#10b981" name="Deposits" />
                            <Bar dataKey="withdrawals" stackId="a" fill="#ef4444" name="Withdrawals" />
                            <Bar dataKey="emi" stackId="a" fill="#f59e0b" name="EMI" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                <AnalyticsCard title="Spending Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={metrics.spending} cx="50%" cy="45%" innerRadius={65} outerRadius={85} dataKey="value" stroke="none" paddingAngle={5}>
                                {metrics.spending.map((entry, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-black font-mono">
                                {formatCurrency(totalSpend)}
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                <CreditUtilization used={metrics.creditUsed} limit={metrics.creditLimit} />

                <AnalyticsCard title="Balance Stability">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics.balance}>
                            <defs>
                                <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorBal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </AnalyticsCard>
            </div>
        </div>
    );
}