"use client";

import { useRef, useEffect } from "react";
import { MessageCircle, Swords, Target, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface PlaybookAction {
  label: string;
  script: string;
  context: string;
  icon: any;
}

interface PrescriptivePlaybookProps {
  dimension: string;
  score: number;
  plays: PlaybookAction[];
}

export default function PrescriptivePlaybook({ dimension, score, plays }: PrescriptivePlaybookProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".play-card", 
        { 
          opacity: 0, 
          y: 40,
          rotateX: -15,
          scale: 0.95
        },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          scale: 1,
          duration: 1.2, 
          stagger: 0.2, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mt-20 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="w-8 h-[1px] bg-[#6D28D9]" />
          <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-[#6D28D9] font-black">PRESCRIPTIVE_APPLICATION_INDEX</span>
        </div>
        <h3 className="text-4xl font-bold tracking-tighter text-white uppercase">{dimension}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plays.map((play, i) => (
          <div 
            key={i}
            className="play-card group relative p-5 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-zinc-700/50 transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Analytical Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(255,255,255,1) 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} />
            
            {/* Header Metadata */}
            <div className="relative z-10 flex justify-between items-center mb-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-purple-400 group-hover:scale-110 transition-transform duration-500">
                  <play.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/20 font-black">ANALYTICAL_APPLICATION</span>
                  <span className="text-[10px] font-mono font-bold text-white/60 tracking-widest">{play.label}</span>
                </div>
              </div>
              <div className="text-[8px] font-mono text-white/10 group-hover:text-white/30 transition-colors">IND_REF: PS-SSI-{i+1}</div>
            </div>

            <div className="relative z-10 space-y-5">
              {/* Script Body */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.03] relative group-hover:bg-white/[0.04] transition-all">
                <p className="font-mono text-sm md:text-base text-zinc-300 leading-relaxed italic">
                  &quot;{play.script}&quot;
                </p>
                <div className="absolute top-4 right-4 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                  <Zap size={14} fill="currentColor" />
                </div>
              </div>
              
              {/* Contextual Alignment */}
              <div className="flex gap-6 items-start">
                <div className="mt-1 h-[0.5px] w-12 bg-white/10" />
                <div className="space-y-1.5">
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-purple-400/60 font-black flex items-center gap-2">
                    <Target size={10} /> Contextual_Dynamics
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed font-light font-outfit max-w-[90%]">
                    {play.context}
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence Seal */}
            <div className="absolute -bottom-1 -right-1 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-1000">
               <ShieldCheck size={120} strokeWidth={0.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
