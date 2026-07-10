"use client";

import { Activity } from "lucide-react";

interface StressOverlayProps {
  active: boolean;
  onChange: (active: boolean) => void;
  className?: string;
  theme?: "light" | "dark";
}

export default function StressOverlay({
  active,
  onChange,
  className = "",
  theme = "dark",
}: StressOverlayProps) {
  const isLight = theme === "light";

  return (
    <div
      className={`inline-flex items-center gap-3 p-1.5 rounded-full border transition-all duration-300 ${
        isLight
          ? "bg-zinc-100 border-zinc-200/80 shadow-sm"
          : "bg-zinc-950/80 border-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
      } ${className}`}
    >
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 rounded-full text-[9px] font-mono tracking-wider transition-all duration-300 font-bold uppercase ${
          !active
            ? isLight
              ? "bg-white text-zinc-900 shadow-sm"
              : "bg-zinc-900 text-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-zinc-800/50"
            : isLight
            ? "text-zinc-500 hover:text-zinc-800"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        Baseline
      </button>

      <button
        onClick={() => onChange(true)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-mono tracking-wider transition-all duration-300 font-bold uppercase ${
          active
            ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            : isLight
            ? "text-zinc-500 hover:text-red-600"
            : "text-zinc-500 hover:text-red-400"
        }`}
      >
        <Activity size={10} className={active ? "text-red-400" : "text-zinc-500"} />
        <span>Stress State</span>
      </button>
    </div>
  );
}
