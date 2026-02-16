import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import FeaturesShowcase from "../components/FeaturesShowcase";
import features from "../data/featuresData";
import AdBanner from "../components/AdBanner";

const heroImages = [
  "https://cdn.prod.website-files.com/67b7abfbb037e687d0a415ec/67db95411df971225cd735e7_emerging_technologies_in_finance.webp",
  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1",
  "https://images.unsplash.com/photo-1581091012184-5c7b8b78c8e3",
  "https://img.freepik.com/free-photo/finance-business-accounting-analysis-management-concept_53876-15817.jpg",
];

const tracks = [/* ... tracks data ... */];

export default function Home() {
  const [active, setActive] = useState(null);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const activeTrack = tracks.find((t) => t.id === active);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 pb-20 lg:pb-0">
      {/* ================= HERO SECTION ================= */}
      {/* Adjusted height: h-[85vh] ensures it fits nicely on tall mobile screens */}
      <AdBanner/>
      <section className="relative h-[85vh] md:h- overflow-hidden">
        <div 
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {heroImages.map((img, i) => (
            <div
              key={i}
              className="min-w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-5xl mx-auto pt-10">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 leading-[1.2]">
            Banking that's <br className="hidden md:block" />
            <span className="text-blue-500">Secure</span>, <span className="text-indigo-400">Smart</span> <br className="md:hidden" />
            & Built for India
          </h1>
          
          <p className="text-base md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
            VajraBank brings next-generation digital banking with enterprise-grade
            security and powerful financial tools.
          </p>
          
          {/* Buttons: Stacked on mobile for better tap targets */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs sm:max-w-none">
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 backdrop-blur-md transition-all"
              onClick={scrollToFeatures}
            >
              Explore Features
            </button>
          </div>

          {/* Trust Badges: Scrolling/Wrapping layout */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[12px] md:text-sm font-medium text-white/60">
            <span className="flex items-center gap-1.5 whitespace-nowrap">🔐 RBI-Compliant</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">🛡️ 256-bit AES</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">⚡ Instant UPI</span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SHOWCASE ================= */}
      <FeaturesShowcase />

      {/* ================= CALCULATORS GRID ================= */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Tools and Calculators</h2>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Professional grade calculators for your financial planning.
          </p>
        </div>

        {/* Grid: 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {features.map((item) => (
            <FeatureCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* ================= USER TRACKS ================= */}
      <section className="py-16 md:py-24 px-6 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Your Personalized Track</h2>
            <p className="text-sm md:text-base text-slate-400">Select your profile to see relevant tools</p>
          </div>

          {/* Tracks: Stacked on mobile with better spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {tracks.map((t) => (
              <div
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`p-6 md:p-8 rounded-2xl border transition-all cursor-pointer ${
                  active === t.id 
                  ? "bg-blue-600/20 border-blue-500" 
                  : "bg-slate-900 border-white/5"
                }`}
              >
                <h3 className={`text-lg font-bold mb-2 ${active === t.id ? "text-blue-400" : "text-white"}`}>
                  {t.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Glass Detail Panel */}
          {active && activeTrack && (
            <div className="p-6 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{activeTrack.detail.heading}</h3>
              <p className="text-sm md:text-lg text-slate-300 mb-6">{activeTrack.detail.text}</p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {activeTrack.detail.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base text-slate-200">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 text-[11px] md:text-xs text-slate-500 uppercase tracking-widest">
                Disclaimer: Informational purposes only.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}