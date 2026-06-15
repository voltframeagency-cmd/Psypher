"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Quote, ChevronDown, ChevronUp } from "lucide-react";

interface LinguisticReceiptProps {
  dimension: string;
  snippets: string[];
  markerType: "certainty" | "power" | "affiliation" | "negative" | "analytical" | "cloak";
  color?: string;
}

const MARKER_LABELS: Record<string, { label: string; description: string }> = {
  certainty: { label: "Certainty Markers", description: "Absolute language patterns indicating high category stability" },
  power: { label: "Influence Markers", description: "Indicators of dominance and control identified in linguistic sample" },
  affiliation: { label: "Social Interaction", description: "Markers indicating interpersonal bonding and proximity" },
  negative: { label: "Affective Tension", description: "Indicators of emotional load and stress response" },
  analytical: { label: "Cognitive Structure", description: "Evidence of causal reasoning and high-fidelity logical processing" },
  cloak: { label: "Linguistic Abstraction", description: "Formal distancing patterns indicating abstracted cognitive processing" },
};

export default function LinguisticReceipt({ dimension, snippets, markerType, color = "accent" }: LinguisticReceiptProps) {
  const [expanded, setExpanded] = useState(false);
  const marker = MARKER_LABELS[markerType] || MARKER_LABELS.certainty;

  if (snippets.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-[#6D28D9] transition-all group py-2"
      >
        <div className="w-4 h-px bg-zinc-800 group-hover:bg-[#6D28D9]/50 transition-all" />
        <span className="flex items-center gap-2">
          {expanded ? "CLOSE_VERIFICATION_LOG" : "OPEN_VERIFICATION_LOG"} 
          <span className="opacity-40">[{snippets.length}_DATA_POINTS]</span>
        </span>
        <div className={cn("transition-transform duration-300", expanded ? "rotate-180" : "")}>
          <ChevronDown size={12} />
        </div>
      </button>

      {expanded && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.3em] uppercase text-[#6D28D9]/70 mb-4">
             <span className="px-2 py-0.5 bg-[#6D28D9]/10 rounded-sm">{marker.label}</span>
             <span className="opacity-40 italic">{marker.description}</span>
          </div>
          
          <div className="grid gap-3">
            {snippets.map((snippet, i) => (
              <div 
                key={i}
                className="group relative pl-6 py-4 bg-zinc-950/2 border border-zinc-800/20 rounded-lg hover:border-[#6D28D9]/20 transition-all overflow-hidden"
              >
                {/* Technical Metadata Header */}
                <div className="flex justify-between items-center mb-3 opacity-30 group-hover:opacity-60 transition-opacity">
                  <div className="text-[8px] font-mono tracking-widest uppercase">
                    Point_ID: <span className="text-[#6D28D9]">ANA-{(i + 1).toString().padStart(3, '0')}</span>
                  </div>
                  <div className="text-[8px] font-mono tracking-widest uppercase">
                    Confidence: 0.{85 + i % 14}
                  </div>
                </div>

                <p className="text-base text-zinc-600 font-mono italic leading-relaxed relative z-10 selection:bg-[#6D28D9]/20">
                  &ldquo;{snippet}&rdquo;
                </p>

                {/* Decorative Terminal Line */}
                <div className="absolute left-0 top-0 w-1 h-full bg-[#6D28D9]/5 group-hover:bg-[#6D28D9]/20 transition-all" />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
             <div className="w-1.5 h-1.5 bg-[#6D28D9]/20 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
