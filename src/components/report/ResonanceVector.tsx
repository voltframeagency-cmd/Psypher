"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ShieldAlert, ArrowRight } from "lucide-react";

interface ResonanceVectorProps {
  style: string;
  security: number;
  color?: string;
}

export default function ResonanceVector({ style, security, color = "#60A5FA" }: ResonanceVectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vectorRef.current) return;

    gsap.fromTo(vectorRef.current, 
      { width: "0%", opacity: 0 },
      { 
        width: `${security}%`, 
        opacity: 1, 
        duration: 1.5, 
        ease: "expo.out",
        delay: 0.5 
      }
    );

    gsap.fromTo(".friction-marker", 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, delay: 1.2, ease: "back.out(2)" }
    );
  }, [security]);

  const styleMapping: Record<string, { label: string; desc: string; friction: string[] }> = {
    "Secure": { 
      label: "Integrated_Base", 
      desc: "High-integrity interpersonal integration with optimized interaction depth.",
      friction: ["Low_Conflict_Sensitivity", "Transparent_Indicators"]
    },
    "Anxious-Preoccupied": { 
      label: "Vigilance_Indicator", 
      desc: "Enhanced sensitivity to attachment transitions and interpersonal volatility.",
      friction: ["Reassurance_Dependency", "Indicator_Noise_Amplification"]
    },
    "Dismissive-Avoidant": { 
      label: "Independent_Processing_Model", 
      desc: "Reduced interpersonal reliance for self-regulated operational outcomes.",
      friction: ["Interaction_Minimalism", "Proximity_Resistance"]
    },
    "Fearful-Avoidant": { 
      label: "Dissonant_Mapping", 
      desc: "Conflict between interpersonal desire and threat anticipation.",
      friction: ["Variable_Signaling", "Internal_Retreat_Dynamics"]
    }
  };

  const meta = styleMapping[style] || styleMapping["Secure"];

  return (
    <div ref={containerRef} className="relative w-full bg-[#f8f9fa] border border-black/[0.03] rounded-3xl p-6 overflow-hidden min-h-[280px] flex flex-col justify-between shadow-sm">
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5" />
      <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent -translate-y-1/2" />
      
      <div className="relative z-10 flex flex-col gap-6 h-full">
        {/* Header Metadata */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-black/40 font-black">Relational_Dynamics_Mapping</span>
            <h4 className="text-xl md:text-2xl font-bold tracking-tighter text-black uppercase">{meta.label}</h4>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/40 border border-black/5 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest text-black/60 font-black">MODEL_ACTIVE</span>
          </div>
        </div>

        {/* Vector Visualization */}
        <div className="relative h-4 w-full bg-black/5 rounded-full overflow-hidden">
          <div 
            ref={vectorRef}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-mono font-black text-white/50">{security}%</div>
        </div>

        {/* Clinical Indicators */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[9px] font-mono tracking-widest uppercase text-black/20 font-black">Primary_Dynamics</p>
            <p className="text-sm text-black/70 font-medium leading-relaxed italic">&quot;{meta.desc}&quot;</p>
          </div>
          <div className="space-y-2">
            <p className="text-[9px] font-mono tracking-widest uppercase text-black/20 font-black">Relational_Indicators</p>
            <div className="flex flex-wrap gap-1.5">
              {meta.friction.map((f, i) => (
                <div key={i} className="friction-marker flex items-center gap-2 px-3 py-1 bg-white/60 border border-black/5 rounded-lg">
                  <ShieldAlert size={10} className="text-red-400" />
                  <span className="text-[8px] font-mono font-black text-black/60 uppercase">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Data Stream */}
      <div className="absolute bottom-6 left-10 flex gap-12">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-mono text-black/20 uppercase tracking-[0.2em]">Processing_Strength</span>
          <span className="text-[10px] font-mono font-black text-black/60">{(security * 1.28).toFixed(2)} VAL</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-mono text-black/20 uppercase tracking-[0.2em]">Dynamic_Coefficient</span>
          <span className="text-[10px] font-mono font-black text-black/60">{style === 'Secure' ? 'STABILIZED' : 'VARIANCE_DETECTED'}</span>
        </div>
      </div>
    </div>
  );
}
