import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, Search, XCircle } from 'react-bootstrap-icons';
// Combined all Recharts imports into one block to fix the 500 Error
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell, 
    LabelList 
} from 'recharts';

export default function CustomerDashboard({ onView }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRisk, setSelectedRisk] = useState("All Risks");
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/dashboard-summary')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch data", err);
                setLoading(false);
            });
    }, []);

    // 1. COMBINED FILTER LOGIC
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Normalize data comparison to ensure "Active" matches "Active"
        const matchesRisk = selectedRisk === "All Risks" || item.riskLevel === selectedRisk;
        const matchesStatus = selectedStatus === "All Status" || item.activeStatus === selectedStatus;

        return matchesSearch && matchesRisk && matchesStatus;
    });

    // 2. KPI Totals
    const kpis = [
        { name: 'Total Users', count: data.length, color: '#3b82f6' },
        { name: 'High Value', count: data.filter(c => c.riskLevel === 'High').length, color: '#f43f5e' },
        { name: 'Medium Value', count: data.filter(c => c.riskLevel === 'Medium').length, color: '#fbbf24' },
        { name: 'Low Value', count: data.filter(c => c.riskLevel === 'Low').length, color: '#10b981' }
    ];

    // 3. Pagination
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedRisk("All Risks");
        setSelectedStatus("All Status");
        setCurrentPage(1);
    };

    if (loading) return <div className="p-20 text-center text-slate-500 font-mono animate-pulse uppercase">Syncing Surveillance...</div>;

    return (
        <div className="p-8 bg-[#0a0c10] min-h-screen text-white font-sans">

            {/* TOP BAR FILTERS */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#0f1218] p-4 rounded-2xl border border-white/5">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm outline-none focus:border-blue-500 text-white"
                        placeholder="Search by ID, Name, or Email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <select
                    value={selectedRisk}
                    onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
                    className="bg-[#161b22] border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-blue-500 text-white"
                >
                    <option value="All Risks">All Risks</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                </select>

                <select
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="bg-[#161b22] border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-blue-500 text-white"
                >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                <button onClick={resetFilters} className="text-slate-500 hover:text-white transition-colors">
                    <XCircle size={20} />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {kpis.map(kpi => (
                    <div key={kpi.name} className="bg-[#0f1218] border border-white/5 p-6 rounded-[2rem] shadow-2xl">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{kpi.name}</p>
                        <p className="text-4xl font-bold mt-2" style={{ color: kpi.color }}>{kpi.count.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="bg-[#0f1218] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Results</p>
                    <p className="text-5xl font-bold text-blue-500">{filteredData.length.toLocaleString()}</p>
                    <p className="mt-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Filtered Matches</p>
                </div>

                <div className="lg:col-span-2 bg-[#0f1218] border border-white/5 p-8 rounded-[2.5rem] h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kpis.slice(1)} margin={{ top: 25, right: 10, left: 10, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 'bold' }}
                                dy={10}
                            />
                            <YAxis hide={true} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{
                                    backgroundColor: '#161b22',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={45}>
                                {kpis.slice(1).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList
                                    dataKey="count"
                                    position="top"
                                    fill="#ffffff"
                                    fontSize={12}
                                    fontWeight="bold"
                                    formatter={(val) => val.toLocaleString()}
                                    offset={10}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0f1218]/30 border border-white/5 rounded-[2rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase">Entity ID</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase">Identity</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase">Risk Profile</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-5 text-right uppercase text-[10px] text-slate-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {currentRows.map(customer => (
                            <tr key={customer.customerId} className="hover:bg-blue-500/[0.03] transition-colors">
                                <td className="px-6 py-5 font-mono text-[10px] text-slate-500">{customer.customerId}</td>
                                <td className="px-6 py-5">
                                    <div className="text-sm font-bold text-white">{customer.fullName}</div>
                                    <div className="text-[10px] text-slate-500">{customer.email}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                        customer.riskLevel === 'High' ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' :
                                        customer.riskLevel === 'Medium' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' :
                                        'text-emerald-500 border-emerald-500/20 bg-emerald-500/10'
                                    }`}>
                                        {customer.riskLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1 w-1 rounded-full ${customer.activeStatus === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${customer.activeStatus === 'Active' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                            {customer.activeStatus}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => onView(customer)} className="bg-white/5 p-2 rounded-xl hover:bg-blue-600 border border-white/5 transition-all">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-8 py-5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        Showing <span className="text-white">{indexOfFirstRow + 1}—{Math.min(indexOfLastRow, filteredData.length)}</span> of {filteredData.length}
                    </p>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-white/5 rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"><ChevronLeft /></button>
                        <span className="text-xs font-mono text-white">{currentPage} / {totalPages || 1}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-white/5 rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"><ChevronRight /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}