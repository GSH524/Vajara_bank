import { useEffect, useState } from "react";
import { fetchBankData } from "../../services/bankDataService";
import { PeopleFill, ShieldExclamation, CurrencyRupee } from "react-bootstrap-icons";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankData()
      .then((data) => {
        setCustomers(data.slice(0, 50));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Helper for Risk Level Styling
  const getRiskBadge = (level) => {
    const base = "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ";
    switch (level?.toLowerCase()) {
      case 'high':
        return `${base} bg-rose-500/10 text-rose-500 border-rose-500/20`;
      case 'medium':
        return `${base} bg-amber-500/10 text-amber-500 border-amber-500/20`;
      default:
        return `${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`;
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Fetching records...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 bg-transparent text-slate-200 font-['Outfit']">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <PeopleFill size={28} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Customer Directory</h2>
          <p className="text-slate-500 text-sm">Managing first 50 secure customer records</p>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black">
                <th className="px-6 py-5">Customer ID</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Account Type</th>
                <th className="px-6 py-5">Balance</th>
                <th className="px-6 py-5 text-center">Risk Level</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {customers.map((c, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-blue-400">
                    #{c["Customer ID"]}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      {c["First Name"]} {c["Last Name"]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{c["Account Type"]}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-200">
                    <div className="flex items-center gap-1">
                      <CurrencyRupee className="text-slate-500" />
                      {Number(c["Account Balance"]).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={getRiskBadge(c.RiskLevel)}>
                      {c.RiskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}