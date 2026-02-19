import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  ClockHistory,
  ShieldCheck,
  Megaphone
} from 'react-bootstrap-icons';
import { adService } from '../../services/adService';

export default function AdminAds() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [pendingAds, setPendingAds] = useState([]);
  const [stats, setStats] = useState({ pending: 0, active: 0, rejected: 0, total: 0 });

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const [pending, statsData] = await Promise.all([
        adService.getPendingAds(),
        adService.getAdStats()
      ]);
      setPendingAds(pending || []);
      const counts = statsData?.statusCounts?.reduce((acc, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {}) || {};
      
      const pendingCount = counts.PENDING || counts.pending || 0;
      const activeCount = counts.APPROVED || counts.approved || 0;
      const rejectedCount = counts.REJECTED || counts.rejected || 0;

      setStats({
        pending: pendingCount,
        active: activeCount,
        rejected: rejectedCount,
        total: pendingCount + activeCount + rejectedCount
      });
    } catch (err) {
      console.error('❌ Failed to fetch ads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const openAdId = location.state?.openAdId;

  useEffect(() => {
    if (!openAdId || loading) return;
    const timeout = setTimeout(() => {
      const el = document.getElementById(`ad-${openAdId}`);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-blue-500', 'shadow-[0_0_30px_rgba(59,130,246,0.5)]');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-blue-500', 'shadow-[0_0_30px_rgba(59,130,246,0.5)]');
      }, 4000);
    }, 400);
    return () => clearTimeout(timeout);
  }, [openAdId, loading]);

  const handleApprove = async (ad) => {
    const adId = ad._id || ad.id;
    try {
      await adService.approveAd(adId, ad.durationDays);
      await fetchAds();
      window.dispatchEvent(new Event('notifications-updated'));
    } catch { alert('Failed to approve ad'); }
  };

  const handleReject = async (ad) => {
    const adId = ad._id || ad.id;
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
      await adService.rejectAd({ adId, reason: reason || 'No reason provided', partnerId: ad.partnerId, title: ad.title });
      await fetchAds();
      window.dispatchEvent(new Event('notifications-updated'));
    } catch { alert('Failed to reject ad'); }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-transparent font-['Outfit'] text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ad <span className="text-blue-500 underline decoration-blue-500/20">Command</span> Center
          </h1>
          <p className="text-slate-400 mt-2 text-base md:text-lg">Review and manage partner campaigns</p>
        </div>

        <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 px-5 md:px-6 py-3 rounded-2xl backdrop-blur-md w-full sm:w-auto">
          <ClockHistory size={24} className="text-amber-500 animate-pulse shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-widest font-black text-amber-500/60">Pending Review</div>
            <div className="text-xl md:text-2xl font-bold text-amber-500 leading-none">{stats.pending}</div>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 animate-pulse uppercase tracking-widest text-[10px] font-bold">Synchronizing Ads...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && pendingAds.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 border border-white/5 rounded-3xl md:rounded-[2.5rem] text-center py-16 md:py-20 backdrop-blur-sm mx-auto"
        >
          <div className="inline-flex p-5 md:p-6 rounded-full bg-emerald-500/10 mb-6">
            <CheckCircle className="text-emerald-500 w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white px-4">No Pending Ads</h3>
          <p className="text-slate-500 mt-2 text-sm md:text-base px-6">You've cleared the queue! All partner campaigns are up to date.</p>
        </motion.div>
      )}

      {/* ADS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence>
          {pendingAds.map((ad) => {
            const adId = ad._id || ad.id;
            return (
              <motion.div
                key={adId} id={`ad-${adId}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-slate-900/60 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-2xl"
              >
                {/* IMAGE SECTION */}
                <div className="relative h-48 sm:h-56 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={ad.imageUrl} alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image'; }}
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase text-blue-400 tracking-widest">
                    {ad.durationDays} Days
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="p-5 md:p-6">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-1 truncate">{ad.title}</h4>
                  <p className="text-xs md:text-sm text-slate-500 mb-6 flex items-center gap-2">
                    <Megaphone size={14} className="text-blue-500 shrink-0" />
                    <span className="truncate">{ad.businessName}</span>
                  </p>

                  <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl mb-6 md:mb-8 border border-white/5">
                    <div>
                      <span className="text-[9px] block uppercase tracking-widest text-slate-500 font-bold mb-0.5 md:mb-1">Payment Status</span>
                      <span className={ad.paymentStatus === 'PAID' ? 'text-emerald-400 font-bold text-xs md:text-sm' : 'text-rose-400 font-bold text-xs md:text-sm'}>
                        {ad.paymentStatus || 'UNPAID'}
                      </span>
                    </div>
                    {ad.paymentStatus === 'PAID' && <ShieldCheck className="text-emerald-500 shrink-0" size={24} />}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-row gap-3">
                    <button
                      onClick={() => handleApprove(ad)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all active:scale-95 shadow-lg"
                    >
                      <CheckCircle className="shrink-0" /> <span className="hidden xs:inline">Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(ad)}
                      className="flex-1 flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all active:scale-95"
                    >
                      <XCircle className="shrink-0" /> <span className="hidden xs:inline">Reject</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}