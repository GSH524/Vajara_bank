import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { userAuth, userDB } from "../../firebaseUser";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeSlash } from "react-bootstrap-icons";

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
      const partnerProfile = {
        uid: user.uid,
        email: user.email,
        role: "partner",
        source: "firebase",
        displayName: partnerData.companyName || partnerData.fullName,
        ...partnerData
      };

      // FIX: Persist to localStorage so session survives page refresh
      localStorage.setItem("legacyUser", JSON.stringify(partnerProfile));

      // Update global auth state
      await loginUser(partnerProfile);

      if (partnerData.isActive) {
        navigate("/partner/dashboard");
      } else {
        navigate("/partner/payment");
      }

    } catch (err) {
      console.error("Login failed:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl mb-4 text-2xl font-bold">P</div>
          <h2 className="text-3xl font-black text-white">Partner Portal</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}