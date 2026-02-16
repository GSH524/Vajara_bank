import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileMenu() {
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const profile = admin || user;
  if (!profile) return null;

  const handleLogout = () => {
    admin ? logoutAdmin() : logoutUser();
    navigate("/login");
  };

  return (
    <div className="relative inline-block">
      {/* Avatar / Trigger */}
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/10 bg-slate-800 overflow-hidden hover:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        {profile.image ? (
          <img src={profile.image} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-sm">
            {profile.email[0].toUpperCase()}
          </span>
        )}
      </button>

      {/* Dropdown Overlay (to close when clicking outside) */}
      {open && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setOpen(false)} 
          />
          
          <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-4 bg-white/[0.02]">
              <p className="text-sm font-bold text-white truncate">
                {profile.firstname || "Administrator"}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5 mb-3">
                {profile.email}
              </p>

              <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                admin 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {admin ? "Admin Account" : "Standard User"}
              </span>
            </div>

            <div className="p-2 border-t border-white/5">
              <button
                onClick={() => navigate(admin ? "/admin/settings" : "/user/settings")}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                Settings
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}