"use client";

import { Info } from "lucide-react";
import { PRECOMPUTED_SEM, RELIABILITY } from "@/lib/psychology/psychometrics";

interface ConfidenceBandProps {
  score: number;
  reliabilityKey: string;
  className?: string;
  theme?: "light" | "dark";
  label?: string;
}

export default function ConfidenceBand({
  score,
  reliabilityKey,
  className = "",
  theme = "dark",
  label,
}: ConfidenceBandProps) {
  const sem = PRECOMPUTED_SEM[reliabilityKey] || 7.0;
  const alpha = RELIABILITY[reliabilityKey] || 0.75;
  const lower = Math.max(0, Math.round(score - 1.96 * sem));
  const upper = Math.min(100, Math.round(score + 1.96 * sem));

  const isLight = theme === "light";

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-mono tracking-wider transition-all duration-300 ${
        isLight
          ? "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
          : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/40"
      } ${className}`}
      title={`Standard Error of Measurement (SEM): ±${sem} based on Cronbach's α = ${alpha.toFixed(2)}. 95% Confidence Interval: ${lower}% to ${upper}%.`}
    >
      <Info size={10} className="text-purple-400" />
      <span>
        {label ? `${label}: ` : ""}95% CI: [{lower}% - {upper}%]
      </span>
    </div>
  );
}
