import { useEffect, useState } from "react";

export default function TypingText({ text, speed = 40 }) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);

  // Reset animation if the text prop changes
  useEffect(() => {
    setDisplay("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplay((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <span className="relative inline-flex items-baseline font-mono tracking-tight leading-relaxed">
      {/* The typed text - uses responsive text sizes */}
      <span className="text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
        {display}
      </span>

      {/* The blinking cursor - Cyber Emerald styling */}
      <span 
        className={`
          ml-1.5 inline-block w-1.5 h-[1.2em] translate-y-[0.2em]
          bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]
          ${index < text.length ? 'animate-pulse' : 'animate-[blink_1s_step-end_infinite]'}
        `}
      />

      {/* Custom blink animation injected via Tailwind arbitrary values or global CSS */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}