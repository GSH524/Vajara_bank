import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { userAuth, userDB } from "../../firebaseUser";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeSlash, LockFill, EnvelopeFill } from "react-bootstrap-icons";

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(userAuth, email, password);
      const user = userCredential.user;
      const partnerDoc = await getDoc(doc(userDB, "partners", user.uid));

      if (!partnerDoc.exists()) {
        setError("No partner account found. Please use the main login.");
        await userAuth.signOut();
        setLoading(false);
        return;
      }

      const partnerData = partnerDoc.data();
      await loginUser({
        uid: user.uid,
        email: user.email,
        role: "partner",
        source: "firebase",
        displayName: partnerData.companyName || partnerData.fullName,
        ...partnerData
      });

      if (partnerData.isActive) {
        navigate("/partner/dashboard");
      } else {
        navigate("/partner/payment");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.code === "auth/invalid-credential" ? "Invalid email or password." : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-900/40 mb-4 text-3xl font-black">
            V
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Partner Portal</h2>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-bold">Secure Access</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
              <div className="relative">
                <EnvelopeFill className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 text-white transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secret Password</label>
              </div>
              <div className="relative group">
                <LockFill className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 text-white transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Decrypting..." : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
              New to the ecosystem?{" "}
              <button onClick={() => navigate("/partner-plans")} className="text-blue-400 hover:underline ml-1">Join Network</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}