import { useState, useEffect } from "react";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [amount, rate, tenure]);

  const calculateEMI = () => {
    const principal = Number(amount);
    const monthlyRate = rate / 12 / 100;
    const months = Number(tenure);

    if (principal && monthlyRate && months) {
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

      const totalPayment = emiValue * months;
      const interest = totalPayment - principal;

      setEmi(emiValue);
      setTotalPayable(totalPayment);
      setTotalInterest(interest);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0f1e] shadow-2xl">
        
        {/* LEFT SIDE: INPUT FORM */}
        <div className="p-6 md:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            Financial Planning
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Loan EMI Calculator</h3>
          <p className="text-slate-400 text-sm md:text-base mb-10 leading-relaxed">
            Plan your finances with institutional precision. Adjust the parameters to find a plan that fits your lifestyle.
          </p>

          <div className="space-y-8">
            {/* Amount Input */}
            <div className="group flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-400 transition-colors">Loan amount</label>
                <span className="text-indigo-400 font-mono text-xs font-bold">INR</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Interest Input */}
                <div className="group flex flex-col gap-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-400">Interest Rate (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-xl"
                    />
                </div>

                {/* Tenure Input */}
                <div className="group flex flex-col gap-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-400">Tenure (Months)</label>
                    <input
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-xl"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: RESULTS DISPLAY */}
        <div className="relative p-6 md:p-10 lg:p-14 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent flex flex-col justify-between">
          
          <div className="space-y-10">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Projection</h4>

            <div className="flex flex-col gap-3">
              <span className="text-slate-400 text-sm font-medium">Monthly Installment (EMI)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                    ₹{emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-indigo-500 font-bold text-sm">/mo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Interest</span>
                <span className="text-2xl font-bold text-white">
                  ₹{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Payable</span>
                <span className="text-2xl font-bold text-indigo-400">
                  ₹{totalPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    <strong>Note:</strong> Figures shown are indicative. Actual rates may vary based on your credit score and internal bank policies. 
                </p>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
}