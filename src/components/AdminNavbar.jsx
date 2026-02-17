import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
  Megaphone
} from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const { user, logoutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logoutUser();
    navigate("/");
  };

  // Admin specific nested items
  const adminItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Grid1x2Fill /> },
    { name: "Customers", path: "/admin/customers", icon: <People /> },
    { name: "Accounts", path: "/admin/accounts", icon: <LayoutTextSidebarReverse /> },
    { name: "Cards", path: "/admin/cards", icon: <CreditCard /> },
    { name: "Loans", path: "/admin/loans", icon: <CashStack /> },
    { name: "Reports", path: "/admin/reports", icon: <GraphUp /> },
    { name: "Ads", path: "/admin/ads", icon: <Megaphone /> },
  ];

  return (
    <>
      {/* MAIN TOP NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* LOGO & PUBLIC LINKS */}
          <div className="flex items-center gap-8">
             {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 group relative">
          {/* The Logo Image Container with a Glow Effect */}
          <div className="relative">
            {/* Background Blur Glow (Hidden on mobile, subtle on desktop) */}
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/40 transition-all duration-500" />

            <div className="relative p-1 bg-linear-to-tr rounded-2xl from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src="/logo.png"
                alt="SRK Bank"
                className="h-9 w-auto object-contain  rounded-4xl brightness-110 group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              {/* Animated Shine Effect on Hover */}
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out] transition-transform" />
            </div>
          </div>

          {/* Text Branding */}
          <div className="flex flex-col justify-center -space-y-1">
            <div className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-1">
              <span className="bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">VAJRA</span>
              <span className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">Bank</span>
            </div>
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-indigo-400 transition-colors">
              Digital Excellence
            </div>
          </div>
        </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-all">Home</Link>
              <Link to="/about" className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-all">About</Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-all">Contact</Link>
              
              <div className="h-4 w-[1px] bg-white/10 mx-2" />

              {/* NESTED ADMIN DROPDOWN */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
                  Management <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 mt-1">
                    {adminItems.map((item) => (
                      <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                      >
                        {item.icon} {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: PROFILE */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 hover:bg-white/5 rounded-full transition-all"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
                   {user?.name?.charAt(0) || "A"}
                </div>
                <ChevronDown size={12} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* PROFILE DROPDOWN MENU */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-[110] animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="px-4 py-3 border-b border-white/5 mb-1">
                    <p className="text-sm font-bold text-white truncate">{user?.name || "Administrator"}</p>
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Admin Access</p>
                  </div>
                  <Link to="/admin/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5">
                    <PersonCircle size={16} /> Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-500 font-bold hover:bg-rose-500/10 mt-1">
                    <BoxArrowRight size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE BURGER */}
            <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <List size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#020617] p-6 border-l border-white/10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-indigo-500 font-bold uppercase mb-2">General</p>
              <Link to="/" className="flex items-center gap-3 p-3 text-slate-400 font-bold"><House size={18} /> Home</Link>
              <Link to="/about" className="flex items-center gap-3 p-3 text-slate-400 font-bold"><InfoCircle size={18} /> About</Link>
              
              <p className="text-[10px] text-indigo-500 font-bold uppercase mt-4 mb-2">Management</p>
              {adminItems.map(item => (
                <NavLink key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-slate-400 font-bold">
                  {item.icon} {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#020617]/90 backdrop-blur-2xl border-t border-white/5 px-2 py-3 pb-8 flex items-center justify-around">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 flex-1 ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
          <House size={20} />
          <span className="text-[9px] font-black uppercase">Home</span>
        </NavLink>
        <NavLink to="/admin/dashboard" className={({isActive}) => `flex flex-col items-center gap-1 flex-1 ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
          <Grid1x2Fill size={20} />
          <span className="text-[9px] font-black uppercase">Admin</span>
        </NavLink>
        <NavLink to="/admin/customers" className={({isActive}) => `flex flex-col items-center gap-1 flex-1 ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
          <People size={20} />
          <span className="text-[9px] font-black uppercase">Users</span>
        </NavLink>
        <NavLink to="/contact" className={({isActive}) => `flex flex-col items-center gap-1 flex-1 ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
          <Envelope size={20} />
          <span className="text-[9px] font-black uppercase">Contact</span>
        </NavLink>
      </div>
    </>
  );
}