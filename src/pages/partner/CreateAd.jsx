import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { userDB } from "../../firebaseUser";
import toast, { Toaster } from "react-hot-toast";
import { Image, Link45deg, Calendar, CurrencyDollar, CheckCircleFill, InfoCircle } from "react-bootstrap-icons";

export default function CreateAd() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        imageUrl: "",
        link: "",
        durationDays: "30",
        budget: "100",
        placements: {
            home: true,
            about: true,
            contact: true
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlacementToggle = (placement) => {
        setFormData(prev => ({
            ...prev,
            placements: {
                ...prev.placements,
                [placement]: !prev.placements[placement]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.title || !formData.imageUrl || !formData.link) {
            toast.error("Required fields missing");
            setLoading(false);
            return;
        }

        try {
            const placements = Object.keys(formData.placements).filter(key => formData.placements[key]).map(k => k.toUpperCase());
            
            const adData = {
                partnerId: user.uid,
                partnerName: user.displayName || user.companyName,
                title: formData.title,
                imageUrl: formData.imageUrl,
                redirectUrl: formData.link,
                durationDays: parseInt(formData.durationDays),
                budget: parseFloat(formData.budget),
                placements: placements,
                status: "PENDING",
                clicks: 0,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(userDB, "ads"), adData);

            await addDoc(collection(userDB, "notifications"), {
                type: "AD_SUBMITTED",
                adId: docRef.id,
                partnerId: user.uid,
                message: `New campaign deployment by ${user.companyName || user.displayName}`,
                targetRole: "admin",
                isRead: false,
                createdAt: serverTimestamp()
            });

            toast.success("Campaign deployed to queue!");
            setTimeout(() => navigate("/partner/dashboard"), 1500);

        } catch (err) {
            console.error(err);
            toast.error("Deployment failed");
        } finally {
            setLoading(false);
        }
    };

    const dailySpend = formData.budget && formData.durationDays
        ? (parseFloat(formData.budget) / parseInt(formData.durationDays)).toFixed(2)
        : "0.00";

    const inputStyle = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-white text-base placeholder:text-slate-500";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto">
                {/* BREADCRUMB HEADER */}
                <header className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Deploy Campaign</h1>
                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Operation: Market Reach</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-sm font-bold transition-colors">
                        ← Back to Dashboard
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* CONFIGURATION PANEL */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl">
                            
                            <div className="space-y-4">
                                <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    Core Identity
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Campaign Headline</label>
                                        <input name="title" className={inputStyle} value={formData.title} onChange={handleChange} placeholder="e.g., Premium Banking Rewards" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Asset Image URL</label>
                                        <input name="imageUrl" className={inputStyle} value={formData.imageUrl} onChange={handleChange} placeholder="https://assets.vajra.ai/banner-01.png" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    Targeting & Logic
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 text-emerald-500/80">Destination Link</label>
                                        <div className="relative">
                                            <Link45deg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input name="link" className={`${inputStyle} pl-12`} value={formData.link} onChange={handleChange} placeholder="https://..." required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Lifecycle Duration</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <select name="durationDays" className={`${inputStyle} pl-12 appearance-none`} value={formData.durationDays} onChange={handleChange}>
                                                <option value="7" className="bg-slate-900">7 Days (Sprint)</option>
                                                <option value="30" className="bg-slate-900">30 Days (Standard)</option>
                                                <option value="90" className="bg-slate-900">90 Days (Quarterly)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                    Financials & Placement
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Budget (INR)</label>
                                        <div className="relative">
                                            <CurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input type="number" name="budget" className={`${inputStyle} pl-12`} value={formData.budget} onChange={handleChange} min="100" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex items-end gap-2">
                                        {['home', 'about', 'contact'].map((p) => (
                                            <button key={p} type="button" onClick={() => handlePlacementToggle(p)}
                                                className={`flex-1 py-4 rounded-2xl border-2 text-[10px] font-black transition-all ${
                                                    formData.placements[p] 
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                                    : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                                                }`}>
                                                {p.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-10 shadow-xl shadow-blue-900/20">
                                {loading ? "INITIALIZING DEPLOYMENT..." : "DEPLOY TO COMMAND CENTER"}
                            </button>
                        </form>
                    </div>

                    {/* LIVE VISUALIZER PREVIEW */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="lg:sticky lg:top-8 space-y-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center lg:text-left">Live Visualizer</h3>
                            
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden group backdrop-blur-md">
                                <div className="p-5 flex justify-between items-center bg-white/5 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Live System Sponsored</span>
                                    </div>
                                    <InfoCircle size={14} className="text-slate-600" />
                                </div>
                                
                                <div className="aspect-video bg-slate-900 relative">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/800x450/020617/1e293b?text=Invalid+Image+URL' }} />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                                            <Image size={40} className="mb-2 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Asset Missing</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8">
                                    <h4 className="text-2xl font-black text-white leading-tight mb-6">
                                        {formData.title || "Target Headline Preview"}
                                    </h4>
                                    <div className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-950 text-xs font-black rounded-xl uppercase tracking-wider">
                                        Engage Now
                                    </div>
                                </div>
                            </div>

                            {/* COST PROJECTION */}
                            <div className="bg-gradient-to-br from-blue-600/10 to-transparent rounded-3xl p-6 border border-blue-500/20 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] text-blue-400 font-black uppercase mb-1">Projected Cost</p>
                                    <p className="text-2xl font-black text-white">₹{formData.budget}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-emerald-400 font-black uppercase mb-1">Burn Rate (Avg)</p>
                                    <p className="text-2xl font-black text-emerald-400">₹{dailySpend}/day</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}