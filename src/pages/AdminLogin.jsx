import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldLock, ArrowLeft, Envelope, Lock } from "react-bootstrap-icons";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(email, password);

    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/login")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        Back to Portal
      </button>

      <div className="w-full max-w-md">
        {/* Admin Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600/10 border border-indigo-500/30 text-indigo-500 rounded-3xl mb-4 shadow-2xl shadow-indigo-500/20">
            <ShieldLock size={40} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">System Control</h2>
          <p className="text-slate-500 mt-2 font-medium">Authorized Personnel Only</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-xl text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@system.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-11 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-11 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20 mt-2"
            >
              Verify Identity
            </button>
          </form>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-slate-600 text-sm font-medium">
          Forgot credentials? <span className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors underline underline-offset-4">Contact Root Admin</span>
        </p>
      </div>
    </div>
  );
}