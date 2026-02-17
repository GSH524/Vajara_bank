import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CreditUtilization = ({ used, limit }) => {
    // Ensure we handle the specific field names from your dataset
    // used = "Credit Card Balance", limit = "Credit Limit"
    
    const utilizationPercentage = limit > 0 ? (used / limit) * 100 : 0;
    
    // Data for the semi-circle gauge
    const cappedUsed = Math.min(100, utilizationPercentage);
    const data = [
        { name: 'Used', value: cappedUsed }, 
        { name: 'Free', value: 100 - cappedUsed }
    ];

    const getStatus = (val) => {
        if (val <= 30) return { label: 'Healthy', color: '#10b981' }; // Emerald
        if (val <= 70) return { label: 'Warning', color: '#f59e0b' }; // Amber
        return { label: 'Critical', color: '#ef4444' }; // Rose
    };

    const status = getStatus(utilizationPercentage);

    return (
        <div className="h-[350px] p-6 flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl">
            {/* Title with tracking to match your Vault layout */}
            <h4 className="text-white text-[10px] font-black text-center mb-2 tracking-[0.2em] uppercase opacity-40">
                Credit Utilization
            </h4>
            
            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={data} 
                            innerRadius={70} 
                            outerRadius={90} 
                            startAngle={180} 
                            endAngle={0} 
                            dataKey="value" 
                            stroke="none"
                        >
                            <Cell fill={status.color} className="transition-all duration-700" />
                            <Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center Content: Removing decimals from the percentage display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
                    <span className="text-4xl font-black text-white tracking-tighter">
                        {Math.floor(utilizationPercentage)}%
                    </span>
                    <span 
                        className="text-[9px] font-black uppercase tracking-[0.15em] mt-1" 
                        style={{ color: status.color }}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Bottom Stats: Handling currency formatting and removing decimals */}
            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center text-[10px] font-mono tracking-tighter">
                <div className="flex flex-col">
                    <span className="text-slate-500 uppercase font-bold text-[8px] mb-1">Limit</span>
                    <span className="text-white font-bold">₹{Math.floor(limit).toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-slate-500 uppercase font-bold text-[8px] mb-1">Used Balance</span>
                    <span className="text-rose-400 font-bold">₹{Math.floor(used).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default CreditUtilization;