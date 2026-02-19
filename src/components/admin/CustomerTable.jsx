import React, { useState, useEffect, useMemo } from 'react';
import { Eye, ChevronLeft, ChevronRight, Search, XCircle } from 'react-bootstrap-icons';
import { collection, getDocs } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    Cell, LabelList 
} from 'recharts';

export default function CustomerTable({ onView }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRisk, setSelectedRisk] = useState("All Risks");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    useEffect(() => {
        const fetchCombinedData = async () => {
            try {
                // 1. Fetch Identity and Financial Data from Firebase
                const [legacySnap, newSnap] = await Promise.all([
                    getDocs(collection(userDB, 'users1')),
                    getDocs(collection(userDB, 'users'))
                ]);

                const firebaseUsers = [
                    ...legacySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    ...newSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                ].map(u => ({
                    // Primary Key mapping
                    customerId: u["Customer ID"] || u.customerId || u.uid || u.id,
                    // Identity mapping (Handles spaces in keys from legacy data)
                    fullName: u.fullName || `${u["First Name"] || u.firstName || ''} ${u["Last Name"] || u.lastName || ''}`.trim(),
                    email: u.Email || u.email || 'N/A',
                    activeStatus: u.ActiveStatus || u.activeStatus || u.status || 'Active',
                    // Account details for filtering
                    accountBalance: Number(u["Account Balance"] || u.balance || 0),
                    accountType: u["Account Type"] || u.accountType || 'Savings'
                }));

                // 2. Fetch Neural Risk Profile from FastAPI Backend
                // This endpoint returns: [{ "customerId": "...", "riskLevel": "High" }, ...]
                const response = await fetch('http://127.0.0.1:8000/api/dashboard-summary');
                const riskProfiles = await response.json();

                // 3. Merge Firebase Identity with Backend ML Risk Level
                const mergedData = firebaseUsers.map(user => {
                    const riskMatch = riskProfiles.find(r => r.customerId === user.customerId);
                    return {
                        ...user,
                        // Priority: Backend ML Score > Firebase Static Field > Default "Low"
                        riskLevel: riskMatch ? riskMatch.riskLevel : (user.RiskLevel || 'Low')
                    };
                });

                setData(mergedData);
            } catch (err) {
                console.error("Critical Data Sync Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCombinedData();
    }, []);

    // Filter Logic using useMemo for performance
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesRisk = selectedRisk === "All Risks" || item.riskLevel === selectedRisk;
            const matchesStatus = selectedStatus === "All Status" || item.activeStatus === selectedStatus;
            return matchesSearch && matchesRisk && matchesStatus;
        });
    }, [data, searchTerm, selectedRisk, selectedStatus]);

    // KPI Totals based on current dataset
    const kpis = useMemo(() => [
        { name: 'Total Users', count: data.length, color: '#3b82f6' },
        { name: 'High Risk', count: data.filter(c => c.riskLevel === 'High').length, color: '#f43f5e' },
        { name: 'Medium Risk', count: data.filter(c => c.riskLevel === 'Medium').length, color: '#fbbf24' },
        { name: 'Low Risk', count: data.filter(c => c.riskLevel === 'Low').length, color: '#10b981' }
    ], [data]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center bg-[#0a0c10] min-h-screen">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-mono animate-pulse uppercase tracking-widest text-xs">Synchronizing Identity Vault...</p>
        </div>
    );

    return (
        <div className="p-8 bg-[#0a0c10] min-h-screen text-white font-sans">
            {/* Top Navigation & Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#0f1218] p-4 rounded-2xl border border-white/5 shadow-xl">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm outline-none focus:border-indigo-500 text-white transition-all"
                        placeholder="Search Nodes by ID, Name, or Email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <select
                    value={selectedRisk}
                    onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
                    className="bg-[#161b22] border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-indigo-500"
                >
                    <option value="All Risks">Filter: Risk Level</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                </select>

                <button onClick={() => {setSearchTerm(""); setSelectedRisk("All Risks"); setSelectedStatus("All Status");}} className="text-slate-500 hover:text-white transition-colors">
                    <XCircle size={20} />
                </button>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {kpis.map(kpi => (
                    <div key={kpi.name} className="bg-[#0f1218] border border-white/5 p-6 rounded-[2rem] shadow-2xl group hover:border-indigo-500/30 transition-all">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{kpi.name}</p>
                        <p className="text-4xl font-bold mt-2 font-mono" style={{ color: kpi.color }}>{kpi.count.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {/* Recharts Analytics Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="bg-[#0f1218] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Analytics Match</p>
                    <p className="text-6xl font-black text-indigo-500 tracking-tighter">{filteredData.length.toLocaleString()}</p>
                    <p className="mt-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Live Registry Items</p>
                </div>

                <div className="lg:col-span-2 bg-[#0f1218] border border-white/5 p-8 rounded-[2.5rem] h-64 shadow-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kpis.slice(1)} margin={{ top: 25, right: 10, left: 10, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                            <YAxis hide={true} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                            <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={50}>
                                {kpis.slice(1).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList dataKey="count" position="top" fill="#ffffff" fontSize={12} fontWeight="bold" formatter={(val) => val.toLocaleString()} offset={10} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-[#0f1218]/30 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Entity ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Risk Level</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right uppercase text-[10px] text-slate-500 tracking-[0.2em]">Vault Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {currentRows.map(customer => (
                                <tr key={customer.customerId} className="hover:bg-indigo-500/[0.03] transition-colors group">
                                    <td className="px-8 py-5 font-mono text-[11px] text-indigo-400/70">{customer.customerId}</td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{customer.fullName}</div>
                                        <div className="text-[10px] text-slate-500 font-mono tracking-tighter">{customer.email}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-lg ${
                                            customer.riskLevel === 'High' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
                                            customer.riskLevel === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                                            'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                                        }`}>
                                            {customer.riskLevel} Profile
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-1.5 w-1.5 rounded-full ${customer.activeStatus === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`}></div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${customer.activeStatus === 'Active' ? 'text-emerald-500/80' : 'text-slate-600'}`}>
                                                {customer.activeStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button onClick={() => onView(customer)} className="bg-indigo-600/10 text-indigo-400 p-2.5 rounded-xl hover:bg-indigo-600 hover:text-white border border-indigo-500/20 transition-all shadow-xl active:scale-90">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        Displaying <span className="text-indigo-400">{indexOfFirstRow + 1}</span> to <span className="text-indigo-400">{Math.min(indexOfLastRow, filteredData.length)}</span> of {filteredData.length} Cloud Records
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-3 bg-slate-900 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-slate-800 transition-all"><ChevronLeft size={14}/></button>
                        <div className="bg-slate-900 px-4 py-2 border border-white/10 rounded-xl text-xs font-mono font-bold text-white tracking-widest">
                            {currentPage} / {totalPages || 1}
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 bg-slate-900 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-slate-800 transition-all"><ChevronRight size={14}/></button>
                    </div>
                </div>
            </div>
        </div>
    );
}