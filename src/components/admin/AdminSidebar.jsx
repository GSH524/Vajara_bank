import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Grid1x2, 
  People, 
  Wallet2, 
  CreditCard, 
  ArrowLeftRight, 
  Bank, 
  GraphUp, 
  BoxArrowRight,
  ShieldCheck,
  ChevronRight
} from "react-bootstrap-icons";

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  // Refined Active Link Logic
  const navLinkClass = ({ isActive }) => 
    `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${
      isActive 
        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent"
    }`;

  return (
    <aside className="w-72 h-screen bg-[#020617] flex flex-col border-r border-white/[0.04] sticky top-0 overflow-hidden">
      
      {/* 1. BRANDING SECTION */}
      <div className="p-8">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-10 h-10 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center shadow-2xl">
              <Bank className="text-indigo-500" size={20} />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-none">Vajra<span className="text-indigo-500">Bank</span></h2>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="text-emerald-500" size={10} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Verified Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION SECTION */}
      <div className="px-4 py-2">
        <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        <nav className="space-y-1.5">
          {[
            { to: "/admin", icon: <Grid1x2 size={18} />, label: "Dashboard", end: true },
            { to: "/admin/users", icon: <People size={18} />, label: "Customers" },
            { to: "/admin/accounts", icon: <Wallet2 size={18} />, label: "Accounts" },
            { to: "/admin/cards", icon: <CreditCard size={18} />, label: "Cards" },
            { to: "/admin/transactions", icon: <ArrowLeftRight size={18} />, label: "Transactions" },
            { to: "/admin/loans", icon: <Bank size={18} />, label: "Loans" },
            { to: "/admin/reports", icon: <GraphUp size={18} />, label: "Reports" },
          ].map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5">
                    <span className={`${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-semibold tracking-wide">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={12} className="text-indigo-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 3. SYSTEM HEALTH / UPGRADE CARD (Common in Industry Dashboards) */}
      <div className="mt-6 px-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
            <GraphUp size={40} className="text-indigo-500" />
          </div>
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">System Health</p>
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-xs text-slate-300">All services operational</p>
          </div>
        </div>
      </div>

      {/* 4. USER PROFILE & LOGOUT */}
      <div className="mt-auto border-t border-white/[0.04] p-6 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 ring-offset-2 ring-offset-[#020617]">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-white truncate">{user?.name || "Admin User"}</span>
            <span className="text-[11px] text-slate-500 truncate lowercase">{user?.email || "admin@vajrabank.com"}</span>
          </div>
        </div>

        <button 
          className="group w-full flex items-center justify-between px-4 py-2.5 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl text-[13px] font-bold transition-all duration-300 border border-white/5 hover:border-red-500/30"
          onClick={logout}
        >
          <div className="flex items-center gap-2">
            <BoxArrowRight size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Terminate Session</span>
          </div>
          <div className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 px-1.5 py-0.5 rounded text-red-500 font-black">EXIT</div>
        </button>
      </div>
    </aside>
  );
}