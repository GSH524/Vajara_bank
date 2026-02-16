import { ArrowUpRight, ArrowDownRight, Activity } from "react-bootstrap-icons";

export default function AdminStatCard({ title, value, trend = "+12.5%", isPositive = true, icon: Icon = Activity }) {
  return (
    <div className="relative overflow-hidden group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:bg-slate-800/60 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">
      
      {/* Decorative Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>

      <div className="flex items-start justify-between">
        <div>
          {/* Title */}
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 group-hover:text-indigo-400 transition-colors">
            {title}
          </p>
          
          {/* Value */}
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon Container */}
        <div className="p-2.5 bg-slate-950/50 rounded-xl border border-white/5 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <Icon size={20} />
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
          isPositive 
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
            : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </div>
        <span className="text-[10px] text-slate-500 font-medium">vs last month</span>
      </div>

      {/* Bottom Progress Bar (Subtle hint of activity) */}
      <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${isPositive ? 'bg-indigo-500' : 'bg-slate-600'}`}
          style={{ width: isPositive ? '70%' : '30%' }}
        ></div>
      </div>
    </div>
  );
}