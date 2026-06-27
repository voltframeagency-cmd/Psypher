"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldAlert, Activity, Radio } from "lucide-react";
import BklitGauge from "@/components/report/BklitGauge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ResonanceVectorProps {
  style: string;
  security: number;
  color?: string;
  theme?: "light" | "dark";
}

export default function ResonanceVector({ style, security, color = "#60A5FA", theme = "dark" }: ResonanceVectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rv-reveal", 
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { 
          opacity: 1, y: 0, filter: "blur(0px)", 
          duration: 1.2, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
        }
      );
      gsap.fromTo(".friction-marker", 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.5, ease: "back.out(1.7)" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [security]);

  const styleMapping: Record<string, { label: string; subtitle: string; desc: string; friction: { tag: string; severity: "low" | "medium" | "high" }[]; signal: string }> = {
    "Secure": { 
      label: "Integrated Base", 
      subtitle: "Optimal Relational Architecture",
      desc: "High-integrity interpersonal integration with optimized interaction depth. Your attachment protocol enables authentic, low-friction bonding across professional and personal domains.",
      friction: [
        { tag: "Low Conflict Sensitivity", severity: "low" },
        { tag: "Transparent Signaling", severity: "low" }
      ],
      signal: "STABILIZED"
    },
    "Anxious-Preoccupied": { 
      label: "Vigilance Protocol", 
      subtitle: "Heightened Sensitivity Architecture",
      desc: "Enhanced sensitivity to attachment transitions and interpersonal volatility. Your system operates with amplified proximity-seeking mechanisms, creating strong but dependency-prone bonds.",
      friction: [
        { tag: "Reassurance Dependency", severity: "high" },
        { tag: "Signal Noise Amplification", severity: "medium" }
      ],
      signal: "ELEVATED_SCAN"
    },
    "Dismissive-Avoidant": { 
      label: "Independent Processing", 
      subtitle: "Self-Regulated Operations Model",
      desc: "Reduced interpersonal reliance for self-regulated operational outcomes. Your architecture prioritizes autonomy over attachment depth, enabling decisive action but limiting relational bandwidth.",
      friction: [
        { tag: "Interaction Minimalism", severity: "medium" },
        { tag: "Proximity Resistance", severity: "high" }
      ],
      signal: "VARIANCE_DETECTED"
    },
    "Fearful-Avoidant": { 
      label: "Dissonant Mapping", 
      subtitle: "Approach-Avoidance Oscillation",
      desc: "Conflict between interpersonal desire and threat anticipation. Your system produces contradictory signals — simultaneously seeking and retreating from relational depth.",
      friction: [
        { tag: "Variable Signaling", severity: "high" },
        { tag: "Internal Retreat Dynamics", severity: "high" }
      ],
      signal: "OSCILLATING"
    }
  };

  const meta = styleMapping[style] || styleMapping["Secure"];
  const isLight = theme === "light";

  const severityColors = {
    low: { bg: isLight ? "bg-emerald-50 border-emerald-200/60" : "bg-emerald-500/10 border-emerald-500/20", text: isLight ? "text-emerald-700" : "text-emerald-400", dot: "bg-emerald-500" },
    medium: { bg: isLight ? "bg-amber-50 border-amber-200/60" : "bg-amber-500/10 border-amber-500/20", text: isLight ? "text-amber-700" : "text-amber-400", dot: "bg-amber-500" },
    high: { bg: isLight ? "bg-red-50 border-red-200/60" : "bg-red-500/10 border-red-500/20", text: isLight ? "text-red-700" : "text-red-400", dot: "bg-red-500" },
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-8">
      {/* Hero Card — Attachment Style + Gauge */}
      <div className={`relative overflow-hidden rounded-[2.5rem] border transition-colors duration-500 ${
        isLight 
          ? "bg-gradient-to-br from-white via-blue-50/30 to-white border-zinc-200/80 shadow-[0_8px_40px_rgba(59,130,246,0.04)]" 
          : "bg-gradient-to-br from-zinc-950/80 via-blue-950/10 to-zinc-950/80 border-zinc-800/60"
      }`}>
        {/* Ambient glow */}
        <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${
          isLight ? "bg-blue-200/20" : "bg-blue-500/5"
        }`} />
        <div className={`absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${
          isLight ? "bg-purple-200/10" : "bg-purple-500/5"
        }`} />

        <div className="relative z-10 p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: SVG Illustration */}
            <div className="lg:col-span-4 flex justify-center rv-reveal">
              <div className={`relative w-48 h-48 md:w-56 md:h-56 rounded-[2rem] flex items-center justify-center transition-colors ${
                isLight ? "bg-blue-50/60" : "bg-white/[0.03]"
              }`}>
                <img 
                  src={`/assets/report/Attachment style SVG/${style}.svg`} 
                  alt={meta.label} 
                  className={`w-40 h-40 md:w-48 md:h-48 object-contain transition-all duration-700 hover:scale-105 ${
                    isLight ? "drop-shadow-sm" : "filter brightness-110"
                  }`}
                />
              </div>
            </div>

            {/* Center: Style Identity */}
            <div className="lg:col-span-5 space-y-5 rv-reveal">
              <div className="space-y-2">
                <span className={`text-[9px] font-mono tracking-[0.4em] uppercase font-black ${
                  isLight ? "text-blue-600/70" : "text-blue-400/60"
                }`}>
                  Attachment_Protocol
                </span>
                <h3 className={`text-3xl md:text-4xl font-bold tracking-tighter leading-tight ${
                  isLight ? "text-zinc-900" : "text-white"
                }`}>
                  {meta.label}
                </h3>
                <p className={`text-[11px] font-mono tracking-widest uppercase ${
                  isLight ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  {meta.subtitle}
                </p>
              </div>

              <p className={`text-sm leading-relaxed font-light ${
                isLight ? "text-zinc-500" : "text-zinc-400"
              }`}>
                {meta.desc}
              </p>

              {/* Friction Indicators */}
              <div className="flex flex-wrap gap-2 pt-2">
                {meta.friction.map((f, i) => {
                  const sev = severityColors[f.severity];
                  return (
                    <div key={i} className={`friction-marker flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all ${sev.bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${sev.text}`}>
                        {f.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Security Gauge */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center rv-reveal">
              <div className="w-36 h-36 md:w-44 md:h-44">
                <BklitGauge 
                  value={security} 
                  centerValue={security} 
                  defaultLabel="Trust" 
                  totalNotches={24} 
                  spacing={22}
                  notchCornerRadius={1.5}
                  useGradient 
                  activeGradient={["#3b82f6", "#6366f1"]}
                  inactiveFill={isLight ? "rgba(59, 130, 246, 0.06)" : "rgba(59, 130, 246, 0.04)"}
                  width={isWindowMd() ? 176 : 144} 
                  height={isWindowMd() ? 176 : 144} 
                  theme={theme}
                />
              </div>
              <div className={`mt-3 flex items-center gap-2 px-3 py-1 rounded-full border ${
                isLight 
                  ? "bg-zinc-50 border-zinc-200" 
                  : "bg-zinc-900 border-zinc-800"
              }`}>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className={`text-[8px] font-mono tracking-widest font-black uppercase ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}>
                  {meta.signal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 rv-reveal`}>
        {[
          { label: "Processing Strength", value: `${(security * 1.28).toFixed(1)} VAL` },
          { label: "Dynamic Coefficient", value: meta.signal },
          { label: "Relational Bandwidth", value: `${Math.min(100, Math.round(security * 1.15))}%` },
          { label: "Conflict Threshold", value: security >= 60 ? "HIGH" : security >= 35 ? "MODERATE" : "LOW" },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border transition-colors ${
            isLight 
              ? "bg-white/80 border-zinc-200/60" 
              : "bg-white/[0.02] border-zinc-800/60"
          }`}>
            <span className={`text-[8px] font-mono uppercase tracking-[0.2em] ${
              isLight ? "text-zinc-400" : "text-zinc-600"
            }`}>
              {stat.label}
            </span>
            <div className={`text-sm font-mono font-black mt-1 ${
              isLight ? "text-zinc-700" : "text-zinc-300"
            }`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Lightweight check — avoids SSR crashes. Used only for the gauge dimension. */
function isWindowMd(): boolean {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= 768;
}
