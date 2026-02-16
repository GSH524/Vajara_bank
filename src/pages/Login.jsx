import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { userAuth, userDB } from "../firebaseUser";
import { findUserByEmail } from "../utils/bankUtils"; // IMPORT HELPER

// Icons
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaPhoneAlt, FaChevronRight } from "react-icons/fa";
import { ShieldLock } from "react-bootstrap-icons";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, loginAdmin } = useAuth();

  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Signup-only states
  const [firstname, setFirstname] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState("");

  /* ================= TYPING ANIMATION ================= */
  const fullText = "Vajra Banking Portal";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [index]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 800 * 1024) {
      toast.error("Image must be under 800KB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= UNIFIED SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "login") {
      // 1. ADMIN CHECK
      const isAdmin = loginAdmin(email, password);
      if (isAdmin) {
        toast.success("Admin Access Granted");
        navigate("/admin/dashboard");
        return;
      }

      // 2. CHECK DATABANK.JSON (LEGACY DATA)
      try {
        const legacyUser = await findUserByEmail(email);
        
        if (legacyUser) {
          // Check Password: For legacy users, password is their Contact Number
          if (String(password) === String(legacyUser.mobile)) {
             await loginUser(legacyUser); // Log in to Context
             toast.success(`Welcome back, ${legacyUser.firstName}`);
             navigate("/user/dashboard");
             setSubmitting(false);
             return;
          } else {
             // If email matches but password wrong, fail immediately to prevent confusion
             toast.error("Invalid credentials (Hint: Use Mobile No as password)");
             setSubmitting(false);
             return;
          }
        }
      } catch (err) {
        console.error("Legacy check skipped:", err);
      }

      // 3. CHECK FIREBASE (NORMAL USERS)
      try {
        const userCredential = await signInWithEmailAndPassword(userAuth, email, password);
        const user = userCredential.user;

        // Check Users Collection
        const userDoc = await getDoc(doc(userDB, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.status !== "approved") {
            toast.error(`Account status: ${userData.status}`);
            setSubmitting(false);
            return;
          }
          await loginUser({ uid: user.uid, role: "user", ...userData });
          navigate("/user/dashboard");
          return;
        }

        // Check Partners Collection
        const partnerDoc = await getDoc(doc(userDB, 'partners', user.uid));
        if (partnerDoc.exists()) {
          const pData = partnerDoc.data();
          await loginUser({ uid: user.uid, role: "partner", ...pData });
          navigate("/partner/dashboard");
          return;
        }

        toast.error("Profile not found. Contact Support.");
      } catch (error) {
        toast.error("Invalid credentials or network error");
      } finally {
        setSubmitting(false);
      }
    } else {
      // HANDLE SIGNUP LOGIC
      handleSignup();
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(userAuth, email, password);
      const user = userCredential.user;
      const userProfile = {
        firstName: firstname, email, mobile, status: "pending", createdAt: serverTimestamp(), imageUrl: image
      };
      await setDoc(doc(userDB, 'users', user.uid), userProfile);
      toast.success("Request sent for approval!");
      setMode("login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <Toaster position="top-center" />
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-6">
              <ShieldLock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight h-8">
              {typedText}<span className="animate-pulse">|</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Signup Extra Fields */}
            {mode === "signup" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-center mb-4">
                    <label className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500">
                        {image ? <img src={image} className="w-full h-full object-cover" /> : <FaUserCircle className="text-slate-600 group-hover:text-indigo-400" size={30} />}
                      </div>
                      <input type="file" hidden onChange={handleImageChange} />
                    </label>
                </div>
                <div className="relative">
                  <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" placeholder="Full Name" required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={firstname} onChange={(e)=>setFirstname(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <FaPhoneAlt size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="tel" placeholder="Mobile Number" required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={mobile} onChange={(e)=>setMobile(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="email" placeholder="Email Address" required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                value={email} onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                value={password} onChange={(e)=>setPassword(e.target.value)}
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {mode === "login" && (
              <div className="text-right">
                <button type="button" onClick={() => toast.error("Reset link sent to email!")} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              disabled={submitting}
              className="group relative w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {submitting ? "Processing..." : (mode === "login" ? "Authorize Access" : "Create Account")}
              {!submitting && <FaChevronRight className="group-hover:translate-x-1 transition-transform" size={12} />}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-slate-500 text-sm">
              {mode === "login" ? "New to our platform?" : "Already have an account?"}
              <button 
                onClick={() => mode === "login" ? navigate("/signup") : navigate("/login")}
                className="ml-2 text-white font-bold hover:underline decoration-indigo-500 underline-offset-4"
              >
                {mode === "login" ? "Create Login" : "Login Now"}
              </button>
            </p>
            
            <div className="pt-4 border-t border-slate-800/50">
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
                 Secured by Industry-Standard Encryption
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}