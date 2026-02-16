import { Link } from "react-router-dom";

export default function FeatureCard({ id, title, description, icon, path }) {
  return (
    <div className="group relative p-8 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/60 hover:border-blue-500/30 overflow-hidden">
      
      {/* Background Glow Effect on Hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Icon Container with Glass Effect */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300">
          {/* Mapping the icon prop (assumed to be a React icon component) */}
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
          {description}
        </p>

        {/* Learn More Link */}
        <Link 
          to={path} 
          className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group/link"
        >
          Learn more 
          <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}