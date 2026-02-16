import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimonials from "../data/testimonialsData";
import { ChevronLeft, ChevronRight, StarFill } from "react-bootstrap-icons";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="relative bg-[#080f25] py-24 px-6 overflow-hidden">
      {/* HEADER */}
      <div className="relative z-10 text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.3em] text-blue-400 border border-blue-400/20 bg-blue-400/5 rounded-full uppercase">
          Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Loved by Thousands
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Don't just take our word for it. Here's what our customers have to say about their VajraBank experience.
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-14 shadow-2xl relative"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <StarFill 
                  key={i} 
                  className={i < current.rating ? "text-amber-400" : "text-slate-700"} 
                  size={18}
                />
              ))}
            </div>

            {/* Message */}
            <blockquote className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed italic mb-10">
              "{current.message}"
            </blockquote>

            {/* User Info */}
            <div className="flex items-center gap-4 border-t border-white/5 pt-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-30 blur-sm"></div>
                <img 
                  src={current.image} 
                  alt={current.name} 
                  className="relative w-14 h-14 rounded-full object-cover border-2 border-slate-900"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white leading-tight">{current.name}</h4>
                <span className="text-blue-400 text-sm font-medium">{current.role}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="flex items-center justify-between mt-10 px-4">
          <button 
            onClick={prev}
            className="p-3 rounded-full bg-slate-800 text-white border border-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === index ? "w-8 h-2 bg-blue-500" : "w-2 h-2 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <button 
            onClick={next}
            className="p-3 rounded-full bg-slate-800 text-white border border-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}