import React, { useState, useMemo, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import CustomerTable from '../../components/admin/CustomerTable';
import CustomerModal from '../../components/admin/CustomerModal';
import { People } from 'react-bootstrap-icons';

export default function Customers() {
  const { data = [], loading, error } = useBankData(); // Default to empty array to prevent map errors
  const { overrides = {}, toggleFreeze, toggleFlag, addRemark } = useAdminActions();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({ search: '', riskLevel: 'All', status: 'All' });
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 whenever filters change to avoid "no data found" on high page numbers
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 1. MERGE DATA WITH OVERRIDES
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map(item => {
      const override = overrides[item.customerId];
      if (override) {
        return {
          ...item,
          isFrozen: override.isFrozen ?? item.isFrozen,
          isFlagged: override.flagged || false,
          riskLevel: override.flagged ? 'High' : item.riskLevel
        };
      }
      return item;
    });
  }, [data, overrides]);

  // 2. APPLY FILTERS
  const filteredData = useMemo(() => {
    return processedData.filter(customer => {
      const matchesSearch = !filters.search || 
        customer.customerId.toLowerCase().includes(filters.search.toLowerCase()) ||
        (customer.name && customer.name.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesRisk = filters.riskLevel === 'All' || customer.riskLevel === filters.riskLevel;
      const matchesStatus = filters.status === 'All' || customer.activeStatus === filters.status;
      
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [processedData, filters]);

  // 3. SLICE FOR PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0c10]">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-blue-400 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Accessing Registry...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-[#0a0c10] text-slate-100 font-['Outfit']">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/40">
              <People className="text-blue-400" size={20} />
            </div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Internal Database</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Customer <span className="text-slate-400">Registry</span>
          </h1>
        </div>

        <div className="flex items-center gap-5 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Showing</div>
            <div className="text-2xl font-mono font-bold text-white leading-none">
              {paginatedData.length}<span className="text-slate-500 text-sm ml-1">/ {filteredData.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="bg-[#161b22] border border-white/10 rounded-[2rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />        
        <div className="mt-8 overflow-x-auto">
          {/* Ensure CustomerTable receives the sliced data */}
          <CustomerTable data={paginatedData} onView={setSelectedCustomer} />
        </div>
      </div>

      <CustomerModal
        customer={selectedCustomer}
        overrides={selectedCustomer ? overrides[selectedCustomer.customerId] : {}}
        onAction={{ toggleFreeze, toggleFlag, addRemark }}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}