export default function Secure() {
  return (
    <div className="page fade-up">
      <h1>Secure Banking</h1>
      <p>Detailed explanation about encryption, MFA, fraud protection…</p>
    </div>
  );
}
import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  ShieldShaded, 
  Cpu, 
  EnvelopeCheck, 
  ArrowRight 
} from 'react-bootstrap-icons';

export default function Secure() {
  const securityFeatures = [
    {
      icon: <Fingerprint className="text-emerald-400" size={32} />,
      title: "Multi-Factor Authentication",
      desc: "Biometric and hardware-key support ensures that only you can access your wealth."
    },
    {
      icon: <Cpu className="text-emerald-400" size={32} />,
      title: "AES-256 Encryption",
      desc: "Your data is obfuscated with military-grade encryption at rest and in transit."
    },
    {
      icon: <ShieldShaded className="text-emerald-400" size={32} />,
      title: "AI Fraud Detection",
      desc: "Our Vajra Guardian™ AI monitors patterns 24/7 to block suspicious activity instantly."
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4">
            <ShieldCheck size={14} /> Zero Liability Protocol
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Secure Banking <br className="hidden md:block" /> by Design
          </h1>
          <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Vajra Bank utilizes decentralized security architectures to ensure your assets 
            remain untouchable by unauthorized entities.
          </p>
        </div>

        {/* HERO FEATURE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Main Card */}
          <div className="lg:col-span-7 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 overflow-hidden relative group">
            <div className="relative z-10">
              <Lock className="text-emerald-500 mb-6" size={48} />
              <h2 className="text-3xl font-black mb-6">Encrypted Infrastructure</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Our core banking engine is built on an isolated network. Each transaction 
                undergoes a triple-layer validation process before being committed to the ledger.
              </p>
              <button className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all">
                Read Security Whitepaper <ArrowRight />
              </button>
            </div>
            {/* Decorative Icon in background */}
            <ShieldShaded size={200} className="absolute -bottom-10 -right-10 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Side Info */}
          <div className="lg:col-span-5 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Regulatory Compliance</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Vajra is fully compliant with RBI's Cyber Security Framework and international 
              standards for retail banking.
            </p>
            <div className="space-y-4">
              {['ISO 27001 Certified', 'PCI-DSS Level 1', 'GDPR Compliant'].map((tag) => (
                <div key={tag} className="flex items-center gap-3 text-zinc-300 text-sm font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURE BENTO GRID */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {securityFeatures.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-emerald-500/20 transition-all hover:-translate-y-1">
              <div className="mb-6">{f.icon}</div>
              <h4 className="text-lg font-bold mb-3">{f.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* EMERGENCY ACTION */}
        <div className="mt-20 p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <EnvelopeCheck className="text-red-400 shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-red-400">Lost your device?</h4>
              <p className="text-zinc-500 text-sm">Kill-switch access is available 24/7 via our emergency hotline.</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl transition-colors">
            Contact Fraud Response
          </button>
        </div>

      </div>
    </main>
  );
}