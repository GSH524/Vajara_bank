import React from "react";
import { LuShieldCheck, LuLock } from "react-icons/lu";

export default function SecureLoader({ message = "Establishing Secure Connection..." }) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#020617] p-4">
      {/* Background Radial Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617]" />

      {/* Main Animation Wrapper */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Icon Container with Radar Pulse Effect */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Pulse Ring 1 (Large) */}
          <div className="absolute w-32 h-32 md:w-40 md:h-40 bg-indigo-500/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          
          {/* Pulse Ring 2 (Medium) */}
          <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-indigo-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_200ms]" />
          
          {/* Static Glowing Ring */}
          <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]" />

          {/* Central Hexagon/Circle Container */}
          <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-20">
            <LuShieldCheck className="text-indigo-400 text-3xl md:text-4xl animate-pulse" />
            
            {/* Tiny decoration dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-bounce shadow-[0_0_10px_#10b981]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-[0.2em] uppercase">
            THE VAJRA Bank
          </h3>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-500/30 backdrop-blur-md">
            <LuLock className="text-emerald-400 text-xs md:text-sm" />
            <span className="text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse">
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}