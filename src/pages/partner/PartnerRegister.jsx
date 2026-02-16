import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { userAuth, userDB } from "../../firebaseUser";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeSlash, CheckCircleFill, ArrowRight } from "react-bootstrap-icons";

export default function PartnerRegister() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const plan = searchParams.get("plan") || "Starter";

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const planDetails = {
        Starter: { maxAds: 1, days: 30, price: 29 },
        Growth: { maxAds: 5, days: 30, price: 99 },
        Enterprise: { maxAds: "Unlimited", days: 30, price: 299 }
    };

    const currentPlan = planDetails[plan] || planDetails.Starter;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                userAuth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            const partnerData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                companyName: formData.companyName,
                role: "partner",
                plan: plan,
                maxAdsPerDay: currentPlan.maxAds,
                subscriptionDays: currentPlan.days,
                isActive: false,
                createdAt: serverTimestamp()
            };

            await setDoc(doc(userDB, "partners", user.uid), partnerData);

            await loginUser({
                uid: user.uid,
                email: user.email,
                role: "partner",
                source: "firebase",
                displayName: formData.companyName || formData.fullName,
                ...partnerData
            });

            navigate("/partner/payment");

        } catch (err) {
            setError(err.code === "auth/email-already-in-use" ? "Email already in use" : "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 lg:p-8 font-['Outfit']">
            {/* Main Container */}
            <div className="w-full max-w-6xl grid lg:grid-cols-12 bg-[#11141b] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                
                {/* LEFT SIDEBAR: Plan Details */}
                <div className="lg:col-span-4 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-white/70 uppercase tracking-[0.3em] text-[10px] font-black mb-2">Vajra Network</h3>
                        <h2 className="text-3xl font-bold text-white leading-tight mb-4">Scale your business globally.</h2>
                        <p className="text-blue-100 text-sm opacity-80 leading-relaxed">
                            Join thousands of partners driving high-intent traffic through our premium ad engine.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 my-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="px-3 py-1 bg-white text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">{plan}</span>
                            <div className="text-white">
                                <span className="text-2xl font-bold">${currentPlan.price}</span>
                                <span className="text-xs opacity-60">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            {[
                                `${currentPlan.maxAds} Active Ads`,
                                "Advanced Analytics",
                                "Priority 24/7 Support",
                                "API Access"
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-white text-sm">
                                    <CheckCircleFill size={14} className="text-blue-300" /> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative z-10 text-white/50 text-[10px] uppercase font-bold tracking-widest text-center italic">
                        Secured by Vajra Auth Engine
                    </div>
                </div>

                {/* RIGHT SIDE: Form */}
                <div className="lg:col-span-8 p-8 lg:p-14 bg-[#11141b]">
                    <div className="max-w-xl mx-auto">
                        <header className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create Partner Account</h2>
                            <p className="text-slate-400">Complete the profile to access your partner dashboard.</p>
                        </header>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FormInput label="Full Name" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
                                <FormInput label="Company Name" name="companyName" placeholder="Acme Corp" value={formData.companyName} onChange={handleChange} />
                                <FormInput label="Email Address" name="email" type="email" placeholder="partner@company.com" value={formData.email} onChange={handleChange} />
                                <FormInput label="Phone Number" name="phone" type="tel" placeholder="+1..." value={formData.phone} onChange={handleChange} />
                                
                                <div className="relative">
                                    <FormInput 
                                        label="Password" 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[38px] text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeSlash /> : <Eye />}
                                    </button>
                                </div>

                                <FormInput 
                                    label="Confirm Password" 
                                    name="confirmPassword" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? "Creating Instance..." : "Proceed to Payment"}
                                {!loading && <ArrowRight size={16}/>}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-slate-500 text-sm">
                                Already registered?{" "}
                                <button 
                                    onClick={() => navigate('/partner/login')}
                                    className="text-white font-bold hover:text-blue-400 transition-colors ml-1"
                                >
                                    Partner Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Input Component for Tailwind Cleanliness
function FormInput({ label, ...props }) {
    return (
        <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            <input 
                {...props}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-slate-600"
            />
        </div>
    );
}