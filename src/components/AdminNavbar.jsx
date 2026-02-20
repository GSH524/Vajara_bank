import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  List,
  X,
  BoxArrowRight,
  Grid1x2Fill,
  ShieldCheck,
  House,
  Envelope,
  InfoCircle,
  PersonCircle,
  ChevronDown,
  People,
  LayoutTextSidebarReverse,
  CreditCard,
  CashStack,
  GraphUp,
  Megaphone,
  Cpu,
  Bell
} from "react-bootstrap-icons";

export default function AdminNavbar({ admin, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const profileRef = useRef(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (consoleRef.current && !consoleRef.current.contains(event.target)) {
        setIsConsoleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocalLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    if (onLogout) await onLogout();
  };

  const adminItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Grid1x2Fill />, desc: "Control Center" },
    { name: "Customers", path: "/admin/customers", icon: <People />, desc: "User Directory" },
    { name: "Accounts", path: "/admin/accounts", icon: <LayoutTextSidebarReverse />, desc: "Ledger Mgmt" },
    { name: "Cards", path: "/admin/cards", icon: <CreditCard />, desc: "Issuance" },
    { name: "Loans", path: "/admin/loans", icon: <CashStack />, desc: "Credit Desk" },
    { name: "Reports", path: "/admin/reports", icon: <GraphUp />, desc: "Data Analytics" },
    { name: "Ads", path: "/admin/ads", icon: <Megaphone />, desc: "Campaigns" },
  ];

  const navLinkClass = ({ isActive }) => 
    `px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
      isActive ? "text-white bg-white/5 rounded-lg" : "text-slate-400 hover:text-white"
    }`;

  const mobileTabLink = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 ${
      isActive ? "text-indigo-400 scale-110" : "text-slate-500"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase italic">
                VAJRA<span className="text-indigo-500">ADMIN</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              
              <div className="h-4 w-[1px] bg-white/10 mx-2" />

              <div className="relative" ref={consoleRef}>
                <button 
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    isConsoleOpen ? "bg-indigo-600 text-white" : "text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10"
                  }`}
                >
                  Console <ChevronDown size={10} className={`transition-transform duration-300 ${isConsoleOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isConsoleOpen && (
                  <div className="absolute top-full left-0 mt-3 w-[480px] z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center gap-3">
                        <Cpu className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Management Systems</span>
                      </div>

                      <div className="p-4 grid grid-cols-2 gap-2">
                        {adminItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsConsoleOpen(false)}
                            className={({ isActive }) => `
                              flex items-center gap-4 p-3 rounded-2xl transition-all duration-300
                              ${isActive 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                                : "hover:bg-white/5 text-slate-400 hover:text-indigo-400"}
                            `}
                          >
                            <div className="p-2 rounded-lg bg-slate-800">{item.icon}</div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase tracking-wider">{item.name}</span>
                              <span className="text-[9px] font-bold opacity-50 uppercase tracking-tighter">{item.desc}</span>
                            </div>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-full transition-all group">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617] group-hover:animate-pulse"></span>
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 bg-slate-900 border border-white/10 rounded-full hover:border-indigo-500/50 transition-all"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-black text-xs shadow-inner uppercase">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <span className="hidden lg:block text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Admin</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl py-3 z-[110] animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="px-6 py-4 border-b border-white/5 mb-2">
                    <p className="text-sm font-black text-white truncate uppercase">{admin?.name || "System Root"}</p>
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Authorized Access</p>
                  </div>
                  <Link to="/admin/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <PersonCircle size={16} /> Profile Settings
                  </Link>
                  <button onClick={handleLocalLogout} className="flex items-center gap-3 w-full px-6 py-4 text-xs text-rose-500 font-black uppercase tracking-widest hover:bg-rose-500/10 border-t border-white/5 mt-2 transition-all">
                    <BoxArrowRight size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <List size={28} />
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-[#020617] p-8 border-l border-white/10 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Vault Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px]"><House size={18} className="inline mr-3"/> Home</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px]"><InfoCircle size={18} className="inline mr-3"/> About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px]"><Envelope size={18} className="inline mr-3"/> Contact</Link>
              
              <div className="h-px bg-white/5 my-4" />
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-4 mb-2">Management</p>
              {adminItems.map(item => (
                <NavLink key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-600/10 text-slate-300 font-bold transition-all border border-transparent hover:border-indigo-500/20">
                  <span className="text-indigo-500">{item.icon}</span> {item.name}
                </NavLink>
              ))}
              <button onClick={handleLocalLogout} className="flex items-center gap-4 p-4 mt-2 rounded-2xl bg-rose-500/10 text-rose-500 font-black uppercase tracking-widest text-[10px] border border-rose-500/20">
                <BoxArrowRight size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#020617]/90 backdrop-blur-2xl border-t border-white/5 px-2 py-3 pb-8 flex items-center justify-around">
        <NavLink to="/" className={mobileTabLink}>
          <House size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </NavLink>

        <NavLink to="/about" className={mobileTabLink}>
          <InfoCircle size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">About</span>
        </NavLink>

        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center -mt-10"
        >
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/40 border-4 border-[#020617]">
            <Grid1x2Fill size={24} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest mt-1 text-indigo-400">Console</span>
        </button>

        <NavLink to="/contact" className={mobileTabLink}>
          <Envelope size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Contact</span>
        </NavLink>

        <NavLink to="/admin/profile" className={mobileTabLink}>
          <PersonCircle size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
        </NavLink>
      </div>
    </>
  );
}