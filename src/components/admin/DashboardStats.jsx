import React from 'react';
import { People, Bank, Activity, Snow, ArrowUpRight } from 'react-bootstrap-icons';

export default function DashboardStats({ data }) {
    // CALCULATE STATS
    const totalCustomers = data.length;
    const frozenCount = data.filter(d => d.isFrozen).length;
    const activeCount = data.filter(d => d.activeStatus === 'Active').length;
    const inactiveCount = data.filter(d => d.activeStatus === 'Inactive').length;

    // FORMAT CURRENCY
    const totalBalance = data.reduce((acc, curr) => acc + curr.balance, 0);
    const formattedBalance = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(totalBalance);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. TOTAL CUSTOMERS */}
            <StatCard 
                label="Total Customers"
                value={totalCustomers.toLocaleString()}
                trend="+12% this month"
                icon={<People size={20} />}
                color="indigo"
            />

            {/* 2. TOTAL LIQUIDITY */}
            <StatCard 
                label="Total Liquidity"
                value={formattedBalance}
                trend="Across all accounts"
                icon={<Bank size={20} />}
                color="blue"
                isHighlight
            />

            {/* 3. ACTIVE STATUS */}
            <div className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl transition-all hover:border-emerald-500/30">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Activity size={20} />
                    </div>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Active Status</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tighter">{activeCount}</h2>
                    <span className="text-xs font-bold text-slate-500 italic">/ {inactiveCount} Inactive</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Healthy Ratio</p>
                </div>
            </div>

            {/* 4. FROZEN ACCOUNTS */}
            <StatCard 
                label="Frozen Accounts"
                value={frozenCount.toLocaleString()}
                trend="Requires Review"
                icon={<Snow size={20} />}
                color="red"
                isAlert={frozenCount > 0}
            />

        </div>
    );
}

function StatCard({ label, value, trend, icon, color, isHighlight, isAlert }) {
    // We define full tailwind classes here so the compiler sees them
    const styles = {
        indigo: {
            icon: "text-indigo-400 bg-indigo-500/10",
            glow: "bg-indigo-500",
            border: "hover:border-indigo-500/30"
        },
        blue: {
            icon: "text-blue-400 bg-blue-500/10",
            glow: "bg-blue-500",
            border: "hover:border-blue-500/30"
        },
        red: {
            icon: "text-red-400 bg-red-500/10",
            glow: "bg-red-500",
            border: "hover:border-red-500/30"
        }
    };

    const currentStyle = styles[color] || styles.indigo;

    return (
        <div className={`relative group overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl transition-all ${currentStyle.border}`}>
            {/* Subtle Gradient Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${currentStyle.glow} group-hover:opacity-20 transition-opacity`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2.5 rounded-xl ${currentStyle.icon}`}>
                    {icon}
                </div>
                {isHighlight && (
                    <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-500 text-white uppercase tracking-tighter shadow-lg shadow-blue-500/20">
                        Live Data
                    </span>
                )}
            </div>

            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 relative z-10">
                {label}
            </p>
            
            <h2 className={`text-3xl font-black tracking-tighter mb-4 relative z-10 ${isAlert ? 'text-red-500' : 'text-white'}`}>
                {value}
            </h2>

            <div className="flex items-center gap-1 relative z-10">
                {trend.includes('+') && <ArrowUpRight size={12} className="text-emerald-500" />}
                <p className={`text-[10px] font-black uppercase tracking-widest ${trend.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {trend}
                </p>
            </div>
        </div>
    );
}