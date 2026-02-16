import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  ShieldLock,
  LightningCharge,
  Cpu,
  Globe2,
  CreditCard,
  ArrowRight,
  CheckCircleFill,
  PlusCircle,
  X,
  Trophy,
  BoxSeam
} from "react-bootstrap-icons";
import Testimonials from "../components/Testimonials";

// ... (Keep HERO_IMAGES, STORY_ITEMS, FEATURES, STACKED_CARDS data models as they were)
/* --- DATA MODELS --- */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=2070",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
];

const STORY_ITEMS = [
  {
    title: "1. Virtual Onboarding",
    desc: "Open your account in under 3 minutes with digital KYC.",
    detail: "Our proprietary AI engine validates your identity in seconds using biometrics and government registry sync, allowing instant access to your new wallet.",
    label: "THE START",
    icon: <PlusCircle size={20} />
  },
  {
    title: "2. Secure Identity",
    desc: "Every transaction protected by hardware-level encryption.",
    detail: "We utilize FIPS 140-2 Level 3 certified modules to store keys. Every byte of your financial data is encrypted at rest and in transit.",
    label: "PROTECTION",
    icon: <ShieldLock size={20} />
  },
  {
    title: "3. Smart Management",
    desc: "AI insights that help you spend, save, and invest better.",
    detail: "Vajra AI scans your spending patterns to suggest optimized budget caps and auto-save triggers, helping you grow your net worth effortlessly.",
    label: "GROWTH",
    icon: <LightningCharge size={20} />
  },
  {
    title: "4. Global Reach",
    desc: "Borderless finance across 100+ corridors and 25 currencies.",
    detail: "No more SWIFT delays. Our peer-to-peer liquidity bridge ensures cross-border settlements happen in minutes, not days, with zero markup.",
    label: "BEYOND",
    icon: <Globe2 size={20} />
  }
];

const FEATURES = [
  {
    id: "upi",
    title: "Smart UPI & Payments",
    desc: "One tap to pay anyone, anywhere. Unified, fast, and free.",
    icon: <PlusCircle size={32} color="#10b981" />,
    path: "/user/payments",
    cta: "Go to Payments",
    heroSubtitle: "Engineered for 99.99% success rates and everyday speed.",
    details: "VajraBank's UPI engine is built for the modern pace. Scan any QR, pay contacts instantly, and manage all your bank accounts in one seamless interface.",
    capabilities: [
      { title: "Instant Transfers", desc: "Real-time settlement for all P2P and P2M transactions.", icon: <LightningCharge /> },
      { title: "Bill Splitting", desc: "Settle dinners or rent with automated link generation.", icon: <PlusCircle /> },
      { title: "Scheduled Pay", desc: "Never miss a rent or utility payment again.", icon: <ShieldLock /> }
    ],
    steps: ["Link Bank", "Scan QR", "Auth & Pay", "Auto-Track"],
    mockupType: "transactions",
    trust: "Military-grade encryption for every UPI pin entry."
  },
  {
    id: "cards",
    title: "Multi-Tier Cards",
    desc: "Physical, virtual, and collectible cards for every lifestyle.",
    icon: <CreditCard size={32} color="#4da3ff" />,
    path: "/user/cards",
    cta: "Manage Cards",
    heroSubtitle: "Complete control over your spend, from virtual to titanium.",
    details: "Choose from Elite Platinum, Vajra Gold, or Pulse Virtual. Our cards offer dynamic security and worldwide acceptance.",
    capabilities: [
      { title: "Instant Freeze", desc: "Misplaced your card? Lock it in one tap.", icon: <ShieldLock /> },
      { title: "Dynamic CVV", desc: "Rotating codes for ultra-secure online shopping.", icon: <LightningCharge /> },
      { title: "Limit Controls", desc: "Set per-transaction or daily spending caps.", icon: <Cpu /> }
    ],
    steps: ["Choose Tier", "Instant Issue", "Spend & Earn", "Redeem Rewards"],
    mockupType: "cards",
    trust: "PCIDSS Level 1 compliant infrastructure."
  },
  {
    id: "wealth",
    title: "Wealth & Stocks",
    desc: "Direct access to local and global equity markets.",
    icon: <Trophy size={32} color="#fbbf24" />,
    path: "/user/roi",
    cta: "Explore Investments",
    heroSubtitle: "Your wealth, managed by AI and secured by Vajra.",
    details: "Invest in US Stocks, Mutual Funds, and Fixed Deposits with zero commission and deep insights.",
    capabilities: [
      { title: "Fractional Stocks", desc: "Own a piece of global giants for as little as ₹100.", icon: <Globe2 /> },
      { title: "AI Rebalancing", desc: "Automated portfolio health checks every 24 hours.", icon: <Cpu /> },
      { title: "Tax Harvesting", desc: "Smart algorithms to save on your long term capital gains.", icon: <Trophy /> }
    ],
    steps: ["Risk Profile", "Fund Wallet", "Auto-Invest", "Track ROI"],
    mockupType: "chart",
    trust: "Regulated by SEBI and SIPC protected corrodors."
  },
  {
    id: "business",
    title: "Business Suite",
    desc: "Powerful banking tools for modern entrepreneurs.",
    icon: <BoxSeam size={32} color="#f472b6" />,
    path: "/user/business",
    cta: "Open Business Dash",
    heroSubtitle: "Bank less, grow more. Tools for the creators and founders.",
    details: "Automate payroll, manage vendor payouts, and get instant business credit lines based on your cash flow.",
    capabilities: [
      { title: "Bulk Payouts", desc: "Pay 1000+ vendors or employees in a single click.", icon: <PlusCircle /> },
      { title: "Team Cards", desc: "Issue cards to your team with individual limits.", icon: <CreditCard /> },
      { title: "Smart Invoices", desc: "Automatic matching of incoming payments to bills.", icon: <Cpu /> }
    ],
    steps: ["Verify Business", "Setup Team", "Go Live", "Analyze Health"],
    mockupType: "business",
    trust: "Dual-layer authorization for all bulk releases."
  },
  {
    id: "platform",
    title: "Wealth Platform",
    desc: "Personalized investment advisory for elite members.",
    icon: <LightningCharge size={32} color="#a78bfa" />,
    path: "/user/roi",
    cta: "See Platinum Perks",
    heroSubtitle: "Bespoke advisory for people who value time as much as wealth.",
    details: "Access private equity deals and high-yield structured products curated by our experts.",
    capabilities: [
      { title: "Private Equity", desc: "Exclusive access to pre-IPO investment rounds.", icon: <Trophy /> },
      { title: "Heritage Vaults", desc: "Structured products for generational wealth preservation.", icon: <ShieldLock /> },
      { title: "Advisory Access", desc: "Direct chat with senior investment strategists.", icon: <PlusCircle /> }
    ],
    steps: ["KYC Upgrade", "Advisory Meet", "Global Picks", "Quarterly Audit"],
    mockupType: "advisory",
    trust: "Personal NDAs and high-fidelity privacy layers."
  },
  {
    id: "international",
    title: "International Suite",
    desc: "Send, receive, and hold foreign currencies with ease.",
    icon: <Globe2 size={32} color="#6366f1" />,
    path: "/user/international",
    cta: "Go International",
    heroSubtitle: "Finance without borders. Send global as fast as local.",
    details: "Multi-currency wallets that get you the real exchange rate without the hidden bank fees.",
    capabilities: [
      { title: "Global Wallets", desc: "Hold 25+ currencies including USD, EUR, and GBP.", icon: <Globe2 /> },
      { title: "Direct Corridors", desc: "Skip intermediary banks for faster, cheaper transfers.", icon: <LightningCharge /> },
      { title: "FEMA Compliant", desc: "All paperwork and declarations handled automatically.", icon: <ShieldLock /> }
    ],
    steps: ["Set Corridor", "Lock Rate", "Send Money", "Real-time Tracking"],
    mockupType: "currency",
    trust: "Regulated across 15+ global finance jurisdictions."
  }
];

const STACKED_CARDS = [
  {
    id: "platinum",
    name: "Elite Platinum",
    theme: "linear-gradient(135deg, #1e293b, #0f172a)",
    benefits: ["Priority Concierge", "5% Reward Rate", "Unlimited Lounge", "Golf Access", "Insurance Cover"],
    limit: "₹1,000,000",
    fees: "₹4,999/yr",
    eligibility: "Income > ₹1.5L/mo",
    details: "The Elite Platinum is more than just a card; it's a gateway to a premium lifestyle."
  },
  {
    id: "gold",
    name: "Vajra Gold",
    theme: "linear-gradient(135deg, #451a03, #78350f)",
    benefits: ["Airport Transfers", "3% Cash Back", "Zero Forex Markup", "Dining Discounts"],
    limit: "₹500,000",
    fees: "₹999/yr",
    eligibility: "Income > ₹60k/mo",
    details: "Vajra Gold is designed for the savvy traveler."
  },
  {
    id: "virtual",
    name: "Pulse Virtual",
    theme: "linear-gradient(135deg, #1e1b4b, #312e81)",
    benefits: ["Instant Access", "Dynamic CVV", "Safe Online Pay", "Subscription Control"],
    limit: "Customizable",
    fees: "Free",
    eligibility: "Instant Approval",
    details: "Pulse Virtual is optimized for the digital age."
  }
];

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deckIndex, setDeckIndex] = useState(0);
  const [activeDeepDive, setActiveDeepDive] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ users: 0, uptime: 0, growth: 0 });

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    const targets = { users: 2.8, uptime: 99.9, growth: 250 };
    const duration = 2000;
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const statsTimer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        users: (targets.users * progress).toFixed(1),
        uptime: (targets.uptime * progress).toFixed(1),
        growth: Math.floor(targets.growth * progress)
      });
      if (currentStep === steps) clearInterval(statsTimer);
    }, interval);

    return () => { clearInterval(heroTimer); clearInterval(statsTimer); };
  }, []);

  const handleAction = (path) => {
    user ? navigate(path) : navigate("/login");
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* 1️⃣ HERO CAROUSEL */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-1000 ease-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_IMAGES.map((img, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Modern Banking.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Redefined for You.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 opacity-90">
            Experience a financial platform built for speed, transparency, and absolute security. Trusted by millions worldwide.
          </p>
          <button 
            onClick={() => handleAction("/signup")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* 2️⃣ THE VAJRA EXPERIENCE (TIMELINE) */}
      <section className="py-24 max-w-6xl mx-auto px-6 relative">
        <div className="absolute left-1/2 top-48 bottom-24 w-px bg-gradient-to-b from-blue-500/50 via-slate-800 to-transparent hidden md:block" />
        
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Vajra Experience</h2>
          <p className="text-slate-400">Our journey to building the future of finance</p>
        </div>

        <div className="space-y-24">
          {STORY_ITEMS.map((item, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 md:text-right hidden md:block">
                {idx % 2 !== 0 && <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
                  <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">{item.label}</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.detail}</p>
                </div>}
              </div>

              <div className="z-10 w-16 h-16 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
                {item.icon}
              </div>

              <div className="flex-1 text-left">
                {idx % 2 === 0 ? (
                  <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
                    <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">{item.label}</span>
                    <h3 className="text-2xl font-bold text-white mt-2 mb-4">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                ) : (
                  <div className="md:hidden p-8 rounded-3xl bg-slate-900/50 border border-white/5">
                    <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">{item.label}</span>
                    <h3 className="text-2xl font-bold text-white mt-2 mb-4">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3️⃣ STACKED CARD DECK */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Identity</h2>
          <p className="text-slate-400 mb-16">Select a card to explore bespoke financial privileges.</p>

          <div className="relative h-[400px] flex justify-center items-center perspective-1000">
            {STACKED_CARDS.map((card, idx) => {
              const isActive = idx === deckIndex;
              const isPrev = idx === (deckIndex - 1 + STACKED_CARDS.length) % STACKED_CARDS.length;
              const isNext = idx === (deckIndex + 1) % STACKED_CARDS.length;

              return (
                <div
                  key={card.id}
                  onClick={() => setDeckIndex(idx)}
                  className={`absolute w-80 md:w-96 h-56 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out p-8 flex flex-col justify-between shadow-2xl ${
                    isActive ? 'z-30 scale-110 translate-y-0 opacity-100' :
                    isPrev ? 'z-20 -translate-x-32 md:-translate-x-48 scale-90 opacity-40 rotate-[-10deg]' :
                    isNext ? 'z-20 translate-x-32 md:translate-x-48 scale-90 opacity-40 rotate-[10deg]' :
                    'opacity-0 scale-50 z-0'
                  }`}
                  style={{ background: card.theme }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-black italic text-xl text-white/90 tracking-tighter">VAJRA</span>
                    <Cpu size={28} className="text-white/40" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-wide">{card.name}</div>
                  <div className="flex justify-between items-end text-[10px] text-white/60 tracking-widest uppercase">
                    <div>{user?.name || "AUTHORIZED USER"}</div>
                    <div>VALID THRU 12/28</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 max-w-2xl mx-auto animate-in fade-in duration-700">
             <h3 className="text-2xl font-bold text-white mb-6">{STACKED_CARDS[deckIndex].name}</h3>
             <div className="flex flex-wrap justify-center gap-3 mb-10">
                {STACKED_CARDS[deckIndex].benefits.map((b, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    <CheckCircleFill size={14} /> {b}
                  </span>
                ))}
             </div>
             <button onClick={() => handleAction("/user/cards")} className="px-10 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                Apply for {STACKED_CARDS[deckIndex].name}
             </button>
          </div>
        </div>
      </section>

      {/* 4️⃣ FEATURE GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div 
              key={i} 
              onClick={() => setActiveDeepDive({ type: 'feature', ...f })}
              className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all" />
              <div className="mb-6 transform group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ArrowRight />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5️⃣ SECURITY SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Bank-Grade Security. Always On.</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            VajraBank leverages distributed hardware security modules and real-time behavioral analysis to detect and block threats before they reach your account.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: "256-bit AES", sub: "Military encryption" },
              { label: "24/7 Monitoring", sub: "Real-time audit trails" },
              { label: "Biometric Sync", sub: "Hardware key support" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ METRICS */}
      <section className="py-24 bg-slate-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-6xl font-black text-white mb-2">{stats.users}M+</div>
            <div className="text-blue-500 font-bold tracking-widest text-xs uppercase">Active Users</div>
          </div>
          <div>
            <div className="text-6xl font-black text-white mb-2">{stats.uptime}%</div>
            <div className="text-blue-500 font-bold tracking-widest text-xs uppercase">System Uptime</div>
          </div>
          <div>
            <div className="text-6xl font-black text-white mb-2">{stats.growth}%</div>
            <div className="text-blue-500 font-bold tracking-widest text-xs uppercase">Annual Growth</div>
          </div>
        </div>
      </section>

      {/* 7️⃣ CONFIDENCE CLOSE */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Your Trust is Our Asset.</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-12">
          Join a banking platform that values your time as much as your wealth. Borderless, secure, and built for the future.
        </p>
        <button 
          onClick={() => handleAction("/login")}
          className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-blue-500/25 transform hover:-translate-y-1"
        >
          Start Your Journey Today
        </button>
      </section>

      <Testimonials />

      {/* 8️⃣ PRODUCT DEEP-DIVE MODAL */}
      {activeDeepDive && (
        <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto animate-in fade-in duration-300">
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
            <div className="font-black text-xl tracking-tighter text-white">VAJRA<span className="text-blue-500">PRODUCT</span></div>
            <button 
              onClick={() => setActiveDeepDive(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors"
            >
              <ArrowRight className="rotate-180" /> BACK TO ABOUT
            </button>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <span className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs">Deep Dive</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-4 mb-6">{activeDeepDive.title || activeDeepDive.name}</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-20">{activeDeepDive.heroSubtitle || "Exclusive features for our members."}</p>

            {/* Mockup area (Simplified) */}
            <div className="mb-24 p-8 rounded-[3rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-3xl overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
               <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                  {activeDeepDive.mockupType === 'transactions' && (
                    <div className="w-full max-w-md space-y-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500" style={{animationDelay: `${i*100}ms`}}>
                            <div className="flex items-center gap-4 text-left">
                               <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center"><LightningCharge /></div>
                               <div><div className="text-white font-bold">Transaction {i}</div><div className="text-xs text-slate-500">UPI 2.0 Secure</div></div>
                            </div>
                            <div className="text-emerald-500 font-bold">-₹{(Math.random()*1000).toFixed(2)}</div>
                         </div>
                       ))}
                    </div>
                  )}
                  {activeDeepDive.mockupType === 'cards' && (
                    <div className="w-80 h-48 rounded-2xl shadow-2xl animate-bounce-slow" style={{ background: activeDeepDive.theme }} />
                  )}
                  {activeDeepDive.mockupType === 'chart' && (
                    <div className="flex items-end gap-2 h-48">
                       {[40, 70, 55, 90, 65, 85, 95].map((h, i) => (
                         <div key={i} className="w-8 bg-blue-500/40 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
               {activeDeepDive.capabilities?.map((cap, idx) => (
                 <div key={idx} className="p-8 rounded-3xl bg-slate-900 border border-white/5 text-left">
                    <div className="text-blue-400 mb-6">{cap.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{cap.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{cap.desc}</p>
                 </div>
               ))}
            </div>

            <div className="mb-24 py-12 border-y border-white/5">
               <h2 className="text-3xl font-bold text-white mb-12">How It Works</h2>
               <div className="flex flex-col md:flex-row justify-between gap-8">
                  {activeDeepDive.steps?.map((step, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                       <div className="w-12 h-12 bg-white text-slate-950 rounded-full flex items-center justify-center font-black mb-4">{idx + 1}</div>
                       <div className="text-white font-bold">{step}</div>
                    </div>
                  ))}
               </div>
            </div>

            <button 
               onClick={() => handleAction(activeDeepDive.path)}
               className="px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-blue-500/30"
            >
              {activeDeepDive.cta || "Apply Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}