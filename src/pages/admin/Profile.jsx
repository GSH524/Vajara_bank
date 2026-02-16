import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAdminActions } from "../../hooks/useAdminActions";
import { 
  Person, 
  Envelope, 
  Phone, 
  GeoAlt, 
  ShieldLock, 
  ClockHistory, 
  Building,
  CheckCircleFill,
  PencilSquare 
} from 'react-bootstrap-icons';

export default function AdminProfile() {
  const { admin } = useAuth();
  const { auditLogs } = useAdminActions();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (admin) {
      const savedProfile = localStorage.getItem(`adminProfile_${admin.email}`);
      const savedData = savedProfile ? JSON.parse(savedProfile) : {};

      setFormData({
        firstName: admin.name?.split(' ')[0] || 'Admin',
        lastName: admin.name?.split(' ')[1] || '',
        email: admin.email,
        role: admin.role,
        phone: savedData.phone || "+91 98765 43210",
        address: savedData.address || "Hyderabad, India",
        branch: "Headquarters (HYD-01)"
      });
    }
  }, [admin]);

  const handleSave = () => {
    localStorage.setItem(`adminProfile_${admin.email}`, JSON.stringify({
      phone: formData.phone,
      address: formData.address
    }));
    setIsEditing(false);
    showToast("Profile Updated Successfully");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const recentActions = auditLogs?.slice(0, 5) || [];

  if (!admin) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
      <div className="text-blue-500 font-mono animate-pulse uppercase tracking-widest">Accessing Secure Profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-[1200px] mx-auto pb-20 relative">
        
        {/* TOAST NOTIFICATION - Explicit high Z-index */}
        {toast && (
          <div className="fixed top-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[9999] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircleFill size={20} />
            <span className="font-bold uppercase tracking-wider text-xs">{toast}</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-10 w-1.5 bg-blue-600 rounded-full"></div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Identity <span className="text-slate-500">Vault</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Admin Command Center / Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: MAIN PROFILE DATA */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0f1218] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              
              {/* Profile Top Banner */}
              <div className="p-8 md:p-12 bg-white/[0.02] border-b border-white/5">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/20 uppercase transition-transform group-hover:scale-105 duration-300">
                      {formData.firstName?.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-black text-white leading-none">{formData.firstName} {formData.lastName}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                      <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Access Level: {formData.role}
                      </span>
                      <span className="flex items-center gap-2 px-4 py-1.5 bg-white/5 text-slate-400 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <Building size={12} className="text-blue-500" /> {formData.branch}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-0">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 transition-all">Save Profile</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all">
                        <PencilSquare size={14} /> Edit Identity
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Data */}
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">System Email</label>
                  <div className="flex items-center gap-4 p-5 bg-black/40 border border-white/5 rounded-2xl text-slate-200">
                    <Envelope className="text-blue-500" size={18} />
                    <span className="font-mono text-sm tracking-tight">{formData.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Link</label>
                  {isEditing ? (
                    <input 
                      className="w-full p-5 bg-white/5 border border-blue-500/40 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    />
                  ) : (
                    <div className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-200">
                      <Phone className="text-blue-500" size={18} />
                      <span className="font-mono text-sm">{formData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Assigned Station Address</label>
                  {isEditing ? (
                    <input 
                      className="w-full p-5 bg-white/5 border border-blue-500/40 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                      value={formData.address} 
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    />
                  ) : (
                    <div className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-200">
                      <GeoAlt className="text-blue-500" size={18} />
                      <span className="text-sm font-medium">{formData.address}</span>
                    </div>
                  )}
                </div>

                {/* Security Status Panel */}
                <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl mt-4">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-500 shadow-inner">
                      <ShieldLock size={28} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white text-xs uppercase tracking-widest mb-1">Security Status: Active</p>
                      <p className="text-[11px] text-emerald-500/80 font-medium">Your account is fortified with Multi-Factor Authentication (MFA).</p>
                    </div>
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ACTIVITY LOGS */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f1218] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                  <ClockHistory className="text-blue-500" /> Operational Logs
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                {recentActions.length > 0 ? recentActions.map((log, idx) => (
                  <div key={idx} className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/40 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{log.action}</span>
                      <span className="text-[9px] font-mono text-slate-600 bg-black/20 px-2 py-0.5 rounded">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{log.details}</p>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                     <ClockHistory size={48} className="mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Buffer Empty</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-inner">
                Request Full Archive
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}