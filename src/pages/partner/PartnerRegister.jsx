import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { userAuth, userDB } from "../../firebaseUser";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeSlash, CheckCircleFill, ArrowRight, BuildingFill, PersonFill } from "react-bootstrap-icons";

export default function PartnerRegister() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const plan = searchParams.get("plan") || "Starter";

    const [formData, setFormData] = useState({
        fullName: "", email: "", phone: "", companyName: "", password: "", confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const planDetails = {
        Starter: { maxAds: 1, price: 29 },
        Growth: { maxAds: 5, price: 99 },
        Enterprise: { maxAds: "Unlimited", price: 299 }
    };

    const currentPlan = planDetails[plan] || planDetails.Starter;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(userAuth, formData.email, formData.password);
            const user = userCredential.user;
            const partnerData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                companyName: formData.companyName,
                role: "partner",
                plan,
                maxAdsPerDay: currentPlan.maxAds,
                isActive: false,
                createdAt: serverTimestamp()
            };

            await setDoc(doc(userDB, "partners", user.uid), partnerData);
            await loginUser({ uid: user.uid, role: "partner", ...partnerData });
            navigate("/partner/payment");
        } catch (err) {
            setError(err.code === "auth/email-already-in-use" ? "Email already registered" : "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-6xl grid lg:grid-cols-12 bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                
                {/* LEFT SIDE: SUMMARY (Hidden on small mobile) */}
                <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 to-indigo-900 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-white/50 uppercase tracking-[0.3em] text-[10px] font-black mb-4">Vajra Instance</h3>
                        <h2 className="text-3xl font-black text-white leading-tight mb-4">Ready to scale?</h2>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 mt-8">
                            <div className="flex justify-between items-center mb-6">
                                <span className="px-3 py-1 bg-white text-blue-900 text-[10px] font-black uppercase rounded-full">{plan}</span>
                                <span className="text-white font-bold text-xl">${currentPlan.price}<small className="text-xs opacity-60">/mo</small></span>
                            </div>
                            <ul className="space-y-3">
                                {[`${currentPlan.maxAds} Active Ads`, "Full Analytics", "24/7 Support"].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/90 text-xs font-medium">
                                        <CheckCircleFill className="text-blue-300" size={14} /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 text-white/30 text-[9px] uppercase font-black tracking-widest text-center italic">
                        Node Encryption Active
                    </div>
                </div>

                {/* RIGHT SIDE: FORM */}
                <div className="lg:col-span-8 p-6 sm:p-10 lg:p-16">
                    <header className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Partner Onboarding</h2>
                        <p className="text-slate-500 text-sm">Create your corporate profile to continue.</p>
                    </header>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput label="Full Name" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} icon={<PersonFill/>} />
                            <FormInput label="Company" name="companyName" placeholder="Acme Inc" value={formData.companyName} onChange={handleChange} icon={<BuildingFill/>} />
                            <FormInput label="Email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} />
                            <FormInput label="Phone" name="phone" type="tel" placeholder="+91..." value={formData.phone} onChange={handleChange} />
                            
                            <div className="relative">
                                <FormInput label="Password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-slate-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </button>
                            </div>

                            <FormInput label="Confirm" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
                            {loading ? "Initializing..." : "Proceed to Payment"}
                            <ArrowRight size={16}/>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                         <button onClick={() => navigate('/partner/login')} className="text-slate-500 text-xs font-bold uppercase hover:text-white transition-colors">Already registered? Partner Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, icon, ...props }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            <input {...props} required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-slate-700" />
        </div>
    );
}