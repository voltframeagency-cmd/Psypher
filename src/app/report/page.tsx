"use client";

// Force Dynamic Rendering for useSearchParams Static Analysis
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import ReactMarkdown from "react-markdown";
import { StickyReportNav } from "@/components/ui/StickyReportNav";
import NarrativeBlock from "@/components/ui/NarrativeBlock";
import { HybridReport, PsychologyEngine } from "@/lib/psychology/scoring";
import CongruencySection from "@/components/report/CongruencySection";
import ShadowSection from "@/components/report/ShadowSection";
import ShareableSnippet from "@/components/report/ShareableSnippet";
import LinguisticReceipt from "@/components/report/LinguisticReceipt";
import PrescriptivePlaybook from "@/components/report/PrescriptivePlaybook";
import ArchitectureRadar from "@/components/report/ArchitectureRadar";
import ResonanceVector from "@/components/report/ResonanceVector";
import SpotlightCard from "@/components/ui/SpotlightCard";
import LockedStateGate from "@/components/report/LockedStateGate";
import BklitGauge from "@/components/report/BklitGauge";
import BklitNotchBar from "@/components/report/BklitNotchBar";
import { MessageCircle, Swords, Users, ShieldAlert, Share2, Target, Zap, Compass, Flame, Trophy, Crown, Shield, Scale, History, Heart, Globe, Sun, Moon } from "lucide-react";
import { ReportEngine } from "@/lib/psychology/engine";
import SchwartzCircumplex from "@/components/report/SchwartzCircumplex";
import rolesData from "@/lib/data/roles.json";
import { getBfiSemData, PRECOMPUTED_SEM, BFI_RELIABILITY_MAP } from "@/lib/psychology/psychometrics";
import ConfidenceBand from "@/components/report/ConfidenceBand";
import StressOverlay from "@/components/report/StressOverlay";
import { generateDynamics, generateCompatibilityDynamics } from "@/lib/psychology/dynamics";


// Custom Coded Minimalist SVGs for 5 Schwartz Dimensions
const HedonismIcon = ({ size = 24, className = "", ...props }: any) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={`stroke-current fill-none stroke-[1.5] ${className}`} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10" />
    <path d="M18.4 12c.9-1.8.6-4.1-1-5.7-1.6-1.6-3.9-1.9-5.7-1" />
    <path d="M12.4 18c-.9 1.8-.6 4.1 1 5.7 1.6 1.6 3.9 1.9 5.7 1" className="opacity-40" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PowerIcon = ({ size = 24, className = "", ...props }: any) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={`stroke-current fill-none stroke-[1.5] ${className}`} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="currentColor" fillOpacity="0.15" />
    <path d="M5 20h14" strokeWidth="1.5" />
    <circle cx="12" cy="14" r="1" />
  </svg>
);

const AchievementIcon = ({ size = 24, className = "", ...props }: any) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={`stroke-current fill-none stroke-[1.5] ${className}`} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M10 14.66V17h4v-2.34M12 4v10.5" />
    <path d="M8 4h8v6a4 4 0 0 1-8 0V4z" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

const SecurityIcon = ({ size = 24, className = "", ...props }: any) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={`stroke-current fill-none stroke-[1.5] ${className}`} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 6v11" strokeDasharray="2 2" />
    <circle cx="12" cy="11" r="3" />
  </svg>
);

const UniversalismIcon = ({ size = 24, className = "", ...props }: any) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={`stroke-current fill-none stroke-[1.5] ${className}`} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="currentColor" fillOpacity="0.05" />
    <path d="M2 12h20" />
  </svg>
);

const SCHWARTZ_MAP: Record<string, { label: string; icon: any; desc: string }> = {
  SelfDirection: { label: "Self-Direction", icon: Compass, desc: "Prioritizes intellectual autonomy, creative agency, and independent strategy." },
  Stimulation: { label: "Stimulation", icon: Zap, desc: "Driven by novelty, dynamic challenges, and high-velocity environments." },
  Hedonism: { label: "Hedonism", icon: HedonismIcon, desc: "Values sensory gratification, experiential flow, and work-life harmony." },
  Achievement: { label: "Achievement", icon: AchievementIcon, desc: "Motivated by competence demonstration, outperformance, and recognition." },
  Power: { label: "Power", icon: PowerIcon, desc: "Focuses on authority, status indicators, and hierarchical leverage." },
  Security: { label: "Security", icon: SecurityIcon, desc: "Prioritizes risk mitigation, stability, and long-term safety protocols." },
  Conformity: { label: "Conformity", icon: Scale, desc: "Values compliance with collective norms, predictability, and alignment." },
  Tradition: { label: "Tradition", icon: History, desc: "Respects established workflows, institutional memory, and proven rules." },
  Benevolence: { label: "Benevolence", icon: Heart, desc: "Optimizes for close-team welfare, high-trust collaboration, and support." },
  Universalism: { label: "Universalism", icon: UniversalismIcon, desc: "Focuses on systemic impact, equity, and broad-scale welfare." }
};

const SCHWARTZ_QUADRANTS = [
  {
    id: "openness",
    label: "Openness to Change",
    description: "Motivations to pursue novelty, intellectual independence, and dynamic action.",
    color: "#a855f7",
    bgLight: "rgba(168, 85, 247, 0.05)",
    borderHover: "hover:border-purple-500/30",
    borderActive: "border-purple-500/40",
    shadow: "rgba(168, 85, 247, 0.15)",
    keys: ["SelfDirection", "Stimulation", "Hedonism"]
  },
  {
    id: "enhancement",
    label: "Self-Enhancement",
    description: "Motivations for personal success, dominance, prestige, and influence.",
    color: "#f43f5e",
    bgLight: "rgba(244, 63, 94, 0.05)",
    borderHover: "hover:border-rose-500/30",
    borderActive: "border-rose-500/40",
    shadow: "rgba(244, 63, 94, 0.15)",
    keys: ["Achievement", "Power"]
  },
  {
    id: "conservation",
    label: "Conservation",
    description: "Motivations for order, self-restriction, security, and preservation of past structures.",
    color: "#06b6d4",
    bgLight: "rgba(6, 182, 212, 0.05)",
    borderHover: "hover:border-cyan-500/30",
    borderActive: "border-cyan-500/40",
    shadow: "rgba(6, 182, 212, 0.15)",
    keys: ["Security", "Conformity", "Tradition"]
  },
  {
    id: "transcendence",
    label: "Self-Transcendence",
    description: "Motivations to promote the welfare of others, close teams, and the global ecosystem.",
    color: "#10b981",
    bgLight: "rgba(16, 185, 129, 0.05)",
    borderHover: "hover:border-emerald-500/30",
    borderActive: "border-emerald-500/40",
    shadow: "rgba(16, 185, 129, 0.15)",
    keys: ["Benevolence", "Universalism"]
  }
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
}

import { supabaseAdmin } from "@/lib/supabase/admin";

// Elite Motion Constants (Cubic-Bezier)
const EASE_STANDARD = "cubic-bezier(0.2, 0.0, 0, 1.0)";
const EASE_ENTRANCE = "cubic-bezier(0.05, 0.7, 0.1, 1.0)";
const EASE_EXIT = "cubic-bezier(0.3, 0.0, 0.8, 0.15)";
const DUR_MICRO = 0.15;
const DUR_STRUCTURAL = 0.4;
const STAGGER_DEFAULT = 0.05;

// Luxe Blur Transition Settings
const BLUR_INIT = "blur(20px)";
const BLUR_FINAL = "blur(0px)";

const LoadingState = () => (
  <main className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col items-center justify-center font-mono p-12 overflow-hidden relative">
    {/* Dark Tech Grid Background */}
    <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(255,255,255,1) 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} />
    
    <div className="relative flex flex-col items-center">
      {/* Physics-Based Concentric Tech Orbit */}
      <div className="relative w-48 h-48 mb-16 flex items-center justify-center">
        {/* Outer Ring with springy rotation */}
        <div className="absolute inset-0 border border-purple-500/10 border-dashed rounded-full animate-[spin_8s_infinite_linear]" />
        
        {/* Middle Ring with elastic pulse */}
        <div className="absolute w-36 h-36 border border-purple-500/20 rounded-full animate-[elasticPulse_3s_infinite_cubic-bezier(0.25,1.5,0.5,1)]" />
        
        {/* Inner Tech Target with spring scale */}
        <div className="absolute w-24 h-24 border border-t-2 border-r-2 border-purple-500 rounded-full animate-[elasticSpin_4s_infinite_cubic-bezier(0.68,-0.55,0.27,1.55)]" />
        
        {/* Center pulsing core */}
        <div className="w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(109,40,217,0.8)] animate-[corePulse_1.5s_infinite_ease-in-out]" />
      </div>

      <div className="text-center space-y-6 relative z-10">
        <p className="text-[10px] tracking-[0.8em] font-black uppercase text-purple-400 animate-pulse">CALIBRATING_NEURAL_MAP</p>
        <div className="flex flex-col gap-2">
          <p className="text-[8px] tracking-[0.3em] font-mono text-zinc-600 uppercase">SYS_REF: PS-8821 // COMPILER: OK</p>
          <p className="text-[8px] tracking-[0.3em] font-mono text-zinc-600 uppercase">PHYSICS_ENGINE: ACTIVE // STATE: INITIALIZING</p>
        </div>
      </div>
    </div>
    
    <style jsx>{`
      @keyframes elasticPulse {
        0%, 100% { transform: scale(0.9); opacity: 0.3; }
        50% { transform: scale(1.12); opacity: 0.8; }
      }
      @keyframes elasticSpin {
        0% { transform: rotate(0deg) scale(0.9); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(0.9); }
      }
      @keyframes corePulse {
        0%, 100% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 30px rgba(109,40,217,1); }
      }
    `}</style>
  </main>
);

// Elite Motion Constants (Luxurious & Slow)
const EASE_LUXE = "cubic-bezier(0.16, 1, 0.3, 1)";
const DUR_LUXE = 2.4; 
const STAGGER_LUXE = 0.4;
const PROTOCOL_VERSION = "V1.2 // REPORT_GENERATIVE_STATE";
const SYSTEM_AUTH = "SYSTEM_IDENT_HIGH_PRECISION // DATA_ENCRYPTION_ACTIVE // Ψ";

// Stockholm Minimalism Palette (Laboratory Light)
const COLORS = {
  bg: "#FDFDFD",
  text: "#0A0A0A",
  accent: "#6D28D9",
  hairline: "rgba(0,0,0,0.05)",
  dimText: "rgba(0,0,0,0.3)",
};

// Asset Mapping for the 7 Dimensions
const DIMENSION_ASSETS: Record<string, { folder: string; icons: Record<string, string> }> = {
  bfi: {
    folder: "Big 5 SVG",
    icons: {
      Openness: "Openness.svg",
      Conscientiousness: "Conscientiousness.svg",
      Extraversion: "Extraversion.svg",
      Agreeableness: "Agreeableness.svg",
      Neuroticism: "Neuroticism.svg",
    }
  },
  attachment: {
    folder: "Attachment style SVG",
    icons: {
      "Anxious-Preoccupied": "Anxious-Preoccupied.svg",
      "Dismissive-Avoidant": "Dismissive-Avoidant.svg",
      "Fearful-Avoidant": "Fearful-Avoidant.svg",
      "Secure": "Secure.svg",
    }
  },
  darkTriad: {
    folder: "THE Dark triad SVG",
    icons: {
      Machiavellianism: "Machiavellianism.svg",
      Narcissism: "Narcissism.svg",
      Psychopathy: "Psychopathy.svg",
    }
  },
  cognitive: {
    folder: "Cognitive Functions SVG",
    icons: {
      "Adaptive Observation": "Adaptive Observation.svg",
      "Empathic Integration": "Empathic Integration.svg",
      "External Engagement": "External Engagement.svg",
      "Internal Reflector": "Internal Reflector.svg",
    }
  },
  schwartz: {
    folder: "",
    icons: {
      Hedonism: "Hedonism",
      Power: "Power",
      Achievement: "Achievement",
      Security: "Security",
      Universalism: "Universalism",
    }
  },
  resilience: {
    folder: "resilience",
    icons: {
      Durability: "Durability.svg",
      Agility: "Agility.svg",
      Focus: "Focus.svg",
    }
  }
};

// Coded Minimalist SVGs for Schwartz Dimensions and fallbacks (System 1 visual markers)
const SelfTranscendenceIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-emerald-500 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <line x1="7" y1="7" x2="10" y2="10" />
    <line x1="17" y1="7" x2="14" y2="10" />
    <line x1="7" y1="17" x2="10" y2="14" />
    <line x1="17" y1="17" x2="14" y2="14" />
  </svg>
);

const SelfEnhancementIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-rose-500 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 17l7-7 4 4 5-5" />
    <circle cx="12" cy="10" r="1" />
    <circle cx="16" cy="14" r="1" />
    <circle cx="21" cy="9" r="1" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <polyline points="10 4 12 2 14 4" />
  </svg>
);

const ConservationIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-cyan-500 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="11" r="3" />
    <line x1="12" y1="14" x2="12" y2="17" />
  </svg>
);

const OpennessToChangeIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-500 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="1.5" />
    <path d="M12 12m-6 0a6 6 0 1 0 12 0" />
    <line x1="12" y1="12" x2="18" y2="6" strokeWidth="1.5" />
  </svg>
);

const LinguisticBiomarkersIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-400 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10v4M6 6v12M9 3v18M12 8v8M15 5v14M18 7v10M21 11v2" strokeWidth="1.5" />
  </svg>
);

const ResilienceIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-400 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5Z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const GeneralCalibrationIcon = (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-400 stroke-current fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="1" x2="12" y2="23" strokeDasharray="2 2" />
    <line x1="1" y1="12" x2="23" y2="12" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.1" />
    <path d="M10 12h4M12 10v4" />
  </svg>
);

const GEN_ASSETS: Record<string, any> = {
  drivers: GeneralCalibrationIcon,
  language: LinguisticBiomarkersIcon,
  resilience: ResilienceIcon,
};

/**
 * IntelligenceRow: A minimalist, row-based display for traits.
 * This is the core of the Stockholm School layout.
 */
function IntelligenceRow({ label, value, description, color, icon, variant = "default", comparisonValue, children }: { label: string, value: number | string, description: string, color: string, icon: any, variant?: "default" | "compact" | "card", comparisonValue?: number | string, children?: React.ReactNode }) {
  const isComparison = comparisonValue !== undefined && comparisonValue !== null;
  const compValue = comparisonValue;
  const shouldInvert = typeof icon === 'string' && (icon.endsWith('.svg') || icon.includes('SVG'));

  if (variant === "card") {
    return (
      <SpotlightCard 
        glowColor="rgba(109, 40, 217, 0.08)"
        className="stagger-reveal group/card relative p-8 rounded-[2.5rem] bg-zinc-950/20 border border-zinc-900 hover:bg-zinc-900/25 hover:shadow-[0_20px_50px_rgba(109,40,217,0.08)] hover:border-zinc-800 transition-all duration-500 overflow-hidden flex flex-col justify-between h-full text-center"
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[120px] opacity-5 group-hover/card:opacity-[0.1] transition-opacity duration-1000 ${color.replace('text-', 'bg-')}`} />
        
        <div className="relative z-10 space-y-4 w-full flex-1 flex flex-col justify-between">
          <div>
            <div className="group-hover/card:scale-105 transition-all duration-700 flex justify-center py-4">
              {icon ? (
                typeof icon === 'string' ? (
                  <Image 
                    src={icon} 
                    width={128}
                    height={128}
                    unoptimized
                    className={`w-32 h-32 transition-all duration-700 object-contain drop-shadow-sm ${shouldInvert ? 'filter invert opacity-80 group-hover/card:opacity-100' : 'opacity-90'}`} 
                    alt="" 
                  />
                ) : icon
              ) : null}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <div className={`font-bold tracking-tighter text-white transition-colors ${
                  typeof value === 'string'
                    ? value.length > 15
                      ? 'text-xl md:text-2xl leading-tight'
                      : value.length > 8 
                        ? 'text-3xl md:text-4xl' 
                        : 'text-5xl md:text-6xl'
                    : 'text-5xl md:text-6xl'
                }`}>
                  {value}{typeof value === 'number' ? '%' : ''}
                </div>
                {isComparison && (
                  <>
                    <div className="w-[1.5px] h-10 bg-zinc-800 mx-3" />
                    <div className="text-3xl md:text-4xl font-bold tracking-tighter text-purple-400 opacity-80">
                      {compValue}{typeof compValue === 'number' ? '%' : ''}
                    </div>
                  </>
                )}
              </div>
              <div className="text-[10px] font-mono tracking-[0.5em] text-purple-400 uppercase font-black">
                {label}
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-normal px-4 mt-4">
              {description}
            </p>
          </div>

          {children && <div className="pt-6 w-full">{children}</div>}
        </div>
        
        {/* Progress Bar Background Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900" />
        <div 
          className="absolute bottom-0 left-0 h-[1.5px] transition-all duration-1000 ease-out group-hover/card:h-[3px] shadow-[0_0_10px_rgba(109,40,217,0.4)]" 
          style={{ 
            width: `${typeof value === 'number' ? value : 0}%`,
            backgroundColor: '#6D28D9',
          }} 
        />
      </SpotlightCard>
    );
  }

  if (variant === "compact") {
    return (
      <div className="stagger-reveal group py-10 border-b border-zinc-900 flex flex-col md:grid md:grid-cols-12 gap-8 items-center hover:bg-zinc-950/20 transition-all px-8 md:px-0">
        <div className="md:col-span-1 flex justify-center opacity-60">
           {icon ? (
             typeof icon === 'string' ? (
               <Image 
                 src={icon} 
                 width={48}
                 height={48}
                 unoptimized
                 className={`w-12 h-12 transition-all object-contain ${shouldInvert ? 'filter invert opacity-40 group-hover:opacity-100' : 'opacity-70'}`} 
                 alt="" 
               />
             ) : icon
           ) : null}
        </div>
        <div className="md:col-span-3 space-y-2 text-center md:text-left">
          <p className="text-[10px] font-mono tracking-[0.5em] text-purple-400 uppercase font-black">{label}</p>
          <p className="text-sm text-zinc-400 font-medium italic leading-tight">{description}</p>
        </div>
        <div className="md:col-span-8 w-full h-[6px] bg-zinc-900 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#6D28D9] transition-all duration-1000 origin-left"
            style={{ width: `${value}%` }} 
          />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="stagger-reveal group flex items-center justify-between py-12 border-b border-zinc-900 hover:bg-zinc-950/30 transition-all px-4 rounded-xl">
      <div className="flex items-center gap-10">
        <div className="w-24 h-24 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          {icon ? (
            typeof icon === 'string' ? (
              <Image 
                src={icon} 
                width={96}
                height={96}
                unoptimized
                className={`w-24 h-24 object-contain ${shouldInvert ? 'filter invert opacity-70 group-hover:opacity-100' : ''}`} 
                alt="" 
              />
            ) : icon
          ) : null}
        </div>
        <div className="space-y-2">
          <h4 className="text-[12px] font-mono tracking-[0.6em] text-purple-400 uppercase font-black">{label}</h4>
          <p className="text-sm text-zinc-400 font-medium max-w-md">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-bold tracking-tighter text-white group-hover:opacity-100 transition-all ${
          typeof value === 'string' && value.length > 8
            ? 'text-3xl md:text-4xl text-balance break-words max-w-[200px] inline-block'
            : 'text-6xl md:text-8xl'
        }`}>
          {value}{typeof value === 'number' ? '%' : ''}
        </span>
      </div>
    </div>
  );
}
function CognitiveSpectrum({ 
  trait, 
  value, 
  colors,
  isHovered = false,
  onMouseEnter,
  onMouseLeave
}: { 
  trait: string, 
  value: number, 
  colors: { text: string, bg: string, border: string },
  isHovered?: boolean,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void
}) {
  const opposites: Record<string, string> = {
    "Adaptive Observation": "Systemic Structure",
    "Objective Analysis": "Empathic Integration",
    "Empathic Integration": "Objective Analysis",
    "External Engagement": "Internal Reflection",
    "Internal Reflection": "External Engagement",
    "Internal Reflector": "External Action",
    "External Action": "Internal Reflector"
  };
  const opposite = opposites[trait] || "Inverse Metric";

  return (
    <div 
      className={`w-full space-y-3 mb-4 rounded-3xl p-6 transition-all duration-300 merge-theme group cursor-default ${isHovered ? 'bg-zinc-900/30 border border-zinc-800/40 shadow-sm' : 'bg-transparent border border-transparent'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`flex justify-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${colors.text.replace('text-', 'text-')} opacity-80 group-hover:opacity-100 transition-opacity`}>
        {value}% {value > 50 ? trait : opposite}
      </div>      {(() => {
        const sem = 6.0;
        const lower = Math.max(0, value - sem);
        const upper = Math.min(100, value + sem);
        return (
          <div 
            className="relative w-full h-4 flex items-center cursor-help group/spectrum"
            title={`95% CI: [${Math.max(0, Math.round(value - 1.96 * sem))}%, ${Math.min(100, Math.round(value + 1.96 * sem))}%] | SEM: ±${sem}`}
          >
            {/* Notched track background */}
            <div className="absolute inset-x-0 h-1.5 bg-zinc-950 border border-zinc-900 rounded-full flex justify-between overflow-hidden">
              {Array.from({ length: 40 }).map((_, idx) => (
                <div key={idx} className="w-[1.5px] h-full bg-zinc-800/40 last:hidden" />
              ))}
            </div>

            {/* SEM Shadow Band */}
            <div 
              className="absolute h-3.5 bg-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.4)] blur-[1px] rounded-sm transition-all duration-1000 ease-out"
              style={{ 
                left: `${lower}%`, 
                width: `${upper - lower}%` 
              }}
            />

            {/* Active Fill Track */}
            <div 
              className={`absolute h-[2.5px] transition-all duration-1000 ease-out origin-left rounded-full ${colors.bg}`}
              style={{ 
                left: 0, 
                width: `${value}%` 
              }}
            />

            {/* Tactile indicator handle */}
            <div 
              className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-zinc-950 border-[3.5px] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-out ${colors.border} scale-90 group-hover:scale-105 group-hover:shadow-[0_0_15px_var(--glow-color)] md:w-[22px] md:h-[22px]`} 
              style={{ 
                left: `calc(${value}% - 11px)`,
                "--glow-color": colors.bg.includes("cyan") ? "rgba(34,211,238,0.5)" : colors.bg.includes("amber") ? "rgba(251,191,36,0.5)" : colors.bg.includes("emerald") ? "rgba(52,211,153,0.5)" : "rgba(168,85,247,0.5)"
              } as any}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        );
      })()}
      <div className={`flex justify-between text-[8px] md:text-[9px] font-mono uppercase tracking-[0.3em] font-bold transition-opacity ${isHovered ? 'opacity-70 text-zinc-300' : 'opacity-40 text-zinc-500 group-hover:opacity-60'}`}>
        <span className={value > 50 ? "opacity-100" : ""}>{trait}</span>
        <span className={value <= 50 ? "opacity-100" : ""}>{opposite}</span>
      </div>
    </div>
  );
}

function CognitiveInteractiveSection({ scores }: { scores: any }) {
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (trait: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredTrait(trait);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTrait(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const traits = scores?.cognitive?.Functions ? Object.entries(scores.cognitive.Functions) : [];
  
  const colorSets = [
    { text: "text-cyan-400", bg: "bg-cyan-500", border: "border-cyan-500", glow: "bg-cyan-500/5" },
    { text: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500", glow: "bg-amber-500/5" },
    { text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500", glow: "bg-emerald-500/5" },
    { text: "text-purple-400", bg: "bg-purple-500", border: "border-purple-500", glow: "bg-purple-500/5" }
  ];

  const traitDescriptions: Record<string, { desc: string, icon: string }> = {
    "Adaptive Observation": { desc: "Focuses on gathering concrete, real-world data and adjusting to emerging patterns fluidly.", icon: "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg" },
    "Systemic Structure": { desc: "Prioritizes organizing information into predictable frameworks and structured methodologies.", icon: "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg" },
    "Objective Analysis": { desc: "Deconstructs problems using logical frameworks, seeking efficiency and consistent truths.", icon: "/assets/report/Cognitive Functions SVG/Empathic Integration.svg" },
    "Empathic Integration": { desc: "Synthesizes emotional feedback and collective values to form harmonious decisions.", icon: "/assets/report/Cognitive Functions SVG/Empathic Integration.svg" },
    "External Engagement": { desc: "Draws energy from outward interaction, acting upon the environment and people.", icon: "/assets/report/Cognitive Functions SVG/External Engagement.svg" },
    "Internal Reflection": { desc: "Processes deeply before acting, relying on an internal landscape of ideas and impressions.", icon: "/assets/report/Cognitive Functions SVG/Internal Reflector.svg" },
    "Internal Reflector": { desc: "Processes deeply before acting, relying on an internal landscape of ideas and impressions.", icon: "/assets/report/Cognitive Functions SVG/Internal Reflector.svg" },
    "External Action": { desc: "Draws energy from outward interaction, acting upon the environment and people.", icon: "/assets/report/Cognitive Functions SVG/External Engagement.svg" }
  };

  const getTraitPairs: Record<string, string> = {
    "Adaptive Observation": "Systemic Structure",
    "Objective Analysis": "Empathic Integration",
    "External Engagement": "Internal Reflection",
    "Internal Reflector": "External Action"
  };

  const activeTraitName = hoveredTrait || null; 
  let activeValue = 0;
  let activeOpposite = "";
  let activeColors = colorSets[0];

  if (activeTraitName) {
     activeValue = scores?.cognitive?.Functions?.[activeTraitName] || 0;
     activeOpposite = getTraitPairs[activeTraitName] || "Systemic Structure";
     const index = traits.findIndex(([t]) => t === activeTraitName);
     activeColors = colorSets[index % colorSets.length];
  }

  const identityText = scores?.cognitive?.Type?.split(' ')?.[0] || 'Strategic';

  return (
    <div 
      className="col-span-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12"
    >
      {/* Left Column: Spectrums */}
      <div className="lg:col-span-8 bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-6 md:p-12 flex flex-col justify-center shadow-sm relative overflow-hidden">
        {traits.map(([trait, val]: any, i: number) => (
          <CognitiveSpectrum 
            key={trait} 
            trait={trait} 
            value={val} 
            colors={colorSets[i % colorSets.length]} 
            onMouseEnter={() => handleMouseEnter(trait)}
            onMouseLeave={handleMouseLeave}
            isHovered={hoveredTrait === trait}
          />
        ))}
      </div>

      {/* Right Column: Identity Badge */}
      <div className={`lg:col-span-4 bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 ${activeTraitName ? 'shadow-lg scale-[1.02]' : 'shadow-sm scale-100'}`}>
         <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] transition-colors duration-500 ${activeTraitName ? activeColors.glow : 'bg-purple-900/5'}`} />
         
         <div className="relative z-10 w-full flex flex-col items-center justify-center">
           {/* Fixed Height Label */}
           <div className="h-6 flex items-center justify-center mb-2">
             {!activeTraitName ? (
               <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 font-bold transition-all opacity-100 truncate">Mind</p>
             ) : (
               <p className="text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] uppercase text-purple-400 font-bold transition-all opacity-100 truncate">
                 {activeTraitName} Sphere
               </p>
             )}
           </div>

           {/* Fixed Height Title */}
           <div className="h-20 flex items-center justify-center mb-6">
             {!activeTraitName ? (
               <h4 className="text-3xl font-bold tracking-tighter text-white leading-tight transition-all">
                 <span className="text-purple-400">92%</span><br />
                 {identityText}
               </h4>
             ) : (
               <h4 className="text-3xl font-bold tracking-tighter text-white leading-tight transition-all">
                 <span className={activeColors.text}>{activeValue > 50 ? activeValue : Math.max(100 - activeValue, 0)}%</span><br />
                 {activeValue > 50 ? activeTraitName.split(' ')[0] : activeOpposite.split(' ')[0]}
               </h4>
             )}
           </div>
           
           {/* Fixed Height Image */}
           <div className={`w-40 h-40 mb-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-4 transition-all duration-500 ${activeTraitName ? 'scale-110 opacity-100' : 'scale-100 opacity-90'}`}>
             <Image 
               src={!activeTraitName ? "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg" : (traitDescriptions[activeTraitsKey(activeTraitName, activeValue > 50)]?.icon || "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg")} 
               width={160}
               height={160}
               unoptimized
               alt="Illustration" 
               className="w-full h-full object-contain filter invert opacity-80" 
             />
           </div>
           
           {/* Fixed Height Description */}
           <div className="h-24 flex items-start justify-center mt-2">
             <p className="text-[13px] text-zinc-400 font-medium leading-relaxed max-w-[280px] transition-all">
               {!activeTraitName ? (
                 `"${scores?.cognitive?.Type || 'Strategic Architect'} profile. High-order analytical processing prioritizing systemic long-term execution."`
               ) : (
                 `You rely on ${activeValue > 50 ? traitDescriptions[activeTraitsKey(activeTraitName, activeValue > 50)]?.desc : traitDescriptions[activeTraitsKey(activeOpposite, true)]?.desc || `a strong preference towards ${activeOpposite}.`}`
               )}
             </p>
           </div>
         </div>
      </div>
    </div>
  );
}

function activeTraitsKey(trait: string, primary: boolean) {
  return trait;
}

/**
 * AnalyticalSection: Immersive vertical section with extreme white space.
 */
function AnalyticalSection({ num, title, description, children, accentColor = "text-[#6D28D9]", illustration, variant = "clinical", id, fastReveal = false }: { num: number, title: string, description: string, children: React.ReactNode, accentColor?: string, illustration?: string, variant?: "default" | "clinical" | "grid" | "heroic" | "centered" | "flipped", id?: string, fastReveal?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    gsap.fromTo(titleRef.current, 
      { opacity: 0, filter: "blur(20px)", y: 40 },
      { 
        opacity: 1, filter: "blur(0px)", y: 0, duration: fastReveal ? 1.0 : 1.8, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
      }
    );

    gsap.fromTo(sectionRef.current.querySelectorAll('.stagger-reveal'),
      { opacity: 0, filter: "blur(15px)", y: 50 },
      {
        opacity: 1, filter: "blur(0px)", y: 0, duration: fastReveal ? 1.0 : 2, stagger: fastReveal ? 0.08 : 0.2, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
      }
    );

    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, filter: "blur(15px)", y: 40 },
        {
          opacity: 1, filter: "blur(0px)", y: 0, duration: fastReveal ? 1.0 : 2, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );
      
      gsap.to(imageRef.current.querySelector('img'), {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, [variant]);

  return (
    <section ref={sectionRef} id={id || `dimension-${num}`} className="py-16 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-8 w-full space-y-16">
        <div className="text-center space-y-12 stagger-reveal">
          <div className="flex flex-col items-center gap-8">
            <span className={`text-[11px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Marker_Ref_{num} // Section_0{num}</span>
            <div className="w-[1px] h-[60px] bg-gradient-to-b from-black/20 to-transparent" />
          </div>
          <h2 ref={titleRef} className="text-5xl md:text-8xl font-bold tracking-tight text-[#0A0A0A] leading-tight uppercase max-w-4xl mx-auto">
            {title}
          </h2>
          <p className="text-2xl text-black/70 font-medium leading-relaxed max-w-2xl mx-auto px-4 italic">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 group/row">
          {children}
        </div>
      </div>
    </section>
  );
}

const MOCK_EXECUTIVE_SUMMARY = `# Executive Summary: The Architect Map
Your profile reflects a rare alignment between objective logic and long-term vision. Most professionals struggle with the "noise" of social momentum or emotional reactive cycles, but you operate with clinical precision. You do not merely participate in the market; you design the systems that define its boundaries.
# STRATEGIC_BRIEF
Your navigate high-stakes environments via a "Strategic Edge." You process social data not as emotional cues, but as variables in a logic-based equation. This allows for unmatched clarity in negotiation, but it can create an "Analytical Isolation" effect. You are building a framework in a vacuum.

# CRITICAL_RISK
If you fail to bridge this isolation, your proprietary systems will inevitably calcify. You will own the most efficient architecture in a ghost town of your own making, losing the very influence you've worked to secure..`;

const MOCK_Alpha_REPORT: HybridReport = {
  selfReport: {
    bfi: { Openness: 88, Conscientiousness: 92, Extraversion: 45, Agreeableness: 32, Neuroticism: 58 },
    darkTriad: { Machiavellianism: 84, Psychopathy: 22, Narcissism: 68 },
    attachment: { Style: "Dismissive-Avoidant", Security: 15, Anxiety: 48, Avoidance: 89 },
    cognitiveWiring: "INTJ"
  },
  cognitive: {
    Type: "INTJ Mastermind",
    Functions: {
      "Adaptive Observation": 95,
      "Objective Analysis": 42,
      "External Engagement": 65,
      "Internal Reflector": 88
    }
  },
  linguistic: {
    cognitiveComplexity: 92,
    emotionalTone: 38,
    socialOrientation: 15,
    certaintlyLanguage: 82,
    tentativeLanguage: 12,
    powerLanguage: 75,
    affiliationLanguage: 18,
    analyticalThinking: 94,
    authenticityScore: 25,
    cloakingScore: 68,
    wordCount: 452,
    avgSentenceLength: 28,
    vocabularyRichness: 72
  },
  congruency: [
    { 
      dimension: "Extraversion", 
      selfReportScore: 45, 
      linguisticScore: 15, 
      discrepancy: 30, 
      direction: "inflated", 
      interpretation: "You see yourself as more social than your language patterns suggest.", 
      evidenceSnippets: [
        "I typically prefer structural planning over team syncs to ensure speed...",
        "Most communication is handled via direct documentation to bypass meetups..."
      ] 
    },
    { 
      dimension: "Agreeableness", 
      selfReportScore: 32, 
      linguisticScore: 18, 
      discrepancy: 14, 
      direction: "aligned", 
      interpretation: "Your reported empathy aligns with language metadata.", 
      evidenceSnippets: [
        "To facilitate team progress, I worked with developers to define common ground...",
        "We should establish clarity to ensure everyone aligns on this pivot..."
      ] 
    }
  ],
  schwartz: { SelfDirection: 85, Power: 92, Achievement: 88, Hedonism: 42, Stimulation: 75, Benevolence: 22, Universalism: 35, Conformity: 15, Tradition: 12, Security: 25 },
  resilience: { Overall: 82, Durability: 85, Flexibility: 45, Recovery: 65, Resourcefulness: 88 },
  hasTextSample: true,
  overallCongruencyScore: 78
};

const MOCK_Beta_REPORT = {
  bfi: { Openness: 65, Conscientiousness: 45, Extraversion: 85, Agreeableness: 78, Neuroticism: 30 },
  darkTriad: { Machiavellianism: 35, Psychopathy: 12, Narcissism: 40 },
  attachment: { Style: "Secure", Security: 85, Anxiety: 15, Avoidance: 20 }
};

function ReportContent() {
  const [scores, setScores] = useState<HybridReport | null>(null);
  const [report, setReport] = useState<any>(null);
  const [hybridDossier, setHybridDossier] = useState<Record<string, string> | null>(null);
  const [partnerScores, setPartnerScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [clearanceCode, setClearanceCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [tier, setTier] = useState<"basic" | "deep" | "compatibility">("deep");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDevTools, setShowDevTools] = useState(false);
  const [showStressState, setShowStressState] = useState(false);

  const stressBfi = useMemo(() => {
    if (!scores?.selfReport?.bfi) return null;
    const bfi = scores.selfReport.bfi;
    return {
      Openness: Math.max(0, Math.min(100, (bfi.Openness || 50) - 8)),
      Conscientiousness: Math.max(0, Math.min(100, (bfi.Conscientiousness || 50) - 6)),
      Extraversion: Math.max(0, Math.min(100, (bfi.Extraversion || 50) - 10)),
      Agreeableness: Math.max(0, Math.min(100, (bfi.Agreeableness || 50) - 12)),
      Neuroticism: Math.max(0, Math.min(100, (bfi.Neuroticism || 50) + 15)),
    };
  }, [scores?.selfReport?.bfi]);

  const lang = searchParams.get("lang") || searchParams.get("locale") || "en";
  const dynamics = useMemo(() => {
    if (!scores?.selfReport) return null;
    const bfi = scores.selfReport.bfi || { Openness: 50, Conscientiousness: 50, Extraversion: 50, Agreeableness: 50, Neuroticism: 50 };
    const attachmentStyle = (scores.selfReport.attachment?.Style as string) || "Secure";
    const cognitiveWiring = scores.selfReport.cognitiveWiring || "INTJ";
    return generateDynamics(bfi, attachmentStyle, cognitiveWiring, lang);
  }, [scores, lang]);

  const compatibilityDynamics = useMemo(() => {
    if (!scores?.selfReport || !partnerScores) return null;
    const selfBfi = scores.selfReport.bfi || { Openness: 50, Conscientiousness: 50, Extraversion: 50, Agreeableness: 50, Neuroticism: 50 };
    const selfStyle = scores.selfReport.attachment?.Style || "Secure";
    const partnerBfi = partnerScores.bfi || { Openness: 50, Conscientiousness: 50, Extraversion: 50, Agreeableness: 50, Neuroticism: 50 };
    const partnerStyle = partnerScores.attachment?.Style || "Secure";
    return generateCompatibilityDynamics(selfBfi, selfStyle, partnerBfi, partnerStyle, lang);
  }, [scores, partnerScores, lang]);

  const type = scores?.selfReport?.cognitiveWiring || "INTJ";
  const activeRoles = (rolesData as any)[lang === "es" ? "es" : "en"] || (rolesData as any).en;
  const userRole = activeRoles[type] || { title: "Strategic Architect", desc: "" };
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [activeTab, setActiveTab] = useState<"core" | "shadow" | "sync">("core");
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);
  const [hoveredSchwartzValue, setHoveredSchwartzValue] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("psypher-theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
    }
  }, []);

  const toggleLightMode = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    localStorage.setItem("psypher-theme", nextMode ? "light" : "dark");
  };

  const dossierGroups = [
    {
      id: "core",
      label: "01 // CORE SYSTEMS",
      items: [
        { id: "overview", label: "Overview Summary", code: "TAB_01" },
        { id: "personality", label: "Personality", code: "TAB_02" }
      ]
    },
    {
      id: "shadow",
      label: "02 // SHADOW LATENCY",
      items: [
        { id: "shadow", label: "Shadow Index", code: "TAB_03" },
        { id: "playbook", label: "Prescriptive Plays", code: "TAB_07" }
      ]
    },
    {
      id: "sync",
      label: "03 // SYNC COHESION",
      items: [
        { id: "relational", label: "Relational Matrix", code: "TAB_04" },
        { id: "cognitive", label: "Cognitive Wiring", code: "TAB_05" },
        { id: "linguistics", label: "Linguistics Index", code: "TAB_06" }
      ]
    }
  ];

  const handleTierChange = (newTier: "basic" | "deep" | "compatibility") => {
    setTier(newTier);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tier", newTier);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const isDevMode = process.env.NODE_ENV === "development" || searchParams.get("dev") === "true";
    setShowDevTools(isDevMode);
  }, [searchParams]);

  useEffect(() => {
    const isDevMode = process.env.NODE_ENV === "development" || searchParams.get("dev") === "true";
    const fetchReport = async () => {
      const assessmentId = searchParams.get("id");
      const isDemo = searchParams.get("demo") === "true";
      const tierParam = searchParams.get("tier") as any;
      if (tierParam && ["basic", "deep", "compatibility"].includes(tierParam)) setTier(tierParam);
      
      const locale = searchParams.get("lang") || searchParams.get("locale") || "en";
      
      try {
        if (assessmentId) {
          const { data: assessment, error } = await supabaseAdmin
            .from("assessments")
            .select(`
              *,
              reports (*)
            `)
            .eq("id", assessmentId)
            .single();

          if (assessment && !error) {
            setIsUnlocked(assessment.status === "completed" || isDevMode);
            setClearanceCode(assessment.clearance_code);
            setExpiresAt(assessment.expires_at);
            
            let finalScores = assessment.reports?.[0]?.scores || assessment.raw_answers;
            if (finalScores) {
              // Fallback: If it's a flat raw answers object, convert it to a full HybridReport
              if (finalScores && !finalScores.selfReport && typeof finalScores === "object") {
                const textSample = assessment.reports?.[0]?.text_sample || "";
                finalScores = PsychologyEngine.generateHybridReport(finalScores, textSample, locale);
              }
              
              const summaryText = assessment.reports?.[0]?.content_text || ReportEngine.generateDeterministicExecutiveSummary(finalScores, locale);
              setReport(summaryText);

              const hybridData = await ReportEngine.assembleHybridReport(finalScores, locale);
              setHybridDossier(hybridData);

              setScores(PsychologyEngine.normalizeReport(finalScores));
            }
            
            setLoading(false);
            return;
          }
        }

        if (isDemo) {
          setScores(MOCK_Alpha_REPORT);
          setPartnerScores(MOCK_Beta_REPORT);
          setIsUnlocked(true);
          setReport(MOCK_EXECUTIVE_SUMMARY);
          setClearanceCode("VRTX-88");
          const demoExpiry = new Date();
          demoExpiry.setDate(demoExpiry.getDate() + 30);
          setExpiresAt(demoExpiry.toISOString());
          
          const hybridData = await ReportEngine.assembleHybridReport(MOCK_Alpha_REPORT, locale);
          setHybridDossier(hybridData);
          
          setLoading(false);
          return;
        }

        let storedAnswers = sessionStorage.getItem("psypher_answers");
        let storedText = sessionStorage.getItem("psypher_text_sample");

        if (!storedAnswers && isDevMode) {
          const mockAnswers: Record<number, number> = {};
          for (let i = 1; i <= 30; i++) {
            mockAnswers[i] = Math.floor(Math.random() * 5) + 1;
          }
          storedAnswers = JSON.stringify(mockAnswers);
          sessionStorage.setItem("psypher_answers", storedAnswers);

          const mockFce = {
            "opt_1": 35,
            "opt_2": 45,
            "opt_3": 20
          };
          storedText = JSON.stringify(mockFce);
          sessionStorage.setItem("psypher_text_sample", storedText);
        }
        
        if (storedAnswers) {
          let parsedText: any = storedText;
          if (storedText && (storedText.startsWith("{") || storedText.startsWith("["))) {
            try {
              parsedText = JSON.parse(storedText);
            } catch (e) {
              // ignore
            }
          }

          const computedScores = PsychologyEngine.generateHybridReport(
            JSON.parse(storedAnswers),
            parsedText,
            locale
          );

          setIsUnlocked(isDevMode);

          const execSummary = ReportEngine.generateDeterministicExecutiveSummary(computedScores, locale);
          setReport(execSummary);

          const hybridData = await ReportEngine.assembleHybridReport(computedScores, locale);
          setHybridDossier(hybridData);

          setScores(PsychologyEngine.normalizeReport(computedScores));
        }
      } catch (err) {
        console.error("Report Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [searchParams]);

  useEffect(() => {
    if (loading) return;

    const sections = ["overview", "personality"];
    if (isUnlocked && tier !== "basic") {
      sections.push("shadow", "relational", "cognitive", "linguistics", "playbook");
    } else {
      sections.push("lock-gate");
    }
    
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "lock-gate") {
            setActiveSection("shadow");
          } else {
            setActiveSection(id);
          }
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, isUnlocked, tier, activeTab]);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(containerRef.current, 
          { opacity: 0, filter: "blur(20px)" },
          { 
            opacity: 1, 
            filter: "blur(0px)",
            duration: 1.2, 
            ease: "power2.out"
          }
        );

        const reveals = containerRef.current?.querySelectorAll(".stagger-reveal");
        reveals?.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const inViewport = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;

          if (inViewport) {
            // Animate immediately if in viewport
            gsap.fromTo(el, 
              { opacity: 0, y: 30, filter: "blur(15px)", scale: 0.99 },
              { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 1.0, ease: "expo.out" }
            );
          } else {
            // Animate on scroll trigger
            gsap.fromTo(el, 
              { opacity: 0, y: 60, filter: "blur(20px)", scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                duration: 1.4,
                ease: "expo.out",
                scrollTrigger: { 
                  trigger: el, 
                  start: "top 95%",
                  once: true,
                  toggleActions: "play none none none"
                }
              }
            );
          }
        });

        // Staggered refreshes after DOM calculations settle
        const refreshTimes = [300, 800, 1500, 3000];
        refreshTimes.forEach((delay) => {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, delay);
        });

      }, containerRef);
      
      return () => ctx.revert();
    }
  }, [loading, tier, isUnlocked, activeTab]);

  if (loading) return <LoadingState />;

  const getIcon = (dimension: string, trait: string) => {
    const dim = DIMENSION_ASSETS[dimension];
    if (!dim) return GEN_ASSETS[dimension] || GeneralCalibrationIcon;
    if (dimension === "schwartz") {
      if (trait === "Hedonism") return <HedonismIcon />;
      if (trait === "Power") return <PowerIcon />;
      if (trait === "Achievement") return <AchievementIcon />;
      if (trait === "Security") return <SecurityIcon />;
      if (trait === "Universalism") return <UniversalismIcon />;
    }
    if (!dim.folder) {
      if (dimension === "schwartz") {
        if (["Universalism", "Benevolence"].includes(trait)) return SelfTranscendenceIcon;
        if (["Power", "Achievement"].includes(trait)) return SelfEnhancementIcon;
        if (["Tradition", "Conformity", "Security"].includes(trait)) return ConservationIcon;
        if (["Hedonism", "Stimulation", "SelfDirection"].includes(trait)) return OpennessToChangeIcon;
      }
      return dim.icons[trait] || GEN_ASSETS.drivers || GeneralCalibrationIcon;
    }
    return `/assets/report/${dim.folder}/${dim.icons[trait] || "default.svg"}`;
  };

  const scrollToSection = (id: string) => {
    let targetTab: "core" | "shadow" | "sync" = "core";
    if (id === "shadow" || id === "playbook") {
      targetTab = "shadow";
    } else if (["relational", "cognitive", "linguistics"].includes(id)) {
      targetTab = "sync";
    }

    const isLocked = !isUnlocked && ["shadow", "relational", "cognitive", "linguistics", "playbook"].includes(id);
    
    setActiveTab(targetTab);

    setTimeout(() => {
      const targetId = isLocked ? "lock-gate" : id;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
      }
    }, 80);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.8%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')] z-50" />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[10%] -left-32 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] animate-[float_20s_infinite_ease-in-out]" />
        <div className="absolute bottom-[20%] -right-32 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-[float_25s_infinite_ease-in-out]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-red-900/5 rounded-full blur-[90px] animate-[float_15s_infinite_ease-in-out]" />
      </div>

      <main 
        ref={containerRef}
        className={`min-h-screen font-outfit flex flex-col selection:bg-purple-600 selection:text-white transition-colors duration-500 ${
          isLightMode 
            ? "bg-[#FAFAF8] text-[#111111] light-mode" 
            : "bg-[#030303] text-zinc-100"
        }`}
      >
        <header className="sticky top-0 z-30 flex-shrink-0 px-6 py-4 flex flex-row justify-between items-center border-b border-zinc-900 bg-black/60 backdrop-blur-xl font-outfit">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
            <Image src="/logo.svg" alt="Psypher Logo" width={120} height={32} unoptimized className="h-8 w-auto invert transition-opacity duration-300 group-hover:opacity-75" />
          </div>

          <div className="flex items-center gap-6">
            {showDevTools && (
              <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 p-0.5 rounded-lg text-[8px] font-mono font-bold">
                {["basic", "deep", "compatibility"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleTierChange(lvl as any)}
                    className={`px-2.5 py-1 rounded uppercase transition-colors ${tier === lvl ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}

            {expiresAt && (
              <div className="flex items-center gap-3 px-4 py-1.5 bg-zinc-950 border border-zinc-900 rounded-full">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-mono text-zinc-400 tracking-wider">EXPIRY:</span>
                <Countdown targetDate={new Date(expiresAt)} />
              </div>
            )}
            
            <div className="flex items-center gap-3 px-4 py-1.5 bg-zinc-950 border border-zinc-900 rounded-full">
              <ShieldAlert size={10} className="text-purple-400" />
              <span className="text-[8px] font-mono text-zinc-400 tracking-wider">REF:</span>
              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">{clearanceCode || "PENDING"}</span>
            </div>

            <button 
              onClick={toggleLightMode}
              className="flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-350 transition-colors px-3 py-1 bg-zinc-900/40 border border-zinc-800/40 rounded-lg"
              title="Toggle Theme"
            >
              {isLightMode ? (
                <>
                  <Sun size={10} className="text-amber-500" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={10} className="text-purple-400" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button 
              onClick={() => window.print()}
              className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1 bg-zinc-900/40 border border-zinc-800/40 rounded-lg"
            >
              PDF
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row relative max-w-[1500px] mx-auto w-full px-6 md:px-10 py-10 gap-10 items-start">
          
          <aside className="w-full lg:w-72 hidden lg:flex flex-col justify-between p-6 bg-zinc-950/25 border border-zinc-900 rounded-[2rem] lg:sticky lg:top-24 select-none self-start h-[calc(100vh-8rem)] z-20 backdrop-blur-md">
            <div className="space-y-8">
              <div className="space-y-1">
                <span className="text-[8px] font-mono uppercase text-zinc-600 tracking-[0.2em]">INTELLIGENCE_PROFILE</span>
                <h2 className="text-2xl font-light tracking-tighter text-white uppercase">Dossier Index</h2>
              </div>

              <nav className="flex flex-col gap-5">
                {dossierGroups.map((group) => {
                  const isGroupActive = activeTab === group.id;
                  const isGroupLocked = !isUnlocked && group.id !== "core";
                  
                  return (
                    <div key={group.id} className="space-y-1.5">
                      {/* Group Header */}
                      <button
                        onClick={() => {
                          if (isGroupLocked) {
                            scrollToSection("lock-gate");
                          } else {
                            setActiveTab(group.id as any);
                            scrollToSection(group.items[0].id);
                          }
                        }}
                        className={`w-full flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] font-black pb-1.5 border-b border-zinc-900/80 text-left transition-colors duration-300 ${
                          isGroupActive ? "text-purple-400 border-purple-950/40" : "text-zinc-600 hover:text-zinc-400"
                        }`}
                      >
                        <span>{group.label}</span>
                        {isGroupLocked && (
                          <span className="text-[7px] text-red-500 font-mono tracking-normal">LOCK</span>
                        )}
                      </button>

                      {/* Group Items (Indented) */}
                      {isGroupActive && (
                        <div className="flex flex-col gap-1 pl-2 animate-[fadeIn_0.3s_ease-out]">
                          {group.items.map((item) => {
                            const active = activeSection === item.id;
                            const isBasicHidden = tier === "basic" && ["shadow", "relational", "cognitive", "linguistics", "playbook"].includes(item.id);
                            if (isBasicHidden) return null;

                            return (
                              <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-[8px] uppercase tracking-widest transition-all duration-300 font-bold text-left border ${
                                  active 
                                    ? "bg-purple-950/20 text-purple-400 border-purple-800/10" 
                                    : "text-zinc-500 hover:text-zinc-300 border-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`text-[6px] ${active ? "text-purple-400" : "text-zinc-700"}`}>
                                    {item.code}
                                  </span>
                                  <span>{item.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-900 opacity-40 hover:opacity-100 transition-opacity duration-300">
              <div className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">System Credentials</div>
              <p className="text-[8px] font-mono text-zinc-600 leading-tight">V1.2 // SECURE_DATA_ENCRYPTION_ACTIVE // Ψ</p>
            </div>
          </aside>
          <div className="flex-1 w-full space-y-12 relative bg-transparent z-0">
            {/* Command-Center Tabs Navigator */}
            <div className="relative z-20 w-full bg-zinc-950/40 border border-zinc-900 rounded-[2rem] p-2 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto stagger-reveal">
              <div className="flex flex-wrap w-full md:w-auto items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest font-black">
                {[
                  { id: "core", label: "01 // MY CORE", desc: "Core Personality" },
                  { id: "shadow", label: "02 // MY SHADOW", desc: "Shadow & Values" },
                  { id: "sync", label: "03 // OUR SYNC", desc: "Resonance & Cognitive" }
                ].map((tab) => {
                  const active = activeTab === tab.id;
                  const isLocked = !isUnlocked && (tab.id === "shadow" || tab.id === "sync");
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (isLocked) {
                          scrollToSection("lock-gate");
                        } else {
                          setActiveTab(tab.id as any);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={`relative px-6 py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden min-w-[130px] md:min-w-[160px] text-center ${
                        active 
                          ? "bg-purple-950/40 border border-purple-800/30 text-purple-400 shadow-[0_0_15px_rgba(109,40,217,0.05)]" 
                          : "text-zinc-500 hover:text-zinc-300 border border-transparent hover:bg-zinc-900/30"
                      }`}
                    >
                      <span className="text-[10px] tracking-[0.2em] font-black">{tab.label}</span>
                      <span className="text-[7px] text-zinc-500 font-mono tracking-widest mt-0.5">{tab.desc}</span>
                      {active && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                      )}
                      {isLocked && (
                        <span className="absolute top-1.5 right-1.5 text-[6px] text-red-500 font-mono bg-red-950/40 px-1 py-0.2 rounded border border-red-900/30 tracking-normal">LOCK</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Viewport status pill removed */}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
              
              {/* TAB 1: CORE */}
              {activeTab === "core" && (
                <div className="space-y-32 animate-[fadeIn_0.5s_ease-out]">
                  <section id="overview" className="scroll-mt-28 space-y-12 stagger-reveal">
                    <div className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-4">
                        <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">CORE_ANALYTICAL_NARRATIVE</span>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">
                          {tier === "compatibility" ? (lang === "es" ? "Cohesión Relacional Dinámica" : "Dynamic Relational Cohesion") : "Subject Profile Summary"}
                        </h1>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                        {tier === "compatibility" ? "COHESION_PROFILE_VERIFIED" : "CORE_DOSSIER_OPEN"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                      <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-center">
                        <NarrativeBlock theme={isLightMode ? "light" : "dark"} content={report} />
                      </div>

                      <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start bg-zinc-950/20 border border-zinc-900 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                        <div className="relative flex-shrink-0 w-[180px] h-[180px]">
                          <BklitGauge 
                            value={scores?.overallCongruencyScore || 78} 
                            centerValue={scores?.overallCongruencyScore || 78} 
                            defaultLabel="Coherence" 
                            totalNotches={45} 
                            spacing={20}
                            notchCornerRadius={1}
                            useGradient 
                            activeGradient={["#a855f7", "#6D28D9"]}
                            inactiveFill={isLightMode ? "rgba(9, 9, 11, 0.05)" : "rgba(255, 255, 255, 0.03)"}
                            width={180} 
                            height={180} 
                            theme={isLightMode ? "light" : "dark"}
                            sem={5.8}
                          />
                        </div>
                        <div className="mt-8 space-y-3 flex flex-col items-center">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Calibration Integrity</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px]">Profile metadata indicates high self-awareness and data stability.</p>
                          <ConfidenceBand 
                            score={scores?.overallCongruencyScore || 78} 
                            reliabilityKey="congruency_overall" 
                            theme={isLightMode ? "light" : "dark"} 
                            className="scale-90 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {tier === "basic" && (
                      <div className="p-10 rounded-[2.5rem] bg-zinc-950 border border-zinc-900 text-center space-y-6 relative overflow-hidden">
                        <span className="text-[9px] font-mono text-purple-500 tracking-[0.4em] uppercase font-bold">Tier clearance gate</span>
                        <h3 className="text-4xl font-light tracking-tighter text-white">Decryption Required</h3>
                        <p className="text-sm text-zinc-400 max-w-md mx-auto">Access the remaining 6 analytical segments (Shadow Profile, Relational Resonance, Cognitive Wiring) to complete the profile.</p>
                        <button onClick={() => { setIsUnlocked(true); setTier("deep"); }} className="bg-purple-600 text-white px-12 py-4 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/30">Purchase Deep scan — $29</button>
                      </div>
                    )}
                  </section>

                  <section id="personality" className="scroll-mt-28 space-y-12 stagger-reveal">
                    <div className="border-b border-zinc-900 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      <div className="space-y-4">
                        <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_02 // SYSTEMATIC_BEHAVIOR</span>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Personality Architecture</h1>
                      </div>
                      <StressOverlay active={showStressState} onChange={setShowStressState} theme={isLightMode ? "light" : "dark"} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                      <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                        <SpotlightCard glowColor="rgba(109, 40, 217, 0.05)" className="w-full h-full flex flex-col justify-center">
                          <div className="space-y-6">
                            <h3 className="text-[9px] font-mono tracking-[0.3em] uppercase text-purple-500 opacity-60">Intelligence_Analysis</h3>
                            <NarrativeBlock theme={isLightMode ? "light" : "dark"} content={hybridDossier?.personality_architecture || "Analyzing neural architecture..."} />
                          </div>
                        </SpotlightCard>
                      </div>

                      <div className="lg:col-span-4 bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <SpotlightCard glowColor="rgba(109, 40, 217, 0.06)" className="w-full h-full flex flex-col justify-between">
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-zinc-500 font-bold">Subject_profile_signature</span>
                              <h3 className="text-4xl font-light tracking-tighter text-white leading-tight">
                                {userRole.title.split(" ")[0]}<br />
                                <span className="text-[#6D28D9] font-medium">{userRole.title.split(" ").slice(1).join(" ")}</span>
                              </h3>
                            </div>
                            
                            <div className="h-[0.5px] w-full bg-zinc-800" />

                            {/* High-Tech HUD Container */}
                            <div className="bg-zinc-900/30 border border-purple-500/20 rounded-[1.5rem] p-5 relative overflow-hidden flex justify-center items-center">
                              {scores?.selfReport?.bfi && (
                                <ArchitectureRadar 
                                  data={scores.selfReport.bfi} 
                                  hoveredTrait={hoveredTrait}
                                  onHoverTrait={setHoveredTrait}
                                  showLabels={true}
                                  standalone={false}
                                  semData={getBfiSemData()}
                                  stressData={stressBfi || undefined}
                                  showStress={showStressState}
                                />
                              )}
                            </div>

                            {/* Compact BFI Traits List */}
                            <div className="space-y-4 pt-2">
                              {scores?.selfReport?.bfi && Object.entries(scores.selfReport.bfi).map(([trait, val]: any) => {
                                const isHighlighted = hoveredTrait === trait;
                                const traitKey = trait as string;
                                const displayLabel = traitKey === "Neuroticism" ? "Emotionality" : traitKey;
                                const finalVal = showStressState ? ((stressBfi as any)?.[traitKey] ?? val) : val;
                                
                                return (
                                  <div
                                    key={trait}
                                    onMouseEnter={() => setHoveredTrait(trait)}
                                    onMouseLeave={() => setHoveredTrait(null)}
                                    className={`flex flex-col gap-1.5 cursor-pointer group/row transition-all duration-300 ${
                                      isHighlighted ? "opacity-100 scale-[1.01]" : "opacity-70 hover:opacity-100"
                                    }`}
                                  >
                                    <div className="flex justify-between items-baseline text-[9px] font-mono tracking-wider font-bold">
                                      <span className={isHighlighted ? "text-purple-400" : "text-zinc-400 group-hover/row:text-zinc-300"}>
                                        {displayLabel.toUpperCase()}
                                      </span>
                                      <span className={isHighlighted ? "text-purple-400 font-extrabold" : "text-white"}>
                                        {finalVal}%
                                      </span>
                                    </div>
                                    <BklitNotchBar 
                                      value={finalVal} 
                                      sem={PRECOMPUTED_SEM[BFI_RELIABILITY_MAP[trait]] || 7.2}
                                      segments={10} 
                                      activeColor={isHighlighted ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" : "bg-purple-600 shadow-[0_0_8px_rgba(109,40,217,0.3)]"}
                                      className="h-1.5 mt-0.5"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </SpotlightCard>
                      </div>

                      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                        {scores?.selfReport?.bfi && Object.entries(scores.selfReport.bfi).map(([trait, val]: any) => {
                          const isHighlighted = hoveredTrait === trait;
                          const displayedVal = showStressState ? ((stressBfi as any)?.[trait] ?? val) : val;
                          
                          return (
                            <div
                              key={trait}
                              onMouseEnter={() => setHoveredTrait(trait)}
                              onMouseLeave={() => setHoveredTrait(null)}
                              className="h-full"
                            >
                              <SpotlightCard 
                                glowColor={isHighlighted ? "rgba(168, 85, 247, 0.15)" : "rgba(109, 40, 217, 0.08)"}
                                className={`rounded-[2rem] p-6 flex flex-col justify-between h-full group transition-all duration-500 ${
                                  isHighlighted 
                                    ? "bg-zinc-900/40 border-purple-500/50 scale-[1.03] shadow-[0_0_25px_rgba(168,85,247,0.15)]" 
                                    : "bg-zinc-950/20 border-zinc-900 hover:bg-zinc-900/10 hover:border-zinc-800"
                                }`}
                              >
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[9px] font-mono tracking-[0.15em] text-purple-400 uppercase font-black">{trait}</span>
                                    <Image src={getIcon("bfi", trait)} width={32} height={32} unoptimized className="w-8 h-8 object-contain opacity-60 invert group-hover:scale-105 transition-transform" alt="" />
                                  </div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed font-outfit">
                                    {
                                      trait === "Openness" ? "Neural potential for high-stakes innovation vs status-quo maintenance." :
                                      trait === "Conscientiousness" ? "Quality-control protocol and systemic organizational persistence." :
                                      trait === "Extraversion" ? "Social recharge velocity and independent work durability." :
                                      trait === "Agreeableness" ? "Negotiation stance—results priority vs harmony." :
                                      "Targeted environmental sensitivity and risk-mitigation radar."
                                    }
                                  </p>
                                </div>
                                
                                <div className="mt-8 space-y-4">
                                  <div>
                                    <BklitNotchBar 
                                      value={displayedVal} 
                                      sem={PRECOMPUTED_SEM[BFI_RELIABILITY_MAP[trait]] || 7.2}
                                      segments={10} 
                                      activeColor={isHighlighted ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" : "bg-purple-600 shadow-[0_0_10px_rgba(109,40,217,0.3)]"}
                                      className="mb-3 h-2"
                                    />
                                    <div className="flex items-baseline justify-between">
                                      <span className="text-3xl font-bold tracking-tighter text-white">{displayedVal}%</span>
                                      {tier === "compatibility" && partnerScores?.bfi?.[trait] !== undefined && (
                                        <span className="text-[9px] font-mono text-purple-400 font-bold">Partner: {partnerScores.bfi[trait]}%</span>
                                      )}
                                    </div>
                                  </div>
                                  <ConfidenceBand 
                                    score={displayedVal} 
                                    reliabilityKey={trait} 
                                    theme={isLightMode ? "light" : "dark"} 
                                    className="scale-90 origin-left"
                                  />
                                </div>
                              </SpotlightCard>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {hybridDossier?.vocational_vectors && (
                      <div className="col-span-full mt-8 bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                        <SpotlightCard glowColor="rgba(109, 40, 217, 0.05)" className="w-full h-full flex flex-col justify-center animate-in fade-in duration-700">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-6 h-[1px] bg-[#6D28D9]" />
                              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-purple-500 opacity-60">VOCATIONAL_ALIGNMENT // STRATEGIC_ROLE</span>
                            </div>
                            <NarrativeBlock theme={isLightMode ? "light" : "dark"} content={hybridDossier.vocational_vectors} />
                          </div>
                        </SpotlightCard>
                      </div>
                    )}

                    {dynamics && (
                      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Strengths Card */}
                        <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${
                          isLightMode 
                            ? "bg-white border-zinc-200" 
                            : "bg-zinc-950/25 border-zinc-900"
                        }`}>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest">[✓] CORE_STRENGTHS</span>
                          </div>
                          <div className="space-y-6">
                            {dynamics.strengths.map((item, index) => (
                              <div key={index} className="space-y-1.5">
                                <span className={`text-[10px] font-mono font-black tracking-wider uppercase ${isLightMode ? "text-zinc-900" : "text-white"}`}>
                                  0{index + 1} ➔ {item.title}
                                </span>
                                <p className={`text-[12px] leading-relaxed font-light ${isLightMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Weaknesses Card */}
                        <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${
                          isLightMode 
                            ? "bg-white border-zinc-200" 
                            : "bg-zinc-950/25 border-zinc-900"
                        }`}>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">[!] OPERATIONAL_WEAKNESSES</span>
                          </div>
                          <div className="space-y-6">
                            {dynamics.weaknesses.map((item, index) => (
                              <div key={index} className="space-y-1.5">
                                <span className={`text-[10px] font-mono font-black tracking-wider uppercase ${isLightMode ? "text-zinc-900" : "text-white"}`}>
                                  0{index + 1} ➔ {item.title}
                                </span>
                                <p className={`text-[12px] leading-relaxed font-light ${isLightMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Vocational Styles Card */}
                        <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${
                          isLightMode 
                            ? "bg-white border-zinc-200" 
                            : "bg-zinc-950/25 border-zinc-900"
                        }`}>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-mono font-black text-blue-500 uppercase tracking-widest">[⚙] VOCATIONAL_STYLING</span>
                          </div>
                          <div className="space-y-6">
                            {dynamics.vocationalStyles.map((item, index) => (
                              <div key={index} className="space-y-1.5">
                                <span className={`text-[10px] font-mono font-black tracking-wider uppercase ${isLightMode ? "text-zinc-900" : "text-white"}`}>
                                  0{index + 1} ➔ {item.title}
                                </span>
                                <p className={`text-[12px] leading-relaxed font-light ${isLightMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-span-full mt-8">
                      <PrescriptivePlaybook 
                        dimension="Personality Architecture"
                        score={88}
                        plays={[
                          { label: "High Openness Negotiation", script: "I see the tactical shifts happening here, and I've architected a pivot that leverages the current volatility as a primary asset.", context: "Use when the team is stuck in status-quo reactive cycles.", icon: Swords },
                          { label: "Social Bridge Protocol", script: "I acknowledge the current workflow is functional, but my analysis indicates a 20% efficiency gap if we do not integrate the upcoming neural shift.", context: "Use to lower social friction when proposing radical innovation.", icon: MessageCircle }
                        ]}
                      />
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 2: SHADOW & VALUES */}
              {activeTab === "shadow" && (
                <div className="space-y-32 animate-[fadeIn_0.5s_ease-out]">
                  {(!isUnlocked || tier === "basic") ? (
                    <>
                      <div id="lock-gate" className="scroll-mt-28 w-full">
                        <LockedStateGate onUnlock={() => { setIsUnlocked(true); setTier("deep"); }} />
                      </div>

                      <div className="blur-[40px] opacity-10 pointer-events-none select-none max-h-[450px] overflow-hidden space-y-24 border border-zinc-900/30 p-8 rounded-[2.5rem] bg-zinc-950/10">
                        <section id="shadow" className="scroll-mt-28 space-y-12">
                          <div className="border-b border-zinc-900 pb-8">
                            <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_03 // SHADOW_PROFILE</span>
                            <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">The Shadow Index</h1>
                          </div>
                          {scores?.selfReport?.darkTriad && (
                            <ShadowSection 
                              scores={scores.selfReport.darkTriad as any} 
                              partnerScores={tier === "compatibility" ? partnerScores?.darkTriad : undefined}
                              narrative={hybridDossier?.shadow_profile}
                              theme={isLightMode ? "light" : "dark"}
                            />
                          )}
                        </section>
                      </div>
                    </>
                  ) : (
                    <>
                      <section id="shadow" className="scroll-mt-28 space-y-12 stagger-reveal">
                        <div className="border-b border-zinc-900 pb-8 flex justify-between items-end">
                          <div className="space-y-4">
                            <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_03 // SHADOW_PROFILE</span>
                            <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">The Shadow Index</h1>
                          </div>
                        </div>
                        {scores?.selfReport?.darkTriad && (
                          <ShadowSection 
                            scores={scores.selfReport.darkTriad as any} 
                            partnerScores={tier === "compatibility" ? partnerScores?.darkTriad : undefined}
                            narrative={hybridDossier?.shadow_profile}
                            theme={isLightMode ? "light" : "dark"}
                          />
                        )}
                      </section>

                      <section id="playbook" className="scroll-mt-28 space-y-12 stagger-reveal">
                        {scores && (
                          <div className="space-y-12">
                            <div className="border-b border-zinc-900 pb-8 flex justify-between items-end">
                              <div className="space-y-4">
                                <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_08 // PRESCRIPTIVE_DIRECTIVES</span>
                                <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Prescriptive Plays & Drivers</h1>
                              </div>
                            </div>

                            <div className="space-y-8">
                              <div className="flex items-center gap-4">
                                <div className="w-6 h-[1px] bg-purple-500" />
                                <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase">Value Orientation Index</span>
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Visual Donut Chart HUD (Left) */}
                                <div className="lg:col-span-5 flex justify-center lg:self-start lg:sticky lg:top-28">
                                  {scores?.schwartz && (
                                    <SchwartzCircumplex 
                                      data={scores.schwartz}
                                      hoveredValue={hoveredSchwartzValue}
                                      onHoverValue={setHoveredSchwartzValue}
                                    />
                                  )}
                                </div>

                                {/* Quadrants Bento Grid (Right) */}
                                <div className="lg:col-span-7">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {SCHWARTZ_QUADRANTS.map((quad) => {
                                      const hasActiveKey = quad.keys.includes(hoveredSchwartzValue || "");
                                      return (
                                        <SpotlightCard 
                                          key={quad.id}
                                          glowColor={quad.color + "15"}
                                          className={`rounded-[2rem] p-6 bg-zinc-950/20 border transition-all duration-300 flex flex-col justify-between ${
                                            hasActiveKey 
                                              ? "bg-zinc-900/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]" 
                                              : "border-zinc-900 hover:border-zinc-800"
                                          }`}
                                          style={{
                                            borderColor: hasActiveKey ? quad.color : "rgb(24, 24, 27)"
                                          }}
                                        >
                                          <div className="space-y-4">
                                            <div className="space-y-1">
                                              <span 
                                                className="text-[9px] font-mono tracking-[0.15em] uppercase font-black"
                                                style={{ color: quad.color }}
                                              >
                                                {quad.label}
                                              </span>
                                              <p className="text-[10px] text-zinc-500 leading-normal font-outfit">
                                                {quad.description}
                                              </p>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                              {quad.keys.map((key) => {
                                                const val = scores?.schwartz?.[key] || 50;
                                                const meta = SCHWARTZ_MAP[key] || { label: key, icon: Zap, desc: "Primary driver." };
                                                const Icon = meta.icon;
                                                const isActive = hoveredSchwartzValue === key;

                                                return (
                                                  <div
                                                    key={key}
                                                    onMouseEnter={() => setHoveredSchwartzValue(key)}
                                                    onMouseLeave={() => setHoveredSchwartzValue(null)}
                                                    className="flex flex-col gap-1 cursor-pointer transition-all duration-300"
                                                  >
                                                    <div className="flex justify-between items-baseline font-mono text-[9px] font-bold">
                                                      <span className="flex items-center gap-1.5">
                                                        <Icon 
                                                          size={11} 
                                                          className="transition-colors duration-300"
                                                          style={{ color: isActive ? quad.color : "#52525b" }} 
                                                        />
                                                        <span 
                                                          className="transition-colors duration-300"
                                                          style={{ color: isActive ? "#ffffff" : "#a1a1aa" }}
                                                        >
                                                          {meta.label.toUpperCase()}
                                                        </span>
                                                      </span>
                                                      <span 
                                                        className="transition-colors duration-300"
                                                        style={{ color: isActive ? quad.color : "#71717a" }}
                                                      >
                                                        {val}%
                                                      </span>
                                                    </div>

                                                    <div className="relative w-full h-[2.5px] bg-zinc-900 rounded-full overflow-hidden mt-0.5">
                                                      <div 
                                                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                                        style={{ 
                                                          width: `${val}%`,
                                                          backgroundColor: quad.color,
                                                          boxShadow: isActive ? `0 0 8px ${quad.color}` : "none"
                                                        }}
                                                      />
                                                    </div>

                                                    <p 
                                                      className={`text-[9px] text-zinc-400 font-outfit mt-1 leading-relaxed transition-all duration-300 ${
                                                        isActive 
                                                          ? "opacity-100 max-h-12 translate-y-0" 
                                                          : "opacity-0 max-h-0 overflow-hidden -translate-y-1 pointer-events-none"
                                                      }`}
                                                    >
                                                      {meta.desc}
                                                    </p>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </SpotlightCard>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {hybridDossier?.core_drivers && (
                              <div className="bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                                <NarrativeBlock theme={isLightMode ? "light" : "dark"} content={hybridDossier.core_drivers} />
                              </div>
                            )}

                            <div className="pt-12 border-t border-zinc-900">
                              <PrescriptivePlaybook 
                                dimension="Actionable Synthesis"
                                score={84}
                                plays={[
                                  { label: "High-Context Negotiation", script: "My analysis indicates that we have an 18% efficiency gap in the current methodology. I'm proposing a structural pivot to secure long-term outcomes.", context: "Use when addressing systemic bottlenecks in professional workflows.", icon: Target },
                                  { label: "Relational Dynamics Shift", script: "I recognize the current interaction depth is functional, but my modeling shows that increasing transparency will optimize our joint integration scores.", context: "Use to shift interpersonal friction into collaborative alignment.", icon: Zap }
                                ]}
                              />
                            </div>

                            <div className="pt-12 border-t border-zinc-900">
                              <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto px-8 py-16 bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] relative overflow-hidden">
                                <div className="flex flex-col items-center text-center gap-4 relative z-10">
                                  <div className="p-3 bg-[#6D28D9]/10 rounded-2xl">
                                    <Share2 size={24} className="text-purple-400" />
                                  </div>
                                  <h2 className="text-4xl font-bold uppercase tracking-tight text-white">Export Signature</h2>
                                  <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em] max-w-md">
                                    Generate a validated cognitive signature for external review. 
                                  </p>
                                </div>

                                {scores && (
                                  <ShareableSnippet 
                                    clearanceCode={clearanceCode || "SYN-88"}
                                    summary={report?.split('\n')[0] || "Psychological profile synthesized. Analysis suggests high cognitive resilience."}
                                    traits={[
                                      { label: "Machiavellianism", value: scores.selfReport.darkTriad.Machiavellianism || 50 },
                                      { label: "Strategic_Action", value: scores.linguistic?.analyticalThinking || 50 },
                                      { label: "Status_Awareness", value: scores.linguistic?.powerLanguage || 50 }
                                    ]}
                                  />
                                )}
                                
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/5 blur-[100px] rounded-full" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/5 blur-[100px] rounded-full" />
                              </div>
                            </div>
                          </div>
                        )}
                      </section>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: RELATIONSHIPS & COGNITIVE */}
              {activeTab === "sync" && (
                <div className="space-y-32 animate-[fadeIn_0.5s_ease-out]">
                  {(!isUnlocked || tier === "basic") ? (
                    <>
                      <div id="lock-gate" className="scroll-mt-28 w-full">
                        <LockedStateGate onUnlock={() => { setIsUnlocked(true); setTier("deep"); }} />
                      </div>

                      <div className="blur-[40px] opacity-10 pointer-events-none select-none max-h-[450px] overflow-hidden space-y-24 border border-zinc-900/30 p-8 rounded-[2.5rem] bg-zinc-950/10">
                        <section id="relational" className="scroll-mt-28 space-y-12">
                          <div className="border-b border-zinc-900 pb-8">
                            <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_04 // RELATIONAL_RESONANCE</span>
                            <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Relational Resonance</h1>
                          </div>
                          {scores?.selfReport?.attachment && (
                            <ResonanceVector 
                              style={scores.selfReport.attachment.Style} 
                              security={scores.selfReport.attachment.Security} 
                              narrative={hybridDossier?.connection_blueprint}
                              showStress={showStressState}
                            />
                          )}
                        </section>
                      </div>
                    </>
                  ) : (
                    <>
                      <section id="relational" className="scroll-mt-28 space-y-12 stagger-reveal">
                        {scores?.selfReport?.attachment && (
                          <div className="space-y-12">
                            <div className="border-b border-zinc-900 pb-8 flex justify-between items-end">
                              <div className="space-y-4">
                                <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_04 // RELATIONAL_RESONANCE</span>
                                <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Relational Resonance</h1>
                              </div>
                            </div>
                            <ResonanceVector 
                              style={scores.selfReport.attachment.Style} 
                              security={scores.selfReport.attachment.Security} 
                              theme={isLightMode ? "light" : "dark"}
                              narrative={hybridDossier?.connection_blueprint}
                              showStress={showStressState}
                            />

                            {tier === "compatibility" && compatibilityDynamics && (
                              <div className="p-10 bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/5 blur-[100px] rounded-full" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/5 blur-[100px] rounded-full" />
                                
                                <div className="relative z-10 space-y-8">
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">Sync_Calibration_Report</span>
                                    <h3 className="text-4xl font-light tracking-tighter text-white">Friction_Zones</h3>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SpotlightCard 
                                      glowColor={compatibilityDynamics.cognitiveCard.glowColor}
                                      className="p-8 rounded-[2rem] bg-zinc-950 border border-zinc-900/80 space-y-4 hover:border-zinc-800 transition-all duration-300"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${compatibilityDynamics.cognitiveCard.isAlert ? "bg-red-500/10 text-red-400" : "bg-purple-500/10 text-purple-400"}`}>
                                          <Target size={16} />
                                        </div>
                                        <h4 className="text-lg font-medium text-white italic">&quot;{compatibilityDynamics.cognitiveCard.title}&quot;</h4>
                                      </div>
                                      <p className="text-xs text-zinc-400 leading-relaxed font-light font-outfit">{compatibilityDynamics.cognitiveCard.desc}</p>
                                      <div className={`h-[1px] w-full bg-gradient-to-r ${compatibilityDynamics.cognitiveCard.isAlert ? "from-red-500/30" : "from-purple-500/30"} to-transparent`} />
                                    </SpotlightCard>
                                    
                                    <SpotlightCard 
                                      glowColor={compatibilityDynamics.relationalCard.glowColor}
                                      className="p-8 rounded-[2rem] bg-zinc-950 border border-zinc-900/80 space-y-4 hover:border-zinc-800 transition-all duration-300"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${compatibilityDynamics.relationalCard.isAlert ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                                          {compatibilityDynamics.relationalCard.isAlert ? <ShieldAlert size={16} /> : <Users size={16} />}
                                        </div>
                                        <h4 className="text-lg font-medium text-white italic">&quot;{compatibilityDynamics.relationalCard.title}&quot;</h4>
                                      </div>
                                      <p className="text-xs text-zinc-400 leading-relaxed font-light font-outfit">{compatibilityDynamics.relationalCard.desc}</p>
                                      <div className={`h-[1px] w-full bg-gradient-to-r ${compatibilityDynamics.relationalCard.isAlert ? "from-red-500/30" : "from-emerald-500/30"} to-transparent`} />
                                    </SpotlightCard>
                                  </div>
                                </div>
                              </div>
                            )}

                            {dynamics && (
                              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                {/* Superpowers Card */}
                                <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${
                                  isLightMode 
                                    ? "bg-white border-zinc-200" 
                                    : "bg-zinc-950/25 border-zinc-900"
                                }`}>
                                  <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest">[+] RELATIONAL_SUPERPOWERS</span>
                                  </div>
                                  <div className="space-y-6">
                                    {dynamics.superpowers.map((item, index) => (
                                      <div key={index} className="space-y-1.5">
                                        <span className={`text-[10px] font-mono font-black tracking-wider uppercase ${isLightMode ? "text-zinc-900" : "text-white"}`}>
                                          0{index + 1} ➔ {item.title}
                                        </span>
                                        <p className={`text-[12px] leading-relaxed font-light ${isLightMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                          {item.desc}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Pitfalls Card */}
                                <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${
                                  isLightMode 
                                    ? "bg-white border-zinc-200" 
                                    : "bg-zinc-950/25 border-zinc-900"
                                }`}>
                                  <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest">[-] RELATIONSHIP_PITFALLS</span>
                                  </div>
                                  <div className="space-y-6">
                                    {dynamics.pitfalls.map((item, index) => (
                                      <div key={index} className="space-y-1.5">
                                        <span className={`text-[10px] font-mono font-black tracking-wider uppercase ${isLightMode ? "text-zinc-900" : "text-white"}`}>
                                          0{index + 1} ➔ {item.title}
                                        </span>
                                        <p className={`text-[12px] leading-relaxed font-light ${isLightMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                          {item.desc}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="col-span-full">
                              <PrescriptivePlaybook 
                                dimension="Relational Matrix"
                                score={scores.selfReport.attachment.Security || 50}
                                plays={[
                                  { label: "Conflict Neutralization", script: "I understand the friction here, but my priority is the objective security of the project. Let's recalibrate the communication map to bypass these social blockers.", context: "Use during professional disagreements to maintain high-security boundaries.", icon: ShieldAlert },
                                  { label: "Influence Bonding", script: "Your analysis aligns with my vision protocol. I'm opening a high-confidence channel for this specific negotiation.", context: "Use to build authentic alliance while maintaining control.", icon: Users }
                                ]}
                              />
                            </div>
                          </div>
                        )}
                      </section>

                      <section id="cognitive" className="scroll-mt-28 space-y-12 stagger-reveal">
                        {scores && (
                          <div className="space-y-12">
                            <div className="border-b border-zinc-900 pb-8 flex justify-between items-end">
                              <div className="space-y-4">
                                <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_05 // COGNITIVE_WIRING</span>
                                <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Cognitive Wiring</h1>
                              </div>
                            </div>

                            <div className="space-y-8">
                              <div className="bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-10 text-center">
                                <h4 className="text-4xl font-bold tracking-tighter mb-2 text-white">{scores?.selfReport?.cognitiveWiring} Architecture</h4>
                                <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">Cognitive Protocol ID</p>
                              </div>
                              
                              <div className="bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm">
                                <CognitiveInteractiveSection scores={scores} />
                              </div>

                              {hybridDossier?.cognitive_wiring && (
                                <div className="bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                                  <NarrativeBlock theme={isLightMode ? "light" : "dark"} content={hybridDossier.cognitive_wiring} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </section>

                      <section id="linguistics" className="scroll-mt-28 space-y-12 stagger-reveal">
                        {scores?.linguistic && (
                          <div className="space-y-12">
                            <div className="border-b border-zinc-900 pb-8 flex justify-between items-end">
                              <div className="space-y-4">
                                <span className="text-[8px] font-mono text-purple-400 tracking-[0.4em] uppercase font-black">DIMENSION_06 // LINGUISTIC_BIOMARKERS</span>
                                <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Linguistic Markers</h1>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {Object.entries(scores.linguistic)
                                .filter(([key, val]) => typeof val === 'number' && key !== 'wordCount' && key !== 'avgSentenceLength')
                                .map(([key, val]) => (
                                  <IntelligenceRow 
                                    key={key}
                                    label={key.replace(/([A-Z])/g, ' $1').trim()}
                                    value={val as number}
                                    color="text-purple-500"
                                    variant="card"
                                    icon={getIcon("language", "default")}
                                    description="Identified linguistic variance within clinical sample."
                                  />
                                ))
                              }
                            </div>

                            <div className="pt-12 border-t border-zinc-900 space-y-8">
                              <div className="flex items-center gap-6">
                                <span className="text-[8px] font-mono text-purple-500 tracking-[0.4em] uppercase font-bold">DIMENSION_07 // CONGRUENCY_MAPPING</span>
                                <h3 className="text-3xl font-light tracking-tight text-white">Congruency Mapping Analysis</h3>
                              </div>
                              <div className="bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-12 text-center shadow-sm">
                                <div className="max-w-3xl mx-auto space-y-6">
                                  <div className="text-[8px] tracking-[0.4em] font-mono text-purple-400 uppercase">Matrix_Synthesis</div>
                                  <p className="text-xl font-serif italic text-zinc-300 leading-relaxed max-w-[65ch] mx-auto">
                                    &quot;{hybridDossier?.congruency_logic || "Statistical synthesis in progress..."}&quot;
                                  </p>
                                </div>
                              </div>

                              {hybridDossier?.validity_audit && (
                                <div className="bg-zinc-950/20 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                                  <NarrativeBlock theme={isLightMode ? "light" : "dark"} content={hybridDossier.validity_audit} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </section>
                    </>
                  )}
                </div>
              )}
            </div>          

            <footer className="pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start gap-12 opacity-25 mt-20 pb-8 text-zinc-400">
              <div className="space-y-4">
                <div className="flex gap-10 text-[8px] font-mono uppercase tracking-[0.4em]">
                  <span className="text-purple-400">Proprietary</span>
                  <span>Ref: PS-SYN-8821</span>
                </div>
                <p className="text-[8px] font-mono leading-relaxed uppercase tracking-[0.2em] max-w-xs">
                  For clinical evaluation only. Internal synthesis of subject-level data.
                </p>
              </div>
              <div className="w-full md:w-auto flex justify-center md:justify-end opacity-60">
                 <span className="text-[8px] font-mono tracking-[0.6em] uppercase font-bold text-center md:text-right">
                   SYSTEM_IDENT_HIGH_PRECISION // DATA_ENCRYPTION_ACTIVE // Ψ
                 </span>
              </div>
            </footer>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .report-markdown h1 { font-size: 4rem; color: #ffffff; line-height: 0.95; margin-bottom: 3rem; letter-spacing: -0.04em; font-weight: 800; text-transform: uppercase; }
        .report-markdown h2 { font-size: 1.1rem; color: #c084fc; margin-top: 5rem; margin-bottom: 2rem; font-family: monospace; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
        .report-markdown p { margin-bottom: 2.5rem; line-height: 1.6; font-weight: 400; font-size: 1.35rem; tracking: -0.01em; color: rgba(255,255,255,0.75); }
        .report-markdown strong { color: #ffffff; font-weight: 800; }
        
        /* Premium light mode styling overrides */
        .light-mode {
          background-color: #FAFAF8 !important;
          color: #1c1917 !important;
        }
        
        .light-mode header {
          background-color: rgba(250, 250, 248, 0.8) !important;
          border-color: #e4e4e7 !important;
        }
        
        .light-mode header img.invert {
          filter: brightness(0.08) !important;
        }
        
        .light-mode aside {
          background-color: rgba(255, 255, 255, 0.6) !important;
          border-color: #e4e4e7 !important;
          box-shadow: 0 10px 30px rgba(9, 9, 11, 0.02) !important;
        }
        
        .light-mode aside h2,
        .light-mode h1,
        .light-mode h2,
        .light-mode h3,
        .light-mode h4,
        .light-mode h5,
        .light-mode h6 {
          color: #09090b !important;
        }
        
        .light-mode aside button {
          color: #71717a !important;
        }
        
        .light-mode aside button:hover {
          color: #09090b !important;
        }
        
        .light-mode aside button[class*="text-purple-400"] {
          color: #7c3aed !important;
          border-color: rgba(124, 58, 237, 0.2) !important;
        }
        
        .light-mode aside button[class*="bg-purple-950/20"] {
          background-color: rgba(124, 58, 237, 0.08) !important;
          color: #7c3aed !important;
          border-color: rgba(124, 58, 237, 0.1) !important;
        }
        
        .light-mode aside div[class*="border-t"],
        .light-mode aside p {
          border-color: #e4e4e7 !important;
          color: #a1a1aa !important;
        }
        
        .light-mode div[class*="bg-zinc-950/40"] {
          background-color: rgba(255, 255, 255, 0.65) !important;
          border-color: #e4e4e7 !important;
          box-shadow: 0 10px 30px rgba(9, 9, 11, 0.02) !important;
        }
        
        .light-mode div[class*="bg-zinc-950/40"] button {
          color: #71717a !important;
        }
        
        .light-mode div[class*="bg-zinc-950/40"] button:hover {
          color: #09090b !important;
          background-color: rgba(9, 9, 11, 0.03) !important;
        }
        
        .light-mode div[class*="bg-zinc-950/40"] button[class*="bg-purple-950/40"] {
          background-color: rgba(124, 58, 237, 0.08) !important;
          border-color: rgba(124, 58, 237, 0.15) !important;
          color: #7c3aed !important;
        }
        
        .light-mode div[class*="bg-zinc-950/40"] button[class*="bg-purple-950/40"] span {
          color: #7c3aed !important;
        }
        
        .light-mode div[class*="bg-zinc-950/40"] button span[class*="text-zinc-500"] {
          color: #a1a1aa !important;
        }
        
        .light-mode div[class*="bg-zinc-950/60"] {
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-color: #e4e4e7 !important;
          color: #71717a !important;
        }
        
        .light-mode div[class*="bg-zinc-950"] {
          background-color: #f4f4f5 !important;
          border-color: #e4e4e7 !important;
          color: #27272a !important;
        }
        
        .light-mode div[class*="bg-zinc-950"] span[class*="text-zinc-400"] {
          color: #71717a !important;
        }
        
        .light-mode div[class*="border-zinc-900"],
        .light-mode section[class*="border-zinc-900"],
        .light-mode div[class*="border-t-zinc-900"],
        .light-mode div[class*="border-b-zinc-900"] {
          border-color: #e4e4e7 !important;
        }
        
        .light-mode div[class*="bg-zinc-950/20"],
        .light-mode div[class*="bg-zinc-950/40"],
        .light-mode div[class*="bg-zinc-950/25"],
        .light-mode section[class*="bg-zinc-950/20"],
        .light-mode section[class*="bg-zinc-950/40"],
        .light-mode .spotlight-card,
        .light-mode .congruency-row {
          background-color: rgba(255, 255, 255, 0.85) !important;
          border-color: #e4e4e7 !important;
          box-shadow: 0 10px 30px rgba(9, 9, 11, 0.02) !important;
        }
        
        .light-mode div[class*="bg-zinc-950/20"]:hover,
        .light-mode div[class*="bg-zinc-950/40"]:hover,
        .light-mode .congruency-row:hover {
          background-color: #ffffff !important;
          border-color: #d4d4d8 !important;
        }
        
        .light-mode .text-zinc-100 {
          color: #18181b !important;
        }
        .light-mode .text-zinc-300 {
          color: #27272a !important;
        }
        .light-mode .text-zinc-400 {
          color: #71717a !important;
        }
        .light-mode .text-zinc-500 {
          color: #71717a !important;
        }
        .light-mode .text-zinc-600 {
          color: #a1a1aa !important;
        }
        
        .light-mode div[class*="bg-zinc-900/40"] {
          background-color: #ffffff !important;
          border-color: rgba(168, 85, 247, 0.3) !important;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.06) !important;
        }
        
        .light-mode div[class*="bg-zinc-900/40"] span {
          color: #7c3aed !important;
        }
        
        .light-mode div[class*="bg-zinc-900/30"] {
          background-color: #fcfbfa !important;
          border-color: rgba(168, 85, 247, 0.15) !important;
        }
        
        .light-mode img.invert {
          filter: none !important;
        }
        
        .light-mode div[class*="bg-[#030303]/90"] {
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-color: #e4e4e7 !important;
        }
        
        .light-mode div[class*="bg-[#030303]/90"] span[class*="text-white"] {
          color: #09090b !important;
        }
        
        .light-mode span[style*="color: rgb(255, 255, 255)"] {
          color: #09090b !important;
        }
        
        .light-mode span[class*="text-white"] {
          color: #09090b !important;
        }
        
        .light-mode::selection {
          background-color: rgba(168, 85, 247, 0.15) !important;
          color: #7c3aed !important;
        }
        
        @media print {
          header, aside, button, footer { display: none !important; }
          main { background: white !important; color: black !important; }
          .report-markdown h1 { font-size: 2.5rem !important; color: black !important; }
          .light-mode {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </>
  );
}

// --- Countdown Helper ---
function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}D ${hours}H ${minutes}M`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="text-[10px] font-mono font-black text-red-500">{timeLeft}</span>;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReportContent />
    </Suspense>
  );
}
