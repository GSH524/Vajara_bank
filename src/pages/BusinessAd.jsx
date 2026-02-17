import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adDismissed, setAdDismissed] = useState(false);
  const navigate = useNavigate();

  // List of your images from the public folder
  const ads = [
    { id: 1, src: '/ChatGPT Image Feb 17, 2026, 11_05_36 AM.png', link: '/debt-fund' },
    { id: 2, src: '/ChatGPT Image Feb 17, 2026, 11_11_46 AM.png', link: '/hybrid-fund' },
    { id: 3, src: '/ChatGPT Image Feb 17, 2026, 11_17_06 AM.png', link: '/equity-fund' },
    { id: 4, src: '/ChatGPT Image Feb 17, 2026, 11_26_02 AM.png', link: '/tax-saver' },
  ];

  const currentAd = ads[currentAdIndex];

  useEffect(() => {
    // Check if ad was previously dismissed (stored in localStorage)
    const dismissed = localStorage.getItem('adDismissed');
    if (dismissed === 'true') {
      setAdDismissed(true);
      return;
    }

    // Show ad after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  // Carousel rotation - change ad every 3 seconds
  useEffect(() => {
    if (!isVisible) return;

    const carouselTimer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);

    return () => clearInterval(carouselTimer);
  }, [isVisible, ads.length]);

  if (!isVisible || !currentAd || adDismissed) return null;

  const handleClose = () => {
    setIsVisible(false);
    // Store dismissal in localStorage so ad doesn't show until page reload
    localStorage.setItem('adDismissed', 'true');
    setAdDismissed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Top Right Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close Ad"
        >
          <span className="text-xl font-bold">&times;</span>
        </button>

        {/* Ad Image Link */}
        <a href={currentAd.link} className="block group">
          <img 
            src={encodeURI(currentAd.src)} 
            alt="Business Advertisement" 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>

        {/* CTA (navigates to signup) */}
        <button
          onClick={() => { setIsVisible(false); navigate('/signup'); }}
          className="w-full bg-indigo-600 text-white text-center py-3 font-semibold hover:bg-indigo-700 transition-colors"
          aria-label="Invest Now - Sign up"
        >
          Invest Now &rarr;
        </button>
      </div>
    </div>
  );
};

export default BusinessAd;