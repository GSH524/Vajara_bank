export default function AdminChart() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 group-hover:text-indigo-400 transition-colors">
            Transaction Analytics
          </h4>
          <p className="mt-1 text-sm text-slate-400">Monthly volume overview</p>
        </div>
        
        {/* Decorative "Live" Indicator */}
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
        </div>
      </div>

      {/* Chart Placeholder / Skeleton UI */}
      <div className="relative flex h-[240px] items-end gap-3 rounded-xl bg-slate-950/50 p-4 border border-white/5">
        {/* Fake Bars with staggered heights for a realistic look */}
        {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((height, i) => (
          <div
            key={i}
            className="w-full rounded-t-sm bg-gradient-to-t from-indigo-600/20 to-indigo-400/60 transition-all duration-500 group-hover:to-indigo-400"
            style={{ height: `${height}%` }}
          />
        ))}

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
          <div className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-3 shadow-xl">
             <p className="text-xs font-medium text-indigo-400">API Connection Pending</p>
             <p className="text-[10px] text-slate-500 text-center mt-1">Connect to Recharts/Chart.js</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total Volume</span>
          <span className="text-lg font-semibold text-white">₹0.00</span>
        </div>
        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
}