import { useParams, Link } from "react-router-dom";
import features from "../data/featuresData";
import { ArrowLeft, Cpu, ShieldCheck, Zap } from "lucide-react"; // Using lucide for consistent icons

export default function FeatureDetail() {
  const { id } = useParams();
  const feature = features.find((f) => f.id === id);

  if (!feature) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-10">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-black text-white">Feature not found</h2>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 relative z-10">
        {/* BACK BUTTON */}
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-all duration-300 mb-12"
        >
          <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-yellow-400/50 group-hover:bg-yellow-400/10">
            <ArrowLeft size={18} />
          </div>
          <span className="font-bold tracking-wide">Back to Vajra Hub</span>
        </Link>

        {/* CONTENT CARD */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
             System Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            {feature.title}
          </h1>

          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-transparent rounded-full mb-10" />

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
            {feature.description}
          </p>

          {/* ADDITIONAL DETAIL GRID (MOCK DATA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-white/5">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02]">
              <Zap className="text-yellow-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm mb-1">Instant Deployment</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Ready to use across all your integrated Vajra accounts.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02]">
              <ShieldCheck className="text-indigo-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm mb-1">Secure Protocol</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Validated by military-grade encryption and RBI compliance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}