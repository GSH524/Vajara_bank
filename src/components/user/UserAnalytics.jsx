import React, { useMemo } from 'react';
    import {
        BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
        PieChart, Pie, Cell, Legend, AreaChart, Area
    } from 'recharts';
    import { useBankData } from '../../hooks/useBankData';
    import { useCurrentUser } from '../../hooks/useCurrentUser';
    import CreditUtilization from './CreditUtilization';

    export default function UserAnalytics() {
        const { data } = useBankData();
        const { currentUser } = useCurrentUser();

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

        const metrics = useMemo(() => {
            if (!data || !currentUser) return null;
            const userEmail = currentUser.email.toLowerCase();
            const userTxns = data.filter(d => d.email && d.email.toLowerCase() === userEmail);
            
            // --- MODIFIED SECTION: Handle Empty State for New Users ---
            if (userTxns.length === 0) {
                return {
                    cashFlow: [],
                    spending: [{ name: 'No Activity', value: 1 }], // Small slice for Pie visibility
                    balance: [],
                    creditUsed: currentUser.balance || 0,
                    creditLimit: 50000, // Default limit for visualization
                    upcoming: [],
                    emiVsOthers: []
                };
            }
            // --- END MODIFIED SECTION ---

            userTxns.sort((a, b) => new Date(a.raw['Transaction Date']) - new Date(b.raw['Transaction Date']));

            const normalizedTxns = userTxns.map(t => {
                const raw = t.raw;
                const dateObj = new Date(raw['Transaction Date']);
                const amt = Number(raw['Transaction Amount']);
                const typeValue = (raw['Transaction Type'] || '').toLowerCase();
                const reason = (raw['Transaction_Reason'] || '');

                if (isNaN(dateObj) || isNaN(amt) || amt === 0) return null;

                let txType = 'other';
                if (typeValue === 'deposit') txType = 'deposit';
                else if (typeValue === 'withdrawal' || typeValue === 'transfer') txType = 'withdrawal';
                if (reason.toUpperCase().includes('EMI')) txType = 'emi';

                return {
                    date: dateObj,
                    amount: amt,
                    type: txType,
                    reason: reason,
                    balanceAfter: Number(raw['Account Balance After Transaction']) || 0,
                    month: dateObj.toLocaleString('default', { month: 'long' }),
                    monthYear: `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`,
                    day: dateObj.getDate(),
                    dueDate: raw['Payment Due Date'] ? new Date(raw['Payment Due Date']) : null,
                    minPaymentDue: Number(raw['Minimum Payment Due']) || 0,
                    creditLimit: Number(raw['Credit Limit']) || 0,
                    creditUsed: Number(raw['Credit Card Balance']) || 0
                };
            }).filter(t => t !== null);

            const monthFlowMap = {};
            normalizedTxns.forEach(t => {
                if (!monthFlowMap[t.month]) {
                    monthFlowMap[t.month] = { name: t.month, deposits: 0, withdrawals: 0, emi: 0, NetFlow: 0, sortId: t.monthYear };
                }
                if (t.type === 'deposit') monthFlowMap[t.month].deposits += t.amount;
                else if (t.type === 'withdrawal') monthFlowMap[t.month].withdrawals += t.amount;
                else if (t.type === 'emi') monthFlowMap[t.month].emi += t.amount;
            });

            Object.values(monthFlowMap).forEach(m => { m.NetFlow = m.deposits - m.withdrawals - m.emi; });

            const spendingMap = {};
            normalizedTxns.forEach(t => {
                if (t.type === 'deposit') return;
                const category = mapCategory(t.reason);
                spendingMap[category] = (spendingMap[category] || 0) + t.amount;
            });

            const spending = Object.keys(spendingMap).map(k => ({ name: k, value: spendingMap[k] }));

            let latestCreditLimit = 0;
            let latestCreditUsed = 0;
            for (let i = normalizedTxns.length - 1; i >= 0; i--) {
                if (normalizedTxns[i].creditLimit > 0) {
                    latestCreditLimit = normalizedTxns[i].creditLimit;
                    latestCreditUsed = normalizedTxns[i].creditUsed;
                    break;
                }
            }

            const finalUsed = currentUser.creditBalance !== undefined ? currentUser.creditBalance : latestCreditUsed;
            const finalLimit = currentUser.creditLimit !== undefined ? currentUser.creditLimit : latestCreditLimit;

            const balanceTrend = normalizedTxns.map(t => ({
                name: `${t.day} ${t.month.slice(0, 3)}`,
                balance: t.balanceAfter,
                sortKey: `${t.monthYear}-${String(t.day).padStart(2, '0')}-${Math.random()}`
            }));

            const today = new Date();
            const upcomingMap = {};
            normalizedTxns.forEach(t => {
                if (t.type !== 'emi' || !t.dueDate || t.dueDate <= today || t.minPaymentDue === 0) return;
                const dueSortKey = `${t.dueDate.getFullYear()}-${String(t.dueDate.getMonth() + 1).padStart(2, '0')}`;
                if (!upcomingMap[dueSortKey]) {
                    upcomingMap[dueSortKey] = { name: t.dueDate.toLocaleString('default', { month: 'long' }), Amount: 0, sortId: dueSortKey };
                }
                upcomingMap[dueSortKey].Amount = Math.max(upcomingMap[dueSortKey].Amount, t.minPaymentDue);
            });

            const monthlyEMIMap = {};
            normalizedTxns.forEach(t => {
                if (t.type === 'deposit') return;
                if (!monthlyEMIMap[t.month]) {
                    monthlyEMIMap[t.month] = { name: t.month, EMI: 0, Others: 0, sortId: t.monthYear };
                }
                if (t.type === 'emi') monthlyEMIMap[t.month].EMI += t.amount;
                else if (t.type === 'withdrawal') monthlyEMIMap[t.month].Others += t.amount;
            });

            return {
                cashFlow: Object.values(monthFlowMap).sort((a, b) => a.sortId.localeCompare(b.sortId)),
                spending: spending.length > 0 ? spending : [{ name: 'No Record', value: 1 }],
                balance: balanceTrend.sort((a, b) => a.sortKey.localeCompare(b.sortKey)).slice(-30),
                creditUsed: finalUsed,
                creditLimit: finalLimit,
                upcoming: Object.values(upcomingMap).sort((a, b) => a.sortId.localeCompare(b.sortId)).slice(-4),
                emiVsOthers: Object.values(monthlyEMIMap).filter(v => (v.EMI + v.Others) > 0).sort((a, b) => a.sortId.localeCompare(b.sortId))
            };
        }, [data, currentUser]);

        if (!metrics) return <div className="p-10 text-slate-500 animate-pulse font-medium">Gathering secure financial data...</div>;

        const formatCurrency = (val) => {
            if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
            return `₹${val.toFixed(0)}`;
        };

        const totalSpend = metrics.spending.reduce((sum, item) => sum + item.value, 0);
        const PIE_COLORS = ['#3b82f6', '#1e3a8a', '#f97316', '#a21caf', '#db2777', '#4ade80'];

        const AnalyticsCard = ({ title, children }) => (
            <div className="h-[350px] p-6 flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:border-blue-500/40 transition-all duration-300 group">
                <h4 className="text-white text-base font-bold text-center mb-5 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{title}</h4>
                <div className="flex-1 min-h-0">
                    {children}
                </div>
            </div>
        );

        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                        <p className="text-white text-xs font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                        {payload.map((p, i) => (
                            <p key={i} className="text-[11px] font-medium py-0.5" style={{ color: p.color }}>
                                {p.name}: <span className="text-white">₹{Number(p.value).toLocaleString()}</span>
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

                    {/* 1. Monthly Cash Flow */}
                    <AnalyticsCard title="Monthly Cash Flow">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.cashFlow}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar dataKey="deposits" stackId="a" fill="#10b981" name="Deposits" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="withdrawals" stackId="a" fill="#ef4444" name="Withdrawals" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="emi" stackId="a" fill="#f59e0b" name="EMI" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>

                    {/* 2. Spending Distribution */}
                    <AnalyticsCard title="Spending Distribution">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                                <Pie
                                    data={metrics.spending}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    dataKey="value"
                                    stroke="none"
                                    paddingAngle={5}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {metrics.spending.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                            className="hover:opacity-80 transition-opacity outline-none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                                />
                                <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">
                                    <tspan x="50%" dy="0" className="fill-white text-lg font-black font-mono">
                                        {formatCurrency(totalSpend > 1 ? totalSpend : 0)}
                                    </tspan>
                                    <tspan x="50%" dy="20" className="fill-slate-500 text-[9px] font-bold uppercase tracking-widest">
                                        Total Outflow
                                    </tspan>
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>

                    <CreditUtilization used={metrics.creditUsed} limit={metrics.creditLimit} />

                    {/* 4. Balance Trend */}
                    <AnalyticsCard title="Balance Stability">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.balance}>
                                <defs>
                                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>

                    {/* 5. Upcoming Payments */}
                    <AnalyticsCard title="Upcoming Payments">
                        <div className="mt-2 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                            {metrics.upcoming.length > 0 ? (
                                metrics.upcoming.map(payment => {
                                    const maxAmount = Math.max(...metrics.upcoming.map(p => p.Amount));
                                    const widthPercent = (payment.Amount / maxAmount) * 100;
                                    return (
                                        <div key={payment.sortId} className="group/item">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-white text-xs font-bold uppercase tracking-wider">{payment.name}</span>
                                                <span className="text-blue-400 font-mono text-sm font-bold tracking-tighter italic">₹{payment.Amount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full transition-all duration-1000 group-hover/item:brightness-125"
                                                    style={{ width: `${widthPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">No scheduled obligations found</div>
                            )}
                        </div>
                    </AnalyticsCard>

                    {/* 6. EMI vs Other Spending */}
                    <AnalyticsCard title="EMI vs General">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.emiVsOthers}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar dataKey="EMI" fill="#f59e0b" name="EMI" barSize={15} radius={[10, 10, 0, 0]} />
                                <Bar dataKey="Others" fill="#3b82f6" name="Others" barSize={15} radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>

                </div>
            </div>
        );
    }