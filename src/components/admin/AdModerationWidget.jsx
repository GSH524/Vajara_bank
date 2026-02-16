import React, { useState, useEffect } from 'react';
import { adService } from '../../services/adService';
import { 
  CheckCircle, 
  XCircle, 
  Megaphone, 
  ArrowRight, 
  CurrencyDollar, 
  Shop,
  Activity
} from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

export default function AdModerationWidget() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const fetchPendingAds = async () => {
        try {
            const pendingAds = await adService.getPendingAds();
            setAds(pendingAds.slice(0, 3));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching ads widget:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingAds();
        const interval = setInterval(fetchPendingAds, 30000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleApprove = async (ad) => {
        try {
            await adService.approveAd(ad.id, ad.duration || 30, ad.partnerId, ad.title);
            showToast(`Approved "${ad.title}"!`);
            fetchPendingAds();
        } catch (error) {
            showToast("Approval failed", "error");
        }
    };

    const confirmReject = async (ad) => {
        if (!rejectReason.trim()) return;
        try {
            await adService.rejectAd(ad.id, rejectReason, ad.partnerId, ad.title);
            showToast(`Rejected "${ad.title}"`, "success");
            setRejectingId(null);
            fetchPendingAds();
        } catch (error) {
            showToast("Rejection failed", "error");
        }
    };

    if (loading) return (
        <div className="bg-slate-900/40 animate-pulse border border-white/5 rounded-2xl h-[380px] flex items-center justify-center text-slate-500 text-sm font-medium">
            Synchronizing Queue...
        </div>
    );

    return (
        <div className="relative group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/30">
            
            {/* TOAST SYSTEM - Global overlay style */}
            {toast.show && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-bold shadow-2xl transition-all ${
                    toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {toast.message}
                </div>
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                        <Megaphone size={18} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Ad Moderation</h3>
                        <p className="text-xs text-slate-400 font-medium">Pending Review</p>
                    </div>
                </div>
                <NavLink 
                    to="/admin/ads" 
                    className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10"
                >
                    FULL QUEUE <span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded text-[9px]">{ads.length}</span>
                </NavLink>
            </div>

            {/* CONTENT LIST */}
            <div className="space-y-3">
                {ads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3 border border-emerald-500/20">
                            <CheckCircle size={24} />
                        </div>
                        <p className="text-sm font-semibold text-slate-200">System Clear</p>
                        <p className="text-xs text-slate-500 mt-1">No advertisements require attention.</p>
                    </div>
                ) : (
                    ads.map(ad => (
                        <div key={ad.id} className="relative bg-slate-950/40 border border-white/5 rounded-xl p-4 transition-all hover:bg-slate-950/60 overflow-hidden">
                            
                            {rejectingId === ad.id ? (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Specify Rejection Reason</p>
                                    <input
                                        autoFocus
                                        placeholder="Policy violation, low quality..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => confirmReject(ad)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-2 rounded-lg transition-colors uppercase">Reject Ad</button>
                                        <button onClick={() => setRejectingId(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-2 rounded-lg transition-colors uppercase">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1 pr-4">
                                        <div className="text-sm font-bold text-white leading-none">{ad.title}</div>
                                        <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                            <span className="flex items-center gap-1"><Shop size={10} className="text-indigo-400"/> {ad.businessName}</span>
                                            <span className="flex items-center gap-1"><CurrencyDollar size={10} className="text-emerald-500"/> {ad.budget}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleApprove(ad)} 
                                            className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-emerald-500/10"
                                            title="Quick Approve"
                                        >
                                            <CheckCircle size={14} />
                                        </button>
                                        <button 
                                            onClick={() => setRejectingId(ad.id)} 
                                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-red-500/10"
                                            title="Quick Reject"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER TREND */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-2 text-slate-500">
                    <Activity size={12} className="text-indigo-500" />
                    SYSTEM LATENCY: <span className="text-emerald-500">42MS</span>
                </div>
                <div className="text-slate-600 uppercase tracking-widest italic">Live Feed</div>
            </div>
        </div>
    );
}