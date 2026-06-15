"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { CongruencyResult } from "@/lib/psychology/scoring";
import LinguisticReceipt from "./LinguisticReceipt";
import { Shield, AlertTriangle, CheckCircle, Eye } from "lucide-react";

interface CongruencySectionProps {
  results: CongruencyResult[];
  overallScore: number;
}

const DIRECTION_CONFIG = {
  aligned: { 
    label: "COHERENT_ALIGNMENT",
    status: "OPTIMAL",
    color: "zinc-900",
    accent: "#6D28D9",
    tag: "COH",
  },
  inflated: { 
    label: "POSITIVE_VARIANCE_DETECTED",
    status: "DISCREPANCY",
    color: "red-600",
    accent: "#ef4444",
    tag: "VAR+",
  },
  suppressed: { 
    label: "LATENT_SIGNATURE_DETECTED",
    status: "IDENTIFIED",
    color: "purple-600",
    accent: "#a855f7",
    tag: "LAT",
  },
};

const EVIDENCE_CATEGORY_MAP: Record<string, "certainty" | "power" | "affiliation" | "negative" | "analytical" | "cloak"> = {
  "Extraversion": "affiliation",
  "Agreeableness": "affiliation",
  "Conscientiousness": "analytical",
  "Emotional Stability": "negative",
  "Openness": "analytical",
  "Strategic Manipulation": "power",
  "Authenticity": "cloak",
};

export default function CongruencySection({ results, overallScore }: CongruencySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const divergentResults = results.filter(r => r.direction !== "aligned");
  const alignedResults = results.filter(r => r.direction === "aligned");

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".congruency-row",
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );

      // Scanner Rotation
      gsap.to("#scanner-line", {
        rotation: 360,
        repeat: -1,
        duration: 4,
        ease: "none",
        transformOrigin: "50% 50%"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-12 border-t border-zinc-100/50">
      {/* Section Header */}
      <div className="mb-10 space-y-8">
        <div className="flex items-center gap-6">
          <div className="p-2 bg-[#6D28D9]/5 rounded-xl border border-[#6D28D9]/10">
            <Shield size={20} className="text-[#6D28D9]" />
          </div>
          <span className="text-[10px] font-mono font-black tracking-[1em] uppercase text-[#6D28D9]">
            CONGRUENCY_MAPPING_ANALYSIS
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <h3 className="text-6xl md:text-8xl font-thin tracking-tighter leading-[0.85] lowercase">
            Where self-image<br />
            <span className="text-[#6D28D9]/30">meets_behavioral_data.</span>
          </h3>

          <div className="max-w-md">
            <p className="text-lg text-zinc-500 font-light leading-relaxed italic">
              "Empirical cross-reference of subjective self-assessment against autonomous linguistic data. Identifying discrepancies between self-perception and behavioral reality."
            </p>
          </div>
        </div>
      </div>

      {/* Stability Gauge Panel */}
      <div className="mb-12 p-8 md:p-12 border border-zinc-100 rounded-[2.5rem] bg-zinc-50/30 relative overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-zinc-950 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-white tracking-widest uppercase">Analysis_Validity: VERIFIED</span>
            </div>
            
            <h4 className="text-4xl font-light tracking-tight text-zinc-900">
              {overallScore >= 80 
                ? "Optimal Analytical Alignment"
                : overallScore >= 50 
                  ? "Analytical Variance Detected"
                  : "Significant Analytical Discrepancy"
              }
            </h4>
            
            <p className="text-base text-zinc-500 leading-relaxed max-w-sm">
              {overallScore >= 80 
                ? "High consistency between self-perception and behavior. Profile exhibits high self-awareness."
                : overallScore >= 50 
                  ? "Moderate variance detected. Behavioral patterns suggest areas of limited self-observation."
                  : "Critical discrepancy between self-perception and behavior. Profile indicates significant divergence from clinical linguistic norms."
              }
            </p>
          </div>

          {/* The SVG Gauge */}
          <div className="relative flex-shrink-0">
             <svg width="240" height="240" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                {/* Data Slots */}
                {[...Array(36)].map((_, i) => (
                  <line 
                    key={i}
                    x1="50" y1="5" x2="50" y2="8"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="0.2"
                    transform={`rotate(${i * 10} 50 50)`}
                  />
                ))}
                {/* Active Progress */}
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#6D28D9" 
                  strokeWidth="3" 
                  strokeDasharray={`${overallScore * 2.827} 282.7`}
                  strokeLinecap="round"
                  className="transition-all duration-[2000ms] delay-500 ease-expo"
                />
                {/* Scanner Line (GSAP will animate rotation) */}
                <line 
                  id="scanner-line"
                  x1="50" y1="50" x2="50" y2="5" 
                  stroke="#6D28D9" 
                  strokeWidth="0.5" 
                  strokeDasharray="2,2"
                  className="opacity-40"
                />
             </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-thin tracking-tighter text-zinc-900">{overallScore}%</span>
                <span className="text-[10px] font-mono tracking-widest text-[#6D28D9] font-black uppercase mt-2">Coherence</span>
              </div>
          </div>
        </div>
      </div>

      {/* Divergent Results (The Shadow Patterns) */}
      {divergentResults.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-red-600 font-bold">
              VARIANCE_ANALYSIS_INDEX [{divergentResults.length}]
            </span>
            <div className="flex-1 h-px bg-red-600/10" />
          </div>
          <div className="grid gap-8">
            {divergentResults.map((result) => (
              <CongruencyRow key={result.dimension} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Aligned Results */}
      {alignedResults.length > 0 && (
        <div>
          <div className="flex items-center gap-6 mb-8">
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-zinc-400 font-bold">
              COHERENCE_MAPPING_REPORT [{alignedResults.length}]
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
          <div className="grid gap-6">
            {alignedResults.map((result) => (
              <CongruencyRow key={result.dimension} result={result} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CongruencyRow({ result }: { result: CongruencyResult }) {
  const config = DIRECTION_CONFIG[result.direction as keyof typeof DIRECTION_CONFIG];
  const evidenceCategory = EVIDENCE_CATEGORY_MAP[result.dimension] || "analytical";
  const isDivergent = result.direction !== "aligned";

  return (
    <div className="congruency-row group relative p-6 md:p-8 border border-zinc-100 rounded-[2rem] bg-white hover:bg-zinc-50/50 transition-all duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-8">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-4">
             <div className={cn(
               "px-3 py-1 rounded-full text-[9px] font-mono font-black tracking-widest border",
               isDivergent ? "bg-red-50 text-red-600 border-red-200/50" : "bg-zinc-50 text-zinc-500 border-zinc-200/50"
             )}>
               {config.tag}
             </div>
             <h5 className="text-2xl font-light tracking-tight text-zinc-900">{result.dimension}</h5>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={cn("text-[10px] font-mono tracking-widest uppercase font-bold", isDivergent ? "text-red-600/70" : "text-zinc-400")}>
              {config.label}
            </span>
            <div className="w-1 h-1 bg-zinc-300 rounded-full" />
            <span className="text-[10px] font-mono tracking-widest text-[#6D28D9]/60 uppercase">
              {result.discrepancy}pt variance detected
            </span>
          </div>
        </div>
        
        {/* Dual-Frequency Signal Spectrum */}
        <div className="flex-1 max-w-md w-full">
           <div className="relative h-12 flex items-center">
              {/* Spectrum Line */}
              <div className="absolute inset-x-0 h-[1px] bg-zinc-200" />
              
              {/* Self-Report Marker [S] */}
              <div 
                className="absolute flex flex-col items-center transition-all duration-[1500ms] delay-700 ease-expo z-20"
                style={{ left: `${result.selfReportScore}%` }}
              >
                <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase mb-2">Self</div>
                <div className="w-3 h-3 bg-white border border-zinc-300 rounded-full flex items-center justify-center">
                   <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                </div>
                <div className="text-[10px] font-mono font-bold text-zinc-900 mt-2">{result.selfReportScore}%</div>
              </div>

              {/* Linguistic Marker [L] */}
              <div 
                className="absolute flex flex-col items-center transition-all duration-[1500ms] delay-700 ease-expo z-30"
                style={{ left: `${result.linguisticScore}%` }}
              >
                <div className="text-[8px] font-mono font-bold text-[#6D28D9]/70 uppercase mb-2">Lingual</div>
                <div className="w-4 h-4 bg-white border-2 border-[#6D28D9] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(109,40,217,0.3)]">
                   <div className="w-1.5 h-1.5 bg-[#6D28D9] rounded-full" />
                </div>
                <div className="text-[11px] font-mono font-black text-[#6D28D9] mt-2">{result.linguisticScore}%</div>
              </div>

              {/* Divergence Gap Overlay */}
              {isDivergent && (
                <div 
                   className="absolute h-4 bg-[#6D28D9]/5 border-x border-[#6D28D9]/20 transition-all duration-[1500ms] delay-700 pointer-events-none"
                   style={{ 
                     left: `${Math.min(result.selfReportScore, result.linguisticScore)}%`,
                     width: `${Math.abs(result.selfReportScore - result.linguisticScore)}%`,
                     top: '50%',
                     transform: 'translateY(-50%)'
                   }}
                >
                  <div className="absolute inset-x-0 h-px bg-[#6D28D9]/20 top-1/2 -translate-y-1/2 animate-pulse" />
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="relative">
        <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-4xl italic mb-6">
          "{result.interpretation}"
        </p>

        {/* Evidence */}
        <LinguisticReceipt
          dimension={result.dimension}
          snippets={result.evidenceSnippets}
          markerType={evidenceCategory}
        />
      </div>

      {/* Decorative Index Marker */}
      <div className="absolute top-8 right-8 text-[8px] font-mono text-zinc-200 tracking-[0.5em] uppercase pointer-events-none select-none">
        MOD_ID: ANA_{result.dimension.substring(0, 3).toUpperCase()}
      </div>
    </div>
  );
}
