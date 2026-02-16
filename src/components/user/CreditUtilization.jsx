import React from 'react';
import { InfoCircle } from 'react-bootstrap-icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const CreditUtilization = ({ used, limit }) => {
    // Calculate percentage, capped at 100
    const utilization = limit > 0 ? (used / limit) * 100 : 0;
    const cappedUtilization = Math.min(100, Math.max(0, utilization));
    
    // Remaining portion for the donut chart
    const remaining = 100 - cappedUtilization;

    const data = [
        { name: 'Used', value: cappedUtilization },
        { name: 'Remaining', value: remaining }
    ];

    const getStatusLabel = (val) => {
        if (val <= 30) return { label: 'Excellent', color: '#10b981', textColor: 'text-emerald-400', bg: 'bg-emerald-500' };
        if (val <= 50) return { label: 'Good', color: '#3b82f6', textColor: 'text-blue-400', bg: 'bg-blue-500' };
        if (val <= 75) return { label: 'High Usage', color: '#f59e0b', textColor: 'text-amber-400', bg: 'bg-amber-500' };
        return { label: 'Critical', color: '#f43f5e', textColor: 'text-rose-500', bg: 'bg-rose-500' };
    };

    const status = getStatusLabel(utilization);

    if (!limit || limit === 0) {
        return (
            <div className="h-[350px] p-10 flex flex-col items-center justify-center text-center bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-dashed border-white/10 group hover:border-indigo-500/50 transition-all duration-500">
                <div className="text-5xl mb-6 opacity-30 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500">💳</div>
                <h4 className="text-white text-lg font-black uppercase tracking-tighter italic">No Active Credit</h4>
                <p className="text-slate-500 text-sm mt-2 max-w-[200px] leading-relaxed font-medium">Apply for a Vajra asset to initialize credit monitoring.</p>
            </div>
        );
    }

    return (
        <div className="h-[350px] p-6 flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:border-blue-500/30 group relative overflow-hidden">
            
            {/* HEADER */}
            <div className="flex justify-between items-start mb-2 relative z-10">
                <h4 className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">Credit Utilization</h4>
                <div className="relative group/tooltip cursor-help">
                    <InfoCircle size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    <span className="absolute bottom-full right-0 mb-2 w-40 p-2 bg-slate-950 text-white text-[10px] font-bold text-center rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all border border-white/10 shadow-xl z-50 pointer-events-none">
                        Maintains credit health. Lower usage improves your score.
                    </span>
                </div>
            </div>

            {/* CHART SECTION */}
            <div className="flex-1 relative flex items-center justify-center -mt-4">
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            startAngle={200}
                            endAngle={-20}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={cappedUtilization > 0 && cappedUtilization < 100 ? 5 : 0}
                        >
                            <Cell key="used" fill={status.color} className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                            <Cell key="remaining" fill="#1e293b" /> {/* Slate-800 for empty track */}
                        </Pie>
                        
                        {/* Center Text */}
                        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle">
                            <tspan x="50%" dy="0" className={`text-4xl font-black italic tracking-tighter ${status.textColor}`} fill="currentColor">
                                {Math.round(utilization)}%
                            </tspan>
                            <tspan x="50%" dy="24" className="fill-slate-500 text-[10px] font-black uppercase tracking-widest">
                                {status.label}
                            </tspan>
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* FOOTER STATS */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3 relative z-10">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Used Amount</span>
                    <span className="text-white font-mono font-bold">₹{used.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Total Limit</span>
                    <span className="text-slate-300 font-mono">₹{limit.toLocaleString()}</span>
                </div>
                
                {/* Mini Progress Bar Indicator */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div 
                        className={`h-full transition-all duration-1000 ${status.bg}`} 
                        style={{ width: `${cappedUtilization}%` }}
                    />
                </div>
            </div>

        </div>
    );
};

export default CreditUtilization;