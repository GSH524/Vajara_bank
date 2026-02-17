import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  List,
  X,
  BoxArrowRight,
  Grid,
  ShieldCheck,
  House,
  Envelope,
  InfoCircle,
  Gem,
  PersonCircle,
  Gear
} from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./common/NotificationBell";

export default function Navbar() {
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Unified Active Account Check
  const activeAccount = admin || user;

  // Handle outside click to close profile dropdown
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
    setIsMenuOpen(false);

    // Clear the specific session based on who is logged in
    if (admin) {
      logoutAdmin();
    } else {
      await logoutUser();
    }

    navigate("/");
  };

  const getDashboardLink = () => {
    if (!activeAccount) return "/login";
    if (activeAccount.role === 'admin') return "/admin/dashboard";
    if (activeAccount.role === 'partner') return "/partner/dashboard";
    return "/user/dashboard";
  };

  const getInitials = (account) => {
    const name = account.displayName || account.name || account.email || "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // NavLink Styles
  const desktopNavLink = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
      ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
    }`;

  const mobileTabLink = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 ${isActive ? "text-indigo-400 scale-110 font-black" : "text-slate-500 hover:text-slate-300"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 lg:px-12 py-4 bg-slate-950 border-b border-white/5 backdrop-blur-xl">

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

        {/* DESKTOP NAVIGATION */}
        <ul className="hidden lg:flex items-center gap-2">
          <li><NavLink to="/" className={desktopNavLink}><House size={16} /> Home</NavLink></li>
          <li><NavLink to="/about" className={desktopNavLink}><InfoCircle size={16} /> About</NavLink></li>
          <li><NavLink to="/contact" className={desktopNavLink}><Envelope size={16} /> Contact</NavLink></li>
          <li><NavLink to="/partner-plans" className={desktopNavLink}><Gem size={16} /> Plans</NavLink></li>
        </ul>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {activeAccount ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell (Admins only) */}
              {activeAccount.role === 'admin' && <NotificationBell user={activeAccount} />}

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-10 h-10 overflow-hidden flex items-center justify-center rounded-xl bg-slate-900 border font-bold text-xs transition-all ${isProfileOpen ? "border-indigo-500 text-white" : "border-white/10 text-indigo-400 hover:border-indigo-500/50"
                    }`}
                >
                  {/* Display user image if available, else Initials */}
                  {activeAccount.imageUrl ? (
                    <img src={activeAccount.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(activeAccount)
                  )}
                </button>

                {/* PROFILE DROPDOWN */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-[110] animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-sm font-bold text-white truncate">
                        {activeAccount.displayName || activeAccount.name || activeAccount.email}
                      </p>
                      <p className="text-[10px] text-indigo-500 font-black tracking-[0.2em] uppercase">
                        {activeAccount.role} Account
                      </p>
                    </div>

                    <Link to={getDashboardLink()} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5">
                      <Grid size={16} className="text-indigo-500" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-500 font-bold hover:bg-rose-500/10 border-t border-white/5 mt-1"
                    >
                      <BoxArrowRight size={18} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <PersonCircle size={18} />
              <span className="text-sm font-bold">Secure Login</span>
            </Link>
          )}

          <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsMenuOpen(true)}>
            <List size={28} />
          </button>
        </div>
      </nav>

      {/* MOBILE SIDE DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#020617] border-l border-white/10 p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 underline underline-offset-8 decoration-indigo-500">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-2">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={desktopNavLink}><House size={18} /> Home</NavLink>
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={desktopNavLink}><InfoCircle size={18} /> About Us</NavLink>
              <NavLink to="/contact" onClick={() => setIsMenuOpen(false)} className={desktopNavLink}><Envelope size={18} /> Contact</NavLink>
              <NavLink to="/partner-plans" onClick={() => setIsMenuOpen(false)} className={desktopNavLink}><Gem size={18} /> Partner Plans</NavLink>

              {activeAccount && (
                <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="mt-4 flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                  <Grid size={18} /> Open Console
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#020617]/90 backdrop-blur-2xl border-t border-white/5 px-2 py-3 pb-8 flex items-center justify-around">
        <NavLink to="/" className={mobileTabLink}>
          <House size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </NavLink>

        <NavLink to="/about" className={mobileTabLink}>
          <InfoCircle size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">About</span>
        </NavLink>

        {activeAccount && (
          <NavLink to={getDashboardLink()} className={mobileTabLink}>
            <div className="p-3 bg-indigo-600 rounded-2xl text-white -mt-10 shadow-xl shadow-indigo-600/40 border-[6px] border-[#020617]">
              <Grid size={20} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">Console</span>
          </NavLink>
        )}

        <NavLink to="/contact" className={mobileTabLink}>
          <Envelope size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Contact</span>
        </NavLink>

        <NavLink to="/partner-plans" className={mobileTabLink}>
          <Gem size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Plans</span>
        </NavLink>
      </div>
    </>
  );
}