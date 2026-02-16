import React from "react";
import { CheckCircleFill, CreditCard, StarFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function PartnerPlans() {
  const navigate = useNavigate();

  const handleSubscribe = (planName) => {
    navigate(`/partner/register?plan=${planName}`);
  };

  const plans = [
    {
      name: "Starter",
      price: "29",
      featured: false,
      features: [
        "Basic Analytics",
        "1 Ad Campaign",
        "Standard Support",
        "Community Access",
      ],
    },
    {
      name: "Growth",
      price: "99",
      featured: true,
      badge: "Most Popular",
      features: [
        "Advanced Analytics",
        "5 Ad Campaigns",
        "Priority Support",
        "API Access",
        "Custom Branding",
      ],
    },
    {
      name: "Enterprise",
      price: "299",
      featured: false,
      features: [
        "Unlimited Analytics",
        "Unlimited Ads",
        "Dedicated Manager",
        "White-label Solution",
        "SSO Integration",
      ],
    },
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans py-20 px-6">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Partner Plan</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlock the full power of the Vajra ecosystem. Scale your business with
          our tailored banking and advertising solutions.
        </p>
      </div>

      {/* PLANS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative p-8 rounded-[2.5rem] transition-all duration-300 border backdrop-blur-sm group ${
              plan.featured
                ? "bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/20 py-12 lg:-translate-y-4"
                : "bg-slate-900/50 border-white/5 hover:border-white/20"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-widest flex items-center gap-2">
                <StarFill size={10} /> {plan.badge}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">${plan.price}</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-5 mb-10">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center gap-3 text-sm">
                  <CheckCircleFill
                    className={plan.featured ? "text-blue-400" : "text-emerald-500"}
                  />
                  <span className={plan.featured ? "text-slate-200" : "text-slate-400"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                plan.featured
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <CreditCard size={18} />
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER TEXT */}
      <div className="mt-20 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-white/5 text-xs font-bold tracking-tighter uppercase text-slate-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Demo Mode: Payments are simulated. No real charge will be made.
        </div>
      </div>
    </div>
  );
}