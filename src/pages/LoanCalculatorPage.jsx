import LoanCalculator from "../components/LoanCalculator";
import { ShieldCheck, Info, PieChart } from "lucide-react";

export default function LoanCalculatorPage() {
  return (
    <section className="relative min-h-screen bg-[#020617] py-20 px-6 overflow-hidden">
      
      {/* --- ATMOSPHERIC BACKGROUND DECOR --- */}
      {/* Indigo glow top-right */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      {/* Deep blue glow bottom-left */}
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
            <PieChart size={14} /> Financial Intelligence
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">EMI</span> Planning
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Configure your loan parameters with SRK Bank's institutional-grade algorithms. 
            Transparent calculations for your next big milestone.
          </p>
        </div>

        {/* --- THE CALCULATOR COMPONENT --- */}
        <div className="relative group transition-all duration-500">
          {/* Subtle outer glow that activates when the calculator is "used" */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative">
             <LoanCalculator />
          </div>
        </div>

        {/* --- TRUST FOOTER / INFO --- */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-12">
          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
            <ShieldCheck className="text-indigo-500 shrink-0" size={24} />
            <div>
              <h4 className="text-white font-bold text-sm mb-1">RBI Regulated Calculations</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Formulae aligned with the latest Reserve Bank of India guidelines for retail lending.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
            <Info className="text-blue-500 shrink-0" size={24} />
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Real-time Projections</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Instant updates as you toggle amounts, ensuring you never miss a budget detail.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">₹</div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">No Hidden Fees</h4>
              <p className="text-slate-500 text-xs leading-relaxed">The EMI shown is inclusive of principal and interest components only.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}