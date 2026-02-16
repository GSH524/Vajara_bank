import React, { createContext, useContext, useState, useEffect } from 'react';
import { adService } from '../services/adService';

/**
 * Advertisement Context
 * 
 * Provides global state management for advertisements
 * Fetches ads once at app load and persists across route navigation
 * 
 * This solves the "disappearing ads" problem by:
 * 1. Fetching ads at layout level (not page level)
 * 2. Keeping ads in memory during navigation
 * 3. Preventing component unmount/remount issues
 */

const AdContext = createContext(null);

export const AdProvider = ({ children }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch active ads from backend
     */
    const fetchAds = async () => {
        try {
            setLoading(true);
            setError(null);

            const activeAds = await adService.getActiveAds();
            setAds(activeAds || []);

            console.log('✅ Ads loaded from REST API:', (activeAds || []).length);
        } catch (err) {
            console.error('❌ Failed to fetch ads:', err);
            setError(err.message);
            setAds([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch ads on mount
     */
    useEffect(() => {
        fetchAds();
    }, []);

    /**
     * Optional: Auto-refresh ads every 5 minutes
     * Uncomment to enable periodic refresh
     */
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     fetchAds();
    //   }, 5 * 60 * 1000); // 5 minutes
    //   
    //   return () => clearInterval(interval);
    // }, []);

    /**
     * Get ads for a specific page
     * 
     * CRITICAL: Only returns APPROVED + isActive ads
     * Supports both placements[] array (new) and showOn object (legacy)
     */
    const getAdsForPage = (pageName) => {
        if (!pageName) return ads;

        return ads.filter(ad => {
            // CRITICAL: Only show APPROVED ads
            if (ad.status !== 'APPROVED') {
                return false;
            }

            // If explicitly set to inactive, hide it
            if (ad.isActive === false) return false;

            // New Schema: placements array
            if (ad.placements && Array.isArray(ad.placements)) {
                return ad.placements.includes(pageName.toUpperCase());
            }

            // Legacy Schema: showOn object
            if (ad.showOn && typeof ad.showOn === 'object') {
                return ad.showOn[pageName.toLowerCase()] === true;
            }

            // Default: Show on Home, About, Contact if no placement info is present
            // (Assuming all partner ads go to these 3 pages as per request "Only show ads on Home, About, Contact pages")
            const allowedPages = ['home', 'about', 'contact'];
            if (allowedPages.includes(pageName.toLowerCase())) {
                return true;
            }

            return false;
        });
    };

    const value = {
        ads,
        loading,
        error,
        refreshAds: fetchAds,
        getAdsForPage
    };

    return (
        <AdContext.Provider value={value}>
            {children}
        </AdContext.Provider>
    );
};

/**
 * Custom hook to access ad context
 * 
 * Usage:
 *   const { ads, loading, refreshAds } = useAds();
 */
export const useAds = () => {
    const context = useContext(AdContext);

    if (!context) {
        throw new Error('useAds must be used within AdProvider');
    }

    return context;
};

export default AdContext;
