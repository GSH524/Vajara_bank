import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { userAuth, userDB } from "../firebaseUser";
import { findUserByEmail } from "../utils/bankUtils";

// Icons
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaChevronRight } from "react-icons/fa";
import { ShieldLock } from "react-bootstrap-icons";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, loginAdmin } = useAuth();

  const [mode, setMode] = useState("login");
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

  /* ================= FORGOT PASSWORD LOGIC ================= */
  const handleForgotPassword = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address first.");
      return;
    }
    const id = toast.loading("Sending reset link...");
    try {
      await sendPasswordResetEmail(userAuth, email);
      toast.success("Password reset link sent to your email!", { id });
    } catch (error) {
      toast.error("Failed to send reset email. " + error.message, { id });
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "login") {
      // 1. Admin Auth Check
      if (loginAdmin(email, password)) {
        toast.success("Admin Access Granted");
        navigate("/admin/dashboard");
        return;
      }

      // 2. Legacy Data Check (BankData.json)
      try {
        const legacyUser = await findUserByEmail(email);
        if (legacyUser && String(password) === String(legacyUser.mobile)) {
          const profile = { 
            uid: legacyUser["Customer ID"], 
            role: "user", 
            source: "legacy", 
            ...legacyUser 
          };
          localStorage.setItem("legacyUser", JSON.stringify(profile));
          await loginUser(profile); 
          toast.success(`Welcome, ${legacyUser.firstName}`);
          navigate("/user/dashboard");
          return;
        }
      } catch (err) { console.error("Legacy sync error", err); }

      // 3. Firebase Auth
      try {
        const userCredential = await signInWithEmailAndPassword(userAuth, email, password);
        const fbUser = userCredential.user;

        const [userDoc, partnerDoc] = await Promise.all([
          getDoc(doc(userDB, 'users', fbUser.uid)),
          getDoc(doc(userDB, 'partners', fbUser.uid))
        ]);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.status !== "approved") {
            toast.error(`Account status: ${userData.status}`);
            setSubmitting(false);
            return;
          }
          const profile = { uid: fbUser.uid, email: fbUser.email, role: "user", ...userData };
          localStorage.setItem("legacyUser", JSON.stringify(profile));
          await loginUser(profile);
          navigate("/user/dashboard");
          return;
        }

        if (partnerDoc.exists()) {
          const pData = partnerDoc.data();
          const partnerProfile = { uid: fbUser.uid, email: fbUser.email, role: "partner", ...pData };
          localStorage.setItem("legacyUser", JSON.stringify(partnerProfile));
          await loginUser(partnerProfile);
          navigate("/partner/dashboard");
          return;
        }

        toast.error("Account data not found.");
      } catch (error) {
        toast.error("Invalid credentials.");
      } finally {
        setSubmitting(false);
      }
    } else {
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
      toast.success("Application submitted for approval!");
      setMode("login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl mb-6">
              <ShieldLock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white h-8 uppercase tracking-tighter">
              {typedText}<span className="animate-pulse">|</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-center">
                  <label className="relative cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                      {image ? <img src={image} className="w-full h-full object-cover" /> : <FaUserCircle className="text-slate-600" size={30} />}
                    </div>
                    <input type="file" hidden onChange={handleImageChange} />
                  </label>
                </div>
                <input type="text" placeholder="Full Name" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-indigo-500" value={firstname} onChange={(e)=>setFirstname(e.target.value)} required />
                <input type="tel" placeholder="Mobile Number" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-indigo-500" value={mobile} onChange={(e)=>setMobile(e.target.value)} required />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type="email" placeholder="Email Address" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            
            <div className="relative">
              <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {mode === "login" && (
              <div className="flex justify-end px-2">
                <button type="button" onClick={handleForgotPassword} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                  Secure Recovery: Forgot Password?
                </button>
              </div>
            )}

            <button disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? "Processing Request..." : (mode === "login" ? "Authorize Access" : "Create Account")}
              {!submitting && <FaChevronRight size={12} />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {mode === "login" ? "Unauthorized?" : "Existing User?"}
              <button 
                onClick={() => navigate(mode === "login" ? "/signup" : "/login")} 
                className="ml-2 text-white font-black hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-indigo-500"
              >
                {mode === "login" ? "Apply for Account" : "Return to Login"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}