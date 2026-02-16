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
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
        }

        const placements = [];
        if (formData.placements.home) placements.push("HOME");
        if (formData.placements.about) placements.push("ABOUT");
        if (formData.placements.contact) placements.push("CONTACT");

        if (placements.length === 0) {
            toast.error("Please select at least one placement");
            setLoading(false);
            return;
        }

        try {
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
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(userDB, "ads"), adData);

            await addDoc(collection(userDB, "notifications"), {
                type: "AD_SUBMITTED",
                adId: docRef.id,
                partnerId: user.uid,
                message: `New ad submitted by ${user.companyName || user.displayName}`,
                targetRole: "admin",
                isRead: false,
                createdAt: serverTimestamp()
            });

            toast.success("Ad submitted for approval!");
            setTimeout(() => navigate("/partner/dashboard"), 1500);

        } catch (err) {
            console.error("Error creating ad:", err);
            toast.error("Failed to create ad.");
        } finally {
            setLoading(false);
        }
    };

    const dailySpend = formData.budget && formData.durationDays
        ? (parseFloat(formData.budget) / parseInt(formData.durationDays)).toFixed(2)
        : "0.00";

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Campaign</h1>
                    <p className="text-slate-500 mt-1">Launch a new ad across the ecosystem. Approval takes ~24h.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT SIDE - FORM */}
                    <div className="lg:col-span-7 space-y-6">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                            
                            {/* Campaign Headline */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Campaign Headline</label>
                                <div className="relative group">
                                    <input
                                        name="title"
                                        className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Zero Fee International Transfers"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Creative Image URL */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Creative Image URL</label>
                                <input
                                    name="imageUrl"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/banner.jpg"
                                    required
                                />
                                <p className="text-[11px] text-slate-400 italic px-1 flex items-center gap-1">
                                    <InfoCircle size={12} /> Recommended size: 1920x600px (High Resolution JPG/PNG)
                                </p>
                            </div>

                            {/* Destination URL */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 text-blue-600">Destination URL</label>
                                <div className="relative">
                                    <Link45deg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        name="link"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900"
                                        value={formData.link}
                                        onChange={handleChange}
                                        placeholder="https://yourbusiness.com/offer"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Duration & Budget */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Duration</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        <select
                                            name="durationDays"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900"
                                            value={formData.durationDays}
                                            onChange={handleChange}
                                        >
                                            <option value="7">7 Days</option>
                                            <option value="14">14 Days</option>
                                            <option value="30">30 Days</option>
                                            <option value="60">60 Days</option>
                                            <option value="90">90 Days</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Total Budget (USD)</label>
                                    <div className="relative">
                                        <CurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="number"
                                            name="budget"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            min="10"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Ad Placements */}
                            <div className="space-y-3 pt-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Target Placements</label>
                                <div className="flex flex-wrap gap-3">
                                    {['home', 'about', 'contact'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => handlePlacementToggle(p)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-all ${
                                                formData.placements[p] 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                        >
                                            {formData.placements[p] && <CheckCircleFill size={14} />}
                                            {p.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 flex items-center justify-center gap-3 mt-4"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        PROCESSING...
                                    </>
                                ) : "SUBMIT FOR APPROVAL"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE - PREVIEW */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="sticky top-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Live Ad Preview</h3>
                            
                            {/* The Ad Display Card */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 group">
                                <div className="p-4 flex justify-between items-center border-b border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
                                        <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Sponsored Content</span>
                                    </div>
                                    <InfoCircle size={14} className="text-slate-300" />
                                </div>
                                
                                <div className="aspect-[16/6] bg-slate-100 relative overflow-hidden">
                                    {formData.imageUrl ? (
                                        <img
                                            src={formData.imageUrl}
                                            alt="Ad Preview"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => { e.target.src = 'https://placehold.co/1920x600/f1f5f9/64748b?text=Invalid+Image+URL' }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                            <Image size={40} className="mb-2 opacity-20" />
                                            <p className="text-xs font-medium opacity-50 uppercase tracking-widest">Image Preview</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-slate-900 leading-tight mb-2">
                                        {formData.title || "Your Campaign Headline Here"}
                                    </h4>
                                    <div className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg pointer-events-none">
                                        LEARN MORE
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Summary Card */}
                            <div className="mt-6 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <InfoCircle size={18} />
                                    <span className="font-bold text-sm">Campaign Summary</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-xl border border-blue-100">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Total Spend</p>
                                        <p className="text-lg font-black text-slate-900">${formData.budget}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-blue-100">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Daily Average</p>
                                        <p className="text-lg font-black text-blue-600">${dailySpend}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs text-slate-500 font-medium italic underline decoration-blue-200 underline-offset-4">
                                        Duration: {formData.durationDays} Days
                                    </span>
                                    <span className="text-[10px] bg-white px-2 py-1 rounded-md text-slate-400 font-bold border border-slate-100">
                                        {formData.placements.home && 'HOME'} {formData.placements.about && '• ABOUT'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}