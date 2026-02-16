import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAds } from '../context/AdContext';
import { Megaphone, ArrowRight, X } from 'react-bootstrap-icons';
import { adService } from '../services/adService';

export default function AdBanner({ page }) {
    const { ads: allAds, loading, getAdsForPage } = useAds();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const effectivePage = page || (window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1).toLowerCase());
    const ads = getAdsForPage(effectivePage);

    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [ads.length]);

    if (loading || ads.length === 0 || !isVisible) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentAd.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl min-h-[140px] md:min-h-[120px] group"
                >
                    {/* Background Layer with Overlay */}
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${currentAd.imageUrl})` }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

                    {/* Content Layer */}
                    <div className="relative z-20 p-5 md:px-8 flex flex-col justify-between h-full">
                        
                        {/* Header */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
                                <Megaphone className="animate-pulse" /> Sponsored
                            </span>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-col max-w-2xl">
                                <h3 className="text-lg md:text-xl font-bold text-white leading-tight tracking-tight">
                                    {currentAd.title}
                                </h3>
                                {currentAd.businessName && (
                                    <span className="text-xs text-slate-400 mt-1 font-medium">
                                        Featured Partner: <span className="text-blue-300">{currentAd.businessName}</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center">
                                <a
                                    href={currentAd.redirectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => adService.trackClick(currentAd.id)}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all hover:gap-4 shadow-lg shadow-blue-900/20 active:scale-95"
                                >
                                    Learn More <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Indicators (Bottom Dots) */}
                    {ads.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                            {ads.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        idx === currentIndex 
                                        ? 'w-6 bg-blue-500' 
                                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}