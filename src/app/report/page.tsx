"use client";

// Force Dynamic Rendering for useSearchParams Static Analysis
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import ReactMarkdown from "react-markdown";
import { StickyReportNav } from "@/components/ui/StickyReportNav";
import NarrativeBlock from "@/components/ui/NarrativeBlock";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
}

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
  <main className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] flex flex-col items-center justify-center font-mono p-12 overflow-hidden">
    <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
         style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(0,0,0,1) 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
    
    <div className="relative">
      <div className="w-1 h-32 bg-black/5 relative overflow-hidden mb-12 mx-auto">
         <div className="absolute top-0 left-0 w-full bg-[#6D28D9] h-1/2 animate-[shimmer_1.5s_infinite_linear]" />
      </div>
      <div className="text-center space-y-6">
        <p className="text-[9px] tracking-[0.8em] font-black uppercase text-[#6D28D9] animate-pulse">Syncing_Neural_Map</p>
        <div className="flex flex-col gap-2">
          <p className="text-[8px] tracking-[0.3em] font-mono text-black/20 uppercase">PROTOCOL: PS-SYN-8821</p>
          <p className="text-[8px] tracking-[0.3em] font-mono text-black/20 uppercase">TARGET_LOC: SCR_SCR_01</p>
        </div>
      </div>
    </div>
    
    <style jsx>{`
      @keyframes shimmer {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(200%); }
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
  }
};

const GEN_ASSETS: Record<string, string> = {
  drivers: "/assets/report/drivers.png",
  language: "/assets/report/language.png",
  resilience: "/assets/report/resilience.png",
};

/**
 * IntelligenceRow: A minimalist, row-based display for traits.
 * This is the core of the Stockholm School layout.
 */
function IntelligenceRow({ label, value, description, color, icon, variant = "default", comparisonValue }: { label: string, value: number | string, description: string, color: string, icon: any, variant?: "default" | "compact" | "card", comparisonValue?: number | string }) {
  const isComparison = comparisonValue !== undefined && comparisonValue !== null;
  const compValue = comparisonValue;
  
  if (variant === "card") {
    return (
      <div className="stagger-reveal group/card relative p-12 rounded-[4rem] bg-black/[0.02] border border-black/5 backdrop-blur-xl transition-all duration-700 hover:bg-white/60 hover:shadow-[0_0_80px_rgba(0,0,0,0.03)] hover:scale-[1.02] hover:-translate-y-4 overflow-hidden flex flex-col items-center text-center group-hover/row:opacity-40 group-hover/row:blur-sm hover:!opacity-100 hover:!blur-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[120px] opacity-10 group-hover/card:opacity-[0.15] transition-opacity duration-1000 ${color.replace('text-', 'bg-')}`} />
        
        <div className="relative z-10 space-y-12 w-full">
          <div className="group-hover/card:scale-110 transition-all duration-1000 flex justify-center">
            {icon ? (typeof icon === 'string' ? <img src={icon} className={`w-56 h-56 transition-all duration-700 object-contain drop-shadow-sm group-hover/card:drop-shadow-[0_0_40px_rgba(109,40,217,0.5)]`} alt="" /> : icon) : null}
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className={`font-bold tracking-tighter text-[#0A0A0A] transition-colors ${
                typeof value === 'string'
                  ? value.length > 15
                    ? 'text-2xl md:text-3xl leading-tight text-balance px-2'
                    : value.length > 8 
                      ? 'text-4xl md:text-5xl leading-tight text-balance px-2' 
                      : 'text-7xl md:text-8xl'
                  : 'text-7xl md:text-8xl'
              }`}>
                {value}{typeof value === 'number' ? '%' : ''}
              </div>
              {isComparison && (
                <>
                  <div className="w-[2px] h-16 bg-black/10 mx-4" />
                  <div className="text-4xl md:text-6xl font-bold tracking-tighter text-[#6D28D9] opacity-60">
                    {compValue}{typeof compValue === 'number' ? '%' : ''}
                  </div>
                </>
              )}
            </div>
            <div className="text-[12px] font-mono tracking-[0.6em] text-[#6D28D9] transition-colors uppercase font-black">
              {label}
            </div>
          </div>

          <p className="text-sm text-black/80 leading-relaxed font-normal px-8 group-hover:card:text-black transition-colors">
            {description}
          </p>
        </div>
        
        {/* Progress Bar Background Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/5 group-hover/card:bg-white/10" />
        <div 
          className="absolute bottom-0 left-0 h-[1.5px] transition-all duration-1000 ease-out group-hover/card:h-[3px] shadow-[0_0_10px_currentColor]" 
          style={{ 
            width: `${typeof value === 'number' ? value : 0}%`,
            backgroundColor: '#6D28D9',
          }} 
        />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="stagger-reveal group py-10 border-b border-black/5 flex flex-col md:grid md:grid-cols-12 gap-8 items-center hover:bg-black/[0.01] transition-all px-8 md:px-0">
        <div className="md:col-span-1 flex justify-center opacity-60">
           {icon ? (typeof icon === 'string' ? <img src={icon} className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all object-contain" alt="" /> : icon) : null}
        </div>
        <div className="md:col-span-3 space-y-2 text-center md:text-left">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#6D28D9] uppercase font-black">{label}</p>
          <p className="text-sm text-black/70 font-medium italic leading-tight">{description}</p>
        </div>
        <div className="md:col-span-8 w-full h-[6px] bg-black/5 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#6D28D9] transition-all duration-1000 origin-left"
            style={{ width: `${value}%` }} 
          />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-black/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="stagger-reveal group flex items-center justify-between py-12 border-b border-black/10 hover:bg-black/[0.02] transition-all px-4 rounded-xl">
      <div className="flex items-center gap-10">
        <div className="w-16 h-16 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          {icon ? (typeof icon === 'string' ? <img src={icon} className="w-16 h-16 object-contain" alt="" /> : icon) : null}
        </div>
        <div className="space-y-2">
          <h4 className="text-[12px] font-mono tracking-[0.6em] text-[#6D28D9] uppercase font-black">{label}</h4>
          <p className="text-sm text-black/70 font-medium max-w-md">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-bold tracking-tighter text-[#0A0A0A] group-hover:opacity-100 transition-all ${
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
    "Empathic Integration": "Objective Analysis",
    "External Engagement": "Internal Reflection",
    "Internal Reflector": "External Action"
  };
  const opposite = opposites[trait] || "Inverse Metric";

  return (
    <div 
      className={`w-full space-y-3 mb-4 rounded-3xl p-6 transition-all duration-300 stagger-reveal group cursor-default ${isHovered ? 'bg-[#F3F4F6] shadow-sm' : 'bg-transparent'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`flex justify-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${colors.text} opacity-80 group-hover:opacity-100 transition-opacity`}>
        {value}% {value > 50 ? trait : opposite}
      </div>
      <div className="relative w-full h-[6px] bg-black/5 rounded-full overflow-visible">
         <div className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-out origin-left rounded-full ${colors.bg}`} style={{ width: `${value}%` }} />
         <div 
           className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-white border-[3.5px] rounded-full shadow-sm transition-all duration-1000 ease-out ${colors.border} scale-90 group-hover:scale-110 md:w-6 md:h-6`} 
           style={{ left: `calc(${value}% - 10px)` }}
         />
      </div>
      <div className={`flex justify-between text-[8px] md:text-[9px] font-mono uppercase tracking-[0.3em] font-bold transition-opacity ${isHovered ? 'opacity-60 text-black' : 'opacity-30 text-black group-hover:opacity-50'}`}>
        <span className={value > 50 ? "opacity-100" : ""}>{trait}</span>
        <span className={value <= 50 ? "opacity-100" : ""}>{opposite}</span>
      </div>
    </div>
  );
}

function CognitiveInteractiveSection({ scores }: { scores: any }) {
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);

  const traits = scores?.cognitive?.Functions ? Object.entries(scores.cognitive.Functions) : [];
  
  const colorSets = [
    { text: "text-cyan-600", bg: "bg-cyan-500", border: "border-cyan-500", glow: "bg-cyan-500/10" },
    { text: "text-amber-600", bg: "bg-amber-500", border: "border-amber-500", glow: "bg-amber-500/10" },
    { text: "text-emerald-600", bg: "bg-emerald-500", border: "border-emerald-500", glow: "bg-emerald-500/10" },
    { text: "text-purple-600", bg: "bg-purple-500", border: "border-purple-500", glow: "bg-purple-500/10" }
  ];

  const traitDescriptions: Record<string, { desc: string, icon: string }> = {
    "Adaptive Observation": { desc: "Focuses on gathering concrete, real-world data and adjusting to emerging patterns fluidly.", icon: "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg" },
    "Systemic Structure": { desc: "Prioritizes organizing information into predictable frameworks and structured methodologies.", icon: "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg" },
    "Empathic Integration": { desc: "Synthesizes emotional feedback and collective values to form harmonious decisions.", icon: "/assets/report/Cognitive Functions SVG/Empathic Integration.svg" },
    "Objective Analysis": { desc: "Deconstructs problems using logical frameworks, seeking efficiency and consistent truths.", icon: "/assets/report/Cognitive Functions SVG/Empathic Integration.svg" },
    "External Engagement": { desc: "Draws energy from outward interaction, acting upon the environment and people.", icon: "/assets/report/Cognitive Functions SVG/External Engagement.svg" },
    "Internal Reflection": { desc: "Processes deeply before acting, relying on an internal landscape of ideas and impressions.", icon: "/assets/report/Cognitive Functions SVG/External Engagement.svg" },
    "Internal Reflector": { desc: "Processes deeply before acting, relying on an internal landscape of ideas and impressions.", icon: "/assets/report/Cognitive Functions SVG/External Engagement.svg" },
    "External Action": { desc: "Draws energy from outward interaction, acting upon the environment and people.", icon: "/assets/report/Cognitive Functions SVG/External Engagement.svg" }
  };

  const getTraitPairs: Record<string, string> = {
    "Adaptive Observation": "Systemic Structure",
    "Empathic Integration": "Objective Analysis",
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
      <div className="lg:col-span-8 bg-white border border-black/[0.03] rounded-[3rem] p-6 md:p-12 flex flex-col justify-center shadow-sm relative overflow-hidden">
        {traits.map(([trait, val]: any, i: number) => (
          <CognitiveSpectrum 
            key={trait} 
            trait={trait} 
            value={val} 
            colors={colorSets[i % colorSets.length]} 
            onMouseEnter={() => setHoveredTrait(trait)}
            onMouseLeave={() => setHoveredTrait(null)}
            isHovered={hoveredTrait === trait}
          />
        ))}
      </div>

      {/* Right Column: Identity Badge */}
      <div className={`lg:col-span-4 bg-[#F8F9FA] border border-black-[0.03] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 ${activeTraitName ? 'shadow-lg scale-[1.02]' : 'shadow-sm scale-100'}`}>
         <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] transition-colors duration-500 ${activeTraitName ? activeColors.glow : 'bg-amber-500/5'}`} />
         
         <div className="relative z-10 w-full flex flex-col items-center justify-center">
           {/* Fixed Height Label */}
           <div className="h-6 flex items-center justify-center mb-2">
             {!activeTraitName ? (
               <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-black/40 font-bold transition-all opacity-100 truncate">Mind</p>
             ) : (
               <p className="text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] uppercase text-black/40 font-bold transition-all opacity-100 truncate">
                 {activeTraitName} Sphere
               </p>
             )}
           </div>

           {/* Fixed Height Title */}
           <div className="h-20 flex items-center justify-center mb-6">
             {!activeTraitName ? (
               <h4 className="text-3xl font-bold tracking-tighter text-[#0A0A0A] leading-tight transition-all">
                 <span className="text-amber-500">92%</span><br />
                 {identityText}
               </h4>
             ) : (
               <h4 className="text-3xl font-bold tracking-tighter text-[#0A0A0A] leading-tight transition-all">
                 <span className={activeColors.text.replace('text-', 'text-')}>{activeValue > 50 ? activeValue : Math.max(100 - activeValue, 0)}%</span><br />
                 {activeValue > 50 ? activeTraitName.split(' ')[0] : activeOpposite.split(' ')[0]}
               </h4>
             )}
           </div>
           
           {/* Fixed Height Image */}
           <div className={`w-40 h-40 mb-8 mix-blend-multiply transition-all duration-500 flex items-center justify-center ${activeTraitName ? 'scale-110 opacity-100' : 'scale-100 opacity-90 grayscale hover:scale-110'}`}>
             <img 
               src={!activeTraitName ? "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg" : (traitDescriptions[activeTraitsKey(activeTraitName, activeValue > 50)]?.icon || "/assets/report/Cognitive Functions SVG/Adaptive Observation.svg")} 
               alt="Illustration" 
               className="w-full h-full object-contain" 
             />
           </div>
           
           {/* Fixed Height Description */}
           <div className="h-24 flex items-start justify-center mt-2">
             <p className="text-[13px] text-black/70 font-medium leading-relaxed max-w-[280px] transition-all">
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
  // simple helper inside block scope to extract the true desc key
  return trait;
}

/**
 * DossierSection: Immersive vertical section with extreme white space.
 * Includes built-in GSAP scroll triggers for high-end reveals.
 */
function DossierSection({ num, title, description, children, accentColor = "text-[#6D28D9]", illustration, variant = "protocol", id, fastReveal = false }: { num: number, title: string, description: string, children: React.ReactNode, accentColor?: string, illustration?: string, variant?: "default" | "protocol" | "grid" | "heroic" | "centered" | "flipped", id?: string, fastReveal?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dataSeg = `DATA_SEG_0${num}`;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Header reveal (Assessment-style: Blur + Y-slide)
    gsap.fromTo(titleRef.current, 
      { opacity: 0, filter: "blur(20px)", y: 40 },
      { 
        opacity: 1, filter: "blur(0px)", y: 0, duration: fastReveal ? 1.0 : 1.8, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
      }
    );

    // Staggered reveal for children
    gsap.fromTo(sectionRef.current.querySelectorAll('.stagger-reveal'),
      { opacity: 0, filter: "blur(15px)", y: 50 },
      {
        opacity: 1, filter: "blur(0px)", y: 0, duration: fastReveal ? 1.0 : 2, stagger: fastReveal ? 0.08 : 0.2, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
      }
    );

    // Image reveal
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, filter: "blur(15px)", y: 40 },
        {
          opacity: 1, filter: "blur(0px)", y: 0, duration: fastReveal ? 1.0 : 2, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );
      
      // Subtle float parallax
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

  if (variant === "heroic") {
    return (
      <section ref={sectionRef} id={id || `dimension-${num}`} className="py-32 border-t border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src={illustration} className="w-full h-full object-cover opacity-5 border-black/10 blur-xl scale-110" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#FDFDFD] via-transparent to-[#FDFDFD]" />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-24">
          <div className="space-y-12 max-w-4xl mx-auto">
            <span className={`text-[12px] font-mono ${accentColor} tracking-[1em] font-black uppercase opacity-60`}>Finale_Dimension_0{num}</span>
            <h2 ref={titleRef} className="text-6xl md:text-[8rem] font-bold tracking-tighter text-[#0A0A0A] leading-none uppercase">{title}</h2>
            <p className="text-2xl text-black/70 font-medium leading-relaxed max-w-3xl mx-auto italic">
              {description}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "protocol") {
    return (
      <section ref={sectionRef} id={id || `dimension-${num}`} className="py-32 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-8 w-full space-y-32">
          <div className="text-center space-y-16 stagger-reveal">
            <div className="flex flex-col items-center gap-8">
              <span className={`text-[11px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Dimension_Ref_{num} // Segment_0{num}</span>
              <div className="w-[1px] h-[100px] bg-gradient-to-b from-black/20 to-transparent" />
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

  if (variant === "centered") {
    return (
      <section ref={sectionRef} id={id || `dimension-${num}`} className="py-32">
        <div className="max-w-7xl mx-auto px-8 space-y-32">
          <div className="text-center space-y-16">
            <div className="flex flex-col items-center gap-8">
              <span className={`text-[10px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Dimension_0{num} // PSYPHER_DATA_SEG</span>
              <div className="w-[1px] h-[80px] bg-black/10" />
            </div>
            <h2 ref={titleRef} className="text-6xl md:text-8xl font-bold tracking-tight text-[#0A0A0A] leading-tight uppercase max-w-5xl mx-auto">{title}</h2>
            <p className="text-xl text-black/60 font-medium leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          
          <div ref={imageRef} className="max-w-4xl mx-auto aspect-video relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent rounded-3xl blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <img src={illustration} className="w-full h-full object-contain relative z-10 brightness-95 opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-90 group-hover:scale-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-12 group/row">
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id={id || `dimension-${num}`} className="py-40 first:pt-0">
      <div className="max-w-7xl mx-auto px-8 space-y-24">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-24 items-center ${variant === "flipped" ? "direction-rtl" : ""}`}>
          <div className={`${variant === "flipped" ? "lg:col-start-7 lg:col-span-6 lg:order-2" : "lg:col-span-7"} space-y-8`}>
            <div className={`flex items-center gap-6 ${variant === "flipped" ? "flex-row-reverse" : ""}`}>
              <span className={`text-[10px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Dimension_0{num}</span>
              <div className="w-[40px] h-[0.5px] bg-black/10" />
            </div>
            <h2 ref={titleRef} className="text-7xl md:text-9xl font-bold tracking-tight text-[#0A0A0A] leading-none uppercase">{title}</h2>
            <p className="text-xl text-black/60 font-medium leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          <div ref={imageRef} className={`${variant === "flipped" ? "lg:col-span-6 lg:order-1" : "lg:col-span-5"} aspect-square relative group pb-12`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6D28D9]/5 to-transparent rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <img 
              src={illustration} 
              alt="" 
              className="w-full h-full object-contain relative z-10 opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
            />
          </div>
        </div>
      </div>
      
      {variant === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group/row">
          {children}
        </div>
      ) : (
        <div className="space-y-6">
          {children}
        </div>
      )}
    </section>
  );
}

function ReportContent() {
  const [report, setReport] = useState<string>("");
  const [scores, setScores] = useState<any>(null);
  const [partnerScores, setPartnerScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [tier, setTier] = useState<"basic" | "deep" | "compatibility">("deep");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchReport = async () => {
      const isDemo = searchParams.get("demo") === "true";
      const isBypass = searchParams.get("bypass") === "true";
      const tierParam = searchParams.get("tier") as any;
      if (tierParam && ["basic", "deep", "compatibility"].includes(tierParam)) setTier(tierParam);
      
      if (isDemo || isBypass || tierParam === "deep" || tierParam === "compatibility") setIsUnlocked(true);

      try {
        if (isDemo) {
          const mockAlpha = {
            bfi: { Openness: 88, Conscientiousness: 92, Extraversion: 45, Agreeableness: 32, Neuroticism: 58 },
            darkTriad: { Machiavellianism: 84, Psychopathy: 22, Narcissism: 68 },
            attachment: { Style: "Dismissive-Avoidant", Security: 15, Anxiety: 48, Avoidance: 89 },
            cognitive: { Type: "Strategic Architect (INTJ)", Functions: { "Adaptive Observation": 95, "Empathic Integration": 42, "External Engagement": 65, "Internal Reflector": 88 } },
            drivers: { "Power & Impact": 85, "Self-Direction": 92, "Achievement": 78, "Security": 45 },
            language: { Analytical: 94, Social: 12, Clout: 88, Authentic: 35 },
            resilience: { Durability: 82, Agility: 65, "Stress Level": 28, Focus: 91 }
          };
          
          setScores(mockAlpha);
          
          if (tierParam === "compatibility" || isDemo) {
            setPartnerScores({
              bfi: { Openness: 65, Conscientiousness: 78, Extraversion: 92, Agreeableness: 85, Neuroticism: 42 },
              darkTriad: { Machiavellianism: 32, Psychopathy: 15, Narcissism: 45 },
              attachment: { Style: "Secure", Security: 88, Anxiety: 12, Avoidance: 15 },
              cognitive: { Type: "Social Connector (ENFP)", Functions: { "Adaptive Observation": 78, "Empathic Integration": 95, "External Engagement": 92, "Internal Reflector": 65 } },
            });
          }
          setReport(`# Executive Summary: The Architect Map
Your neural architecture reflects a rare alignment between objective logic and long-term vision protocol. Most professionals struggle with the "noise" of social momentum or emotional reactive cycles, but you operate as a clinical exception. You do not merely participate in the market; you architect the systems that define its boundaries.

However, this excellence is a shield. Your strategic precision is often a defensive reaction to a visceral distrust of unmanaged environments. 

# THE OPERATIONAL BLUEPRINT
You navigate high-stakes environments via a "Strategic Alpha Edge." You process social data not as emotional cues, but as variables in a power-dynamic equation. This allows for unmatched clarity in negotiation, but it creates a "Data Isolation" effect. You are building a cathedral in a vacuum.

# THE FAILURE STAKE
If you fail to bridge this isolation, your proprietary systems will inevitably calcify. You will own the most efficient architecture in a ghost town of your own making, losing the very influence you've worked to secure.`);
          setLoading(false);
          return;
        }
        
        const storedAnswers = sessionStorage.getItem("psypher_answers");
        if (storedAnswers) {
          const response = await fetch("/api/generate-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: JSON.parse(storedAnswers) }),
          });
          if (response.ok) {
            const data = await response.json();
            setScores(data.scores);
            setReport(data.report);
          }
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
    if (!loading) {
      const ctx = gsap.context(() => {
        // Main Content Reveal (with Blur)
        gsap.to(containerRef.current, { 
          opacity: 1, 
          duration: 1.2, 
          ease: "power2.out",
          filter: "blur(0px)",
          onStart: () => {
            gsap.set(containerRef.current, { filter: "blur(20px)", opacity: 0 });
          }
        });

        // Sticky Progress Bar Logic
        gsap.to("#scroll-progress-bar", {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          }
        });

        // Staggered Blur Reveal for all elements
        const reveals = containerRef.current?.querySelectorAll(".stagger-reveal");
        reveals?.forEach((el) => {
          gsap.fromTo(el, 
            { 
              opacity: 0, 
              y: 60, 
              filter: "blur(20px)",
              scale: 0.98
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              scale: 1,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none none"
              }
            }
          );
        });

        // Special Animation for Friction Zones
        if (tier === "compatibility") {
           const zones = containerRef.current?.querySelectorAll(".friction-zone");
           zones?.forEach((z) => {
             gsap.from(z, {
               opacity: 0,
               x: -40,
               duration: 1.5,
               ease: "power4.out",
               scrollTrigger: {
                 trigger: z,
                 start: "top 80%"
               }
             });
           });
        }
      }, containerRef);
      
      return () => ctx.revert();
    }
  }, [loading, tier]);

  if (loading) return <LoadingState />;

  const getIcon = (dimension: string, trait: string) => {
    const dim = DIMENSION_ASSETS[dimension];
    if (!dim) return GEN_ASSETS[dimension] || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=300";
    return `/assets/report/${dim.folder}/${dim.icons[trait] || "default.svg"}`;
  };

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] font-outfit pb-40 opacity-0 selection:bg-[#6D28D9] selection:text-white"
    >
      {/* Delicate Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />
      
      {/* Neural Depth Layer: Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[10%] -left-64 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] animate-[float_20s_infinite_ease-in-out]" 
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute bottom-[20%] -right-64 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[180px] animate-[float_25s_infinite_ease-in-out]" 
          style={{ animationDelay: '-5s' }}
        />
        <div 
          className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] animate-[float_15s_infinite_ease-in-out]" 
          style={{ animationDelay: '-10s' }}
        />
      </div>

      {/* Premium Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] animate-[scanline_10s_infinite_linear] bg-gradient-to-b from-transparent via-black to-transparent h-[10px] w-full" />
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 30px) scale(1.1); }
          66% { transform: translate(-30px, 50px) scale(0.9); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <StickyReportNav />
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      
      {/* Sticky Progress Line */}
      <div className="fixed left-0 top-0 w-[2px] h-full bg-black/[0.02] z-50">
        <div id="scroll-progress-bar" className="absolute top-0 left-0 w-full bg-[#6D28D9] shadow-[0_0_30px_rgba(109,40,217,0.8)]" style={{ height: "0%" }}>
          <div className="absolute bottom-0 left-[-4px] w-3 h-3 bg-[#6D28D9] rounded-full blur-[4px] animate-pulse" />
        </div>
      </div>
      <header className="px-8 md:px-24 py-4 flex justify-between items-center relative z-20 border-b border-black/5 bg-[#FDFDFD]/60 backdrop-blur-3xl sticky top-0 font-outfit">
        <div className="flex items-center">
           <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
             <img 
               src="/logo.svg" 
               alt="Psypher Logo" 
               className="h-8 md:h-10 w-auto transition-all duration-500 group-hover:opacity-70" 
             />
           </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 opacity-30 select-none text-[#0A0A0A]">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black italic">{PROTOCOL_VERSION}</span>
        </div>
 
        <div className="flex gap-10 items-center">
          <button className="text-[8px] font-mono font-black uppercase tracking-widest opacity-20 hover:opacity-80 transition-opacity text-[#0A0A0A]">
            Download
          </button>
          <button className="text-[8px] font-mono font-black uppercase tracking-widest bg-black text-white px-6 py-2 rounded-full hover:bg-[#0A0A0A]/80 transition-all">
            Export
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 md:px-24 mt-40 space-y-32 relative z-10">
        
        {/* Initial Profile Hero */}
        <section className="space-y-32">
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono text-[#6D28D9] tracking-[0.6em] uppercase font-black">
                {tier === "compatibility" ? "Binary_Sync_Protocol" : "Subject_Analysis_Dossier"}
              </span>
              <div className="flex-1 h-[0.5px] bg-black/5" />
            </div>            <div className="flex flex-col gap-4">
              {tier === "compatibility" ? (
                <div className="flex flex-col md:flex-row md:items-end gap-8">
                  <h1 className="text-8xl md:text-[12rem] font-thin tracking-tighter leading-none text-[#0A0A0A] lowercase">
                    Alpha<span className="text-[#6D28D9]">.</span>
                  </h1>
                  <span className="text-4xl md:text-6xl font-thin text-black/10 md:mb-4 italic">vs</span>
                  <h1 className="text-8xl md:text-[12rem] font-thin tracking-tighter leading-none text-[#6D28D9] lowercase">
                    Beta<span className="text-black/10">.</span>
                  </h1>
                </div>
              ) : (
                <h1 className="text-8xl md:text-[14rem] font-thin tracking-tighter leading-none text-[#0A0A0A] lowercase">
                  Profile_Alpha<span className="text-[#6D28D9]">.</span>
                </h1>
              )}
            </div>

          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-end">
            <div className="lg:col-span-12 space-y-12">
              <p className="text-4xl md:text-6xl font-extralight text-black/90 leading-[1.1] tracking-tight">
                {tier === "compatibility" ? (
                  <>Synthesizing two neural architectures into one <span className="text-[#0A0A0A] font-medium italic underline decoration-[#6D28D9]/40 underline-offset-8">Cohesion Map</span>.</>
                ) : (
                  <>You operate as a <span className="text-[#0A0A0A] font-medium italic underline decoration-[#6D28D9]/40 underline-offset-8">Strategic Architect</span>.</>
                )}
              </p>
              <p className="text-xl text-black/40 leading-relaxed font-medium max-w-3xl">
                {tier === "compatibility" 
                  ? "Binary synthesis calculated via cognitive friction markers, linguistic overlap, and competitive drive alignment."
                  : "This dossier removes the guesswork from your interpersonal dynamics and high-pressure negotiations."
                }
              </p>
            </div>
          </div>
        </section>

        {/* Executive Summary Narrative */}
        <DossierSection
          num={0}
          title="Executive Summary"
          description="A high-level synthesis of your primary neural architectural markers."
          accentColor="text-black"
          variant="protocol"
          id="executive-summary"
        >
          <div className="col-span-full py-12 -mx-4 rounded-3xl px-12 md:px-24 stagger-reveal">
             <div className="max-w-4xl mx-auto space-y-20 py-20">
                <NarrativeBlock content={report} />
             </div>
          </div>
        </DossierSection>

        {/* Intelligence Journey */}
        <div className="space-y-40">
          
          <DossierSection 
            num={1}
            title="Personality Architecture"
            description="The core layers of your everyday behavior and how you engage with your environment."
            illustration="/assets/report/Big 5 SVG/Openness.svg"
            variant="protocol"
            accentColor="text-purple-500"
          >
            {scores?.bfi && Object.entries(scores.bfi).map(([trait, val]: any) => (
              <IntelligenceRow 
                key={trait}
                label={trait}
                value={val}
                comparisonValue={tier === "compatibility" ? partnerScores?.bfi?.[trait] : undefined}
                color="text-purple-500"
                variant="card"
                icon={getIcon("bfi", trait)}
                description={
                  trait === "Openness" ? "Neural potential for high-stakes innovation vs status-quo maintenance." :
                  trait === "Conscientiousness" ? "Quality-control protocol and systemic organizational persistence." :
                  trait === "Extraversion" ? "Social recharge velocity and independent work durability." :
                  trait === "Agreeableness" ? "Negotiation stance—results priority vs collective harmony." :
                  "Targeted environmental sensitivity and risk-mitigation radar."
                }
              />
            ))}
            <div className="col-span-full mt-24 stagger-reveal bg-white/40 p-12 rounded-[3rem] border border-black/5">
              <h3 className="text-[10px] font-mono tracking-[0.4em] uppercase text-purple-600 mb-12 text-center opacity-50">Deep_Dossier_Narrative // Big_5_Analysis</h3>
              <NarrativeBlock content={`
## The Architecture of Openness
Users with your score of 88% in Openness do not merely "like new ideas"—you hunt for them as survival assets. You possess a high-velocity neural plasticity that allows you to synthesize disparate concepts into cohesive weapons.

**The Internal Experience:** You likely experience a constant "Background Hum" of theoretical simulation. You do not see a room; you see the potential arrangements of the room.

**The Social Manifestation:** In leadership, this makes you a visionary but also a "Ghost." You move so fast through the conceptual landscape that your team often struggles to keep up with the structural shifts you've already completed in your mind.

**The Failure Stake:** Without explicit grounding, your brilliance will dissipate into "Theoretical Overload." You will innovate a thousand worlds and inhabit none of them.
              `} />
            </div>
          </DossierSection>

          {tier === "basic" && (
            <section className="py-40 text-center relative border-t border-black/5 space-y-12 rounded-[4rem] bg-black/[0.01]">
              <div className="absolute inset-0 z-0 backdrop-blur-xl" />
              <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <span className="text-[10px] font-mono text-[#6D28D9] tracking-[1em] uppercase font-black opacity-40">Tier_Gap_Detected</span>
                <h3 className="text-5xl md:text-7xl font-thin tracking-tighter text-black">Expand_Profile<span className="text-[#6D28D9]">.</span></h3>
                <p className="text-lg text-black/40 italic">"The remaining 6 analytical segments (Dark Triad, Attachment, Cognitive, Drivers, Linguistic, Resilience) require Deep Report clearance."</p>
                <div className="pt-8">
                   <button className="bg-black text-white px-16 py-6 rounded-full font-bold text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-all">Upgrade to Deep Report</button>
                </div>
              </div>
            </section>
          )}

          {tier !== "basic" && (
            <DossierSection 
              num={2}
              title="The Dark Triad"
              description="The clinical sub-clinical triad: Machiavellianism, Narcissism, and Psychopathy. Your scores represent high-stakes tactical advantages and risk markers."
              accentColor="text-red-600"
              illustration="/assets/report/THE Dark triad SVG/Narcissism.svg"
              variant="protocol"
            >
              {scores?.darkTriad && Object.entries(scores.darkTriad).map(([trait, val]: any) => (
              <IntelligenceRow 
                key={trait}
                label={trait}
                value={val}
                comparisonValue={tier === "compatibility" ? partnerScores?.darkTriad?.[trait] : undefined}
                color="text-red-600"
                variant="card"
                icon={getIcon("darkTriad", trait)}
                description={
                  trait === "Machiavellianism" ? "Strategic deception, social manipulation, and the calculated use of others as instruments for goal achievement." :
                  trait === "Narcissism" ? "Ego maintenance, grandiosity, and the exploitation of perceived status symbols for dominance." :
                  "Lowered inhibitory response and a clinical capacity for emotional detachment in high-stress, high-stakes decision cycles."
                }
              />
            ))}
            <div className="col-span-full mt-24 stagger-reveal bg-white/40 p-12 rounded-[3rem] border border-black/5">
              <h3 className="text-[10px] font-mono tracking-[0.4em] uppercase text-red-600 mb-12 text-center opacity-50">Tactical_Shadow_Protocol // Dark_Triad_Analysis</h3>
              <NarrativeBlock content={`
## The Strategic Shadow
Your Dark Triad profile contains high-stakes tactical advantages that most organizations are too afraid to name. You do not suffer from the "Social Compliance" bugs that slow down traditional executives.

**Machiavellianism (84%):** This is not "evil"; it is **Strategic Detachment**. You see the board with the clarity of a Grandmaster. You understand that influence is a friction-based resource that must be managed, not a social grace to be given away for free.

**The Failure Stake:** If left unrefined, this detachment becomes "Isolation." You will win the war but find yourself standing on a battlefield with nobody left to command. Mastering the **guide** protocol is your only path to sustainable power.
              `} />
            </div>
          </DossierSection>
        )}

          {tier !== "basic" && (
            <DossierSection 
              num={3}
              title="Relational Matrix"
              description="How you build trust, manage professional boundaries, and relate to your peers."
              accentColor="text-blue-400"
              illustration="/assets/report/Attachment style SVG/Secure.svg"
              variant="protocol"
            >
              {scores?.attachment && (
                <>
                  <IntelligenceRow 
                    label="Core_Style"
                    value={scores.attachment.Style.replace('-', ' ')}
                    comparisonValue={tier === "compatibility" ? partnerScores?.attachment?.Style : undefined}
                    color="text-blue-400"
                    variant="card"
                    icon={getIcon("attachment", scores.attachment.Style)}
                    description={`Your behavior profile aligns with the ${scores.attachment.Style} protocol.`}
                  />
                  <IntelligenceRow 
                    label="Trust_Index"
                    value={scores.attachment.Security}
                    comparisonValue={tier === "compatibility" ? partnerScores?.attachment?.Security : undefined}
                    color="text-blue-400"
                    variant="card"
                    icon={getIcon("attachment", "Secure")}
                    description="Capacity for authentic, high-security professional bonding."
                  />
                  <IntelligenceRow 
                    label="Security_Score"
                    value={scores.attachment.Security}
                    comparisonValue={tier === "compatibility" ? partnerScores?.attachment?.Security : undefined}
                    color="text-blue-400"
                    variant="card"
                    icon={getIcon("attachment", "Secure")}
                    description="Baseline relational durability metric."
                  />
                </>
              )}
            </DossierSection>
          )}

          {tier === "compatibility" && (
            <section className="py-40 bg-zinc-950 rounded-[4rem] px-12 md:px-24 border border-white/5 relative overflow-hidden stagger-reveal">
               <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
               
               <div className="relative z-10 space-y-24">
                  <div className="space-y-8">
                    <span className="text-[10px] font-mono text-white/40 tracking-[1em] uppercase font-black">Sync_Calibration_Report</span>
                    <h2 className="text-6xl md:text-8xl font-thin tracking-tighter text-white">Friction_Zones<span className="text-[#6D28D9]">.</span></h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-12 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
                      <h4 className="text-xl font-medium text-white italic">"High Intellectual Symmetry"</h4>
                      <p className="text-sm text-white/40 leading-relaxed font-light">Both subjects exhibit Openness scores above 80%. Strategic alignment is highly likely in innovative environments.</p>
                      <div className="h-[2px] w-full bg-gradient-to-r from-[#6D28D9] to-transparent" />
                    </div>
                    <div className="p-12 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
                      <h4 className="text-xl font-medium text-white italic">"Relational Dissonance"</h4>
                      <p className="text-sm text-white/40 leading-relaxed font-light">Alpha's Avoidant style vs Beta's Secure style creates a 40% communication lag during high-stress decision windows.</p>
                      <div className="h-[2px] w-full bg-gradient-to-r from-red-500 to-transparent" />
                    </div>
                  </div>
               </div>
            </section>
          )}

          {!isUnlocked && tier !== "basic" && (
            <section className="py-60 text-center relative border-t border-black/5 space-y-16 overflow-hidden rounded-[4rem] bg-black/[0.01]">
                <div className="absolute inset-0 z-0 backdrop-blur-3xl" />
                
                <div className="relative z-10 space-y-12 max-w-3xl mx-auto py-24">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center animate-pulse">
                      <span className="text-xl rotate-12 opacity-40 italic font-serif">lock</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6D28D9] tracking-[1.5em] uppercase font-black opacity-40">Protocol_Gate_Active</span>
                  </div>
                  
                  <h3 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#0A0A0A] uppercase">
                    Deep<span className="text-[#6D28D9]">_</span>Scan
                  </h3>
                  
                  <p className="text-xl text-black/70 max-w-xl mx-auto font-medium leading-relaxed italic">
                    "Cognitive mechanics and linguistic biomarkers are currently restricted. Full decryption required to complete neural profile."
                  </p>
                  
                  <div className="pt-12">
                    <button 
                      onClick={() => setIsUnlocked(true)}
                      className="group relative z-10 bg-black text-white px-24 py-8 rounded-full font-bold hover:scale-105 transition-all text-[11px] tracking-[0.4em] uppercase shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95"
                    >
                      <span className="relative z-10">Unlock Complete Dossier</span>
                      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-y-px" />
                    </button>
                    
                    <div className="mt-12 flex justify-center gap-8 opacity-20 hidden md:flex">
                       {["DIM_04", "DIM_05", "DIM_06", "DIM_07"].map(d => (
                         <span key={d} className="text-[8px] font-mono tracking-widest">{d}_LOCKED</span>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Scrambled Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden font-mono text-[8px] leading-none whitespace-pre flex items-center justify-center rotate-12 scale-150">
                  {Array(20).fill("010110010101010110010101010110010101010110010101\n").join("")}
                </div>
            </section>
          )}

          <div className={`space-y-40 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${(!isUnlocked || tier === "basic") ? "blur-[60px] opacity-[0.03] pointer-events-none select-none max-h-[800px] overflow-hidden grayscale scale-95" : "blur-0 opacity-100 scale-100"}`}>
            <DossierSection 
              num={4}
              id="dimension-4"
              title="Cognitive Mechanics"
              description="Information processing architecture and decision-making logic gates."
              accentColor="text-amber-400"
              illustration="/assets/report/Cognitive Functions SVG/Adaptive Observation.svg"
              variant="protocol"
              fastReveal={true}
            >
              <CognitiveInteractiveSection scores={scores} />
            </DossierSection>

            <DossierSection 
              num={5}
              id="dimension-5"
              title="Core Drivers"
              description="Universal value orientations that govern long-term behavior and motivation."
              accentColor="text-emerald-400"
              illustration="/assets/report/Core Drivers SVG/HEDONISM.svg"
              variant="protocol"
            >
               {scores?.schwartz && Object.entries(scores.schwartz).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  comparisonValue={tier === "compatibility" ? (partnerScores?.schwartz as any)?.[trait] : undefined}
                  color="text-emerald-400"
                  variant="card"
                  icon={getIcon("schwartz", trait)}
                  description={`The primary motivation for ${trait} behaviors within the subject's operative framework.`}
                />
              ))}
            </DossierSection>

            <DossierSection 
              num={6}
              id="dimension-6"
              title="Linguistic Fingerprint"
              description="Neural markers found in your communication patterns that reveal hidden cognitive biases."
              accentColor="text-cyan-400"
              illustration="/assets/report/language.png"
              variant="protocol"
            >
              {scores?.language && Object.entries(scores.language).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  comparisonValue={tier === "compatibility" ? (partnerScores?.language as any)?.[trait] : undefined}
                  color="text-cyan-400"
                  variant="card"
                  icon="/assets/report/language.png"
                  description={
                    trait === "Analytical" ? "Density of logical connective markers and preference for objective evidence." :
                    trait === "Social" ? "Frequence of relational cues and community-oriented linguistic structures." :
                    trait === "Clout" ? "Communicative indicators of status-awareness and hierarchical positioning." :
                    "Markers of transparency, vulnerability, and baseline communicative honesty."
                  }
                />
              ))}
            </DossierSection>

            <DossierSection 
              num={7}
              id="dimension-7"
              title="Resilience Index"
              description="Your psychological bypass capacity for maintaining focus under extreme pressure."
              accentColor="text-pink-500"
              illustration="/assets/report/resilience.png"
              variant="heroic"
            >
              {scores?.resilience && Object.entries(scores.resilience).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  comparisonValue={tier === "compatibility" ? (partnerScores?.resilience as any)?.[trait] : undefined}
                  color="text-pink-500"
                  variant="card"
                  icon="/assets/report/resilience.png"
                  description={
                    trait === "Durability" ? "Baseline capacity to withstand extended periods of high-stress environmental noise." :
                    trait === "Agility" ? "Speed of psychological recovery after high-impact cognitive friction." :
                    trait === "Focus" ? "Signal-to-noise optimization during peak mental task performance." :
                    "Real-time measurement of current environmental pressure levels."
                  }
                />
              ))}
            </DossierSection>
          </div>
        </div>

        <footer className="pt-40 border-t border-black/5 flex flex-col md:flex-row justify-between items-start gap-16 opacity-30 pb-20 mt-40">
          <div className="space-y-4">
            <div className="flex gap-10 text-[9px] font-mono uppercase tracking-[0.4em] font-black text-[#0A0A0A]">
              <span className="text-[#6D28D9]">Proprietary</span>
              <span>Ref: PS-SYN-8821</span>
            </div>
            <p className="text-[9px] font-mono leading-relaxed uppercase tracking-[0.2em] font-black max-w-xs text-black/60">
              For authorized target use only. Duplicate at Subject-Level risk.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex justify-center md:justify-end py-10 opacity-60">
             <span className="text-[9px] font-mono tracking-[0.6em] uppercase font-bold text-black/40 text-center md:text-right">
               {SYSTEM_AUTH}
             </span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .report-markdown h1 { font-size: 7rem; color: #0A0A0A; line-height: 0.85; margin-bottom: 5rem; letter-spacing: -0.06em; font-weight: 950; text-transform: uppercase; }
        .report-markdown h2 { font-size: 1.25rem; color: #6D28D9; margin-top: 8rem; margin-bottom: 3rem; font-family: monospace; font-weight: 900; letter-spacing: 0.4em; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 2rem; }
        .report-markdown p { margin-bottom: 3rem; line-height: 1.6; font-weight: 400; font-size: 1.75rem; tracking: -0.02em; color: rgba(0,0,0,0.7); }
        .report-markdown strong { color: #0A0A0A; font-weight: 900; }
        .vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); }
      `}</style>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReportContent />
    </Suspense>
  );
}
