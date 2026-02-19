import React from 'react';
import { People, Bank, Activity, Snow, ArrowUpRight } from 'react-bootstrap-icons';

export default function DashboardStats({ data }) {
    const totalCustomers = data.length;

    // Logic: Check normalized 'isFrozen' flag or the raw 'FreezeAccount' field
    const frozenCount = data.filter(d => 
        d.isFrozen === true || 
        d.raw?.['FreezeAccount'] === true || 
        d.raw?.['FreezeAccount'] === "True"
    ).length;

    // Logic: Unified Active/Inactive count checking normalized status and raw 'ActiveStatus'
    const activeCount = data.filter(d => 
        d.activeStatus === 'Active' || 
        d.raw?.['ActiveStatus'] === 'Active'
    ).length;

    const inactiveCount = totalCustomers - activeCount;

    // Logic: Calculate total balance using normalized 'balance' or raw 'Account Balance'
    const totalBalance = data.reduce((acc, curr) => {
        const val = curr.balance || curr.raw?.['Account Balance'] || 0;
        return acc + Number(val);
    }, 0);

    const formattedBalance = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(totalBalance);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-[#070b14]">
            
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
            <div className="relative group overflow-hidden bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl transition-all hover:border-emerald-400/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-emerald-400/10 text-emerald-400 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                        <Activity size={20} />
                    </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Status</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tighter">{activeCount}</h2>
                    <span className="text-xs font-bold text-slate-400 italic">/ {inactiveCount} Inactive</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]"></div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Healthy Ratio</p>
                </div>
            </div>

            {/* 4. FROZEN ACCOUNTS */}
            <StatCard 
                label="Frozen Accounts"
                value={frozenCount.toLocaleString()}
                trend={frozenCount > 0 ? "Requires Review" : "System Clear"}
                icon={<Snow size={20} />}
                color="red"
                isAlert={frozenCount > 0}
            />
        </div>
    );
}

// StatCard helper component remains the same as provided in your snippet
function StatCard({ label, value, trend, icon, color, isHighlight, isAlert }) {
    const styles = {
        indigo: {
            icon: "text-indigo-400 bg-indigo-500/10 shadow-[0_0_15px_rgba(129,140,248,0.1)]",
            glow: "bg-indigo-500",
            border: "hover:border-indigo-400/50",
            trend: "text-indigo-400"
        },
        blue: {
            icon: "text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(96,165,250,0.1)]",
            glow: "bg-blue-500",
            border: "hover:border-blue-400/50",
            trend: "text-blue-400"
        },
        red: {
            icon: "text-red-400 bg-red-500/10 shadow-[0_0_15px_rgba(248,113,113,0.1)]",
            glow: "bg-red-500",
            border: "hover:border-red-400/50",
            trend: "text-red-400"
        }
    };

    const currentStyle = styles[color] || styles.indigo;

    return (
        <div className={`relative group overflow-hidden bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl transition-all ${currentStyle.border}`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${currentStyle.glow} group-hover:opacity-30 transition-opacity`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2.5 rounded-xl ${currentStyle.icon}`}>
                    {icon}
                </div>
                {isHighlight && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-600 text-white uppercase tracking-wider shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30">
                        Live Data
                    </span>
                )}
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 relative z-10">
                {label}
            </p>
            
            <h2 className={`text-3xl font-black tracking-tighter mb-4 relative z-10 ${isAlert ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 'text-white'}`}>
                {value}
            </h2>

            <div className="flex items-center gap-1 relative z-10">
                {trend.includes('+') ? (
                    <>
                        <ArrowUpRight size={12} className="text-emerald-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            {trend}
                        </p>
                    </>
                ) : (
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${currentStyle.trend}`}>
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}