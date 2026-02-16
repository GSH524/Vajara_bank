import React from 'react';
import { Search, Funnel, FilterCircle } from 'react-bootstrap-icons';

export default function CustomerFilters({ filters, setFilters }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl p-4 border border-white/5 rounded-2xl shadow-xl">
            
            {/* 1. SEARCH INPUT SECTION */}
            <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                </div>
                <input
                    type="text"
                    name="search"
                    autoComplete="off"
                    placeholder="Search by ID, Name, or Email..."
                    value={filters.search}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                />
            </div>

            {/* 2. DROPDOWN FILTERS SECTION */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Visual Divider for Desktop */}
                <div className="hidden md:block h-6 w-[1px] bg-white/10 mx-2"></div>
                
                <div className="flex items-center gap-2 w-full">
                    {/* Risk Level Filter */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                            <FilterCircle size={14} />
                        </div>
                        <select
                            name="riskLevel"
                            value={filters.riskLevel}
                            onChange={handleChange}
                            className="w-full appearance-none bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold text-slate-300 hover:text-white hover:border-white/20 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer uppercase tracking-wider"
                        >
                            <option value="All">All Risks</option>
                            <option value="High" className="text-red-400">High Risk</option>
                            <option value="Medium" className="text-yellow-400">Medium Risk</option>
                            <option value="Low" className="text-emerald-400">Low Risk</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                            <Funnel size={14} />
                        </div>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="w-full appearance-none bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold text-slate-300 hover:text-white hover:border-white/20 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer uppercase tracking-wider"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Quick Reset / Clear Button */}
                    <button 
                        onClick={() => setFilters({ search: '', riskLevel: 'All', status: 'All' })}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-colors"
                        title="Clear Filters"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}