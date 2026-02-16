import { NavLink } from "react-router-dom";
import { X, LayoutTextSidebarReverse, People, CreditCard, CashStack, ShieldCheck, GraphUp, Megaphone, PersonBadge, Grid1x2Fill } from "react-bootstrap-icons";

export default function Sidebar({ isOpen, onClose }) {
  
  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: <Grid1x2Fill /> },
    { name: "Profile", path: "profile", icon: <PersonBadge /> },
    { name: "Customers", path: "customers", icon: <People /> },
    { name: "Accounts", path: "accounts", icon: <LayoutTextSidebarReverse /> },
    { name: "Cards", path: "cards", icon: <CreditCard /> },
    { name: "Loans", path: "loans", icon: <CashStack /> },
    { name: "KYC", path: "kyc", icon: <ShieldCheck /> },
    { name: "Reports", path: "reports", icon: <GraphUp /> },
    { name: "Ads Management", path: "ads", icon: <Megaphone /> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY: Blur background when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        h-full w-full flex flex-col
      `}>
        <div className="flex flex-col h-full p-6">
          
          {/* HEADER */}
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-white tracking-tighter italic">
                BANK<span className="text-blue-500 underline decoration-blue-500/30">ADMIN</span>
              </h2>
              <button 
                className="lg:hidden p-2 text-slate-400 hover:text-white"
                onClick={onClose}
              >
                <X size={28} />
              </button>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mt-2">
              Management Portal
            </p>
          </div>

          {/* MENU */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}
                    `}
                  >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* FOOTER / VERSION */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-slate-950/50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
                Vajra v2.0.4
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}