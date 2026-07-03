"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldAlert, EyeOff, Activity, Fingerprint } from "lucide-react";
import NarrativeBlock from "@/components/ui/NarrativeBlock";
import SpotlightCard from "@/components/ui/SpotlightCard";
import BklitGauge from "@/components/report/BklitGauge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ShadowSectionProps {
  scores: {
    Machiavellianism: number;
    Narcissism: number;
    Psychopathy: number;
  };
  partnerScores?: {
    Machiavellianism: number;
    Narcissism: number;
    Psychopathy: number;
  };
  narrative?: string;
  theme?: "light" | "dark";
}

const TRAIT_MAPPING = {
  Machiavellianism: "Machiavellianism",
  Narcissism: "Grandiose Narcissism",
  Psychopathy: "Adaptive Psychopathy",
  MACHIAVELLIANISM: "Machiavellianism",
  NARCISSISM: "Grandiose Narcissism",
  PSYCHOPATHY: "Adaptive Psychopathy",
} as const;

const TRAIT_DESCRIPTIONS = {
  Psychopathy: "Lowered emotional reactivity and clinical detachment in high-stakes environments.",
  Machiavellianism: "Propensity for strategic long-term social management and indirect influence.",
  Narcissism: "Strategic self-positioning and baseline requirement for status maintenance.",
  PSYCHOPATHY: "Lowered emotional reactivity and clinical detachment in high-stakes environments.",
  MACHIAVELLIANISM: "Propensity for strategic long-term social management and indirect influence.",
  NARCISSISM: "Strategic self-positioning and baseline requirement for status maintenance.",
} as const;

export default function ShadowSection({ scores, partnerScores, narrative, theme = "dark" }: ShadowSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getScoreVal = (obj: any, key: string): number => {
    if (!obj) return 0;
    return obj[key] !== undefined ? obj[key] : (obj[key.toUpperCase()] !== undefined ? obj[key.toUpperCase()] : (obj[key.toLowerCase()] !== undefined ? obj[key.toLowerCase()] : 0));
  };

  const selfMach = getScoreVal(scores, "Machiavellianism");
  const selfPsych = getScoreVal(scores, "Psychopathy");
  const selfNarc = getScoreVal(scores, "Narcissism");
  const selfAvg = Math.round((selfMach + selfPsych + selfNarc) / 3);

  const partnerMach = getScoreVal(partnerScores, "Machiavellianism");
  const partnerPsych = getScoreVal(partnerScores, "Psychopathy");
  const partnerNarc = getScoreVal(partnerScores, "Narcissism");
  const partnerAvg = Math.round((partnerMach + partnerPsych + partnerNarc) / 3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".shadow-reveal", 
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)", 
          duration: 1.2, 
          stagger: 0.15,
          ease: "power2.out",
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
    <div 
      ref={containerRef}
      className="relative overflow-visible w-full space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(scores).map(([trait, val], i) => {
          const mappedTrait = TRAIT_MAPPING[trait as keyof typeof TRAIT_MAPPING] || trait;
          const description = TRAIT_DESCRIPTIONS[trait as keyof typeof TRAIT_DESCRIPTIONS] || "";
          
          return (
            <SpotlightCard 
              key={trait} 
              glowColor={theme === "light" ? "rgba(220, 38, 38, 0.06)" : "rgba(220, 38, 38, 0.15)"}
              className={`group p-6 rounded-3xl border transition-all duration-700 shadow-reveal flex flex-col items-center text-center h-full justify-between ${
                theme === "light" 
                  ? "bg-white/80 border-zinc-200/80 shadow-[0_4px_20px_rgba(9,9,11,0.02)] hover:bg-white" 
                  : "bg-zinc-950/40 border-zinc-900 hover:bg-zinc-900/20"
              }`}
            >
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6">
                  <img 
                    src={`/assets/report/THE Dark triad SVG/${trait}.svg`} 
                    alt="" 
                    className={`w-8 h-8 object-contain transition-all duration-700 ${
                      theme === "light" 
                        ? "brightness-0 opacity-40 group-hover:opacity-90" 
                        : "filter invert opacity-50 group-hover:opacity-100 group-hover:scale-110"
                    }`}
                  />
                  <span className={`text-[8px] font-mono tracking-wider ${
                    theme === "light" ? "text-zinc-400" : "text-zinc-600"
                  }`}>
                    REF_SHD_0{i+1}
                  </span>
                </div>

                <div className="w-36 h-36 mb-6 flex flex-col items-center justify-center relative">
                  <BklitGauge 
                    value={val} 
                    centerValue={val} 
                    defaultLabel="Score" 
                    totalNotches={30} 
                    spacing={20}
                    notchCornerRadius={1.5}
                    useGradient 
                    activeGradient={["#ef4444", "#dc2626"]}
                    inactiveFill={theme === "light" ? "rgba(9, 9, 11, 0.03)" : "rgba(220, 38, 38, 0.02)"}
                    width={140} 
                    height={140} 
                    theme={theme}
                  />
                  {partnerScores && (
                    <div className={`text-[9px] font-mono tracking-widest mt-2 uppercase ${
                      theme === "light" ? "text-zinc-500 font-bold" : "text-zinc-400"
                    }`}>
                      Partner: {getScoreVal(partnerScores, trait)}%
                    </div>
                  )}
                </div>

                <h3 className={`text-xl font-light tracking-tight mb-2 uppercase ${
                  theme === "light" ? "text-zinc-900" : "text-white"
                }`}>
                  {mappedTrait}
                </h3>
                
                <p className={`text-xs leading-relaxed font-light px-2 mt-2 ${
                  theme === "light" ? "text-zinc-500" : "text-zinc-400"
                }`}>
                  {description}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      <div className={`border rounded-2xl p-6 md:p-8 shadow-reveal transition-colors ${
        theme === "light" 
          ? "bg-white border-zinc-200/80 shadow-[0_4px_25px_rgba(9,9,11,0.02)]" 
          : "bg-white/[0.02] border-white/5"
      }`}>
        <div className="flex items-center gap-6 mb-8">
          <ShieldAlert className="text-red-600" size={32} />
          <h3 className={`text-3xl font-thin tracking-tighter ${
            theme === "light" ? "text-zinc-950" : "text-white"
          }`}>
            {partnerScores ? "Divergence Analysis: Conflict Matrix" : "Synthesized Clinical Risk Assessment"}
          </h3>
        </div>
        
        <NarrativeBlock 
          theme={theme}
          content={narrative || `
${partnerScores ? `
## Relational Divergence: The Shadow Gap
The primary friction point in this partnership lies in the **Gap_Variable**. You operate with a weighted Shadow Score of ${selfAvg}%, while your partner operates at ${partnerAvg}%.

**The Perceptual Gap:** If you are the higher-score individual, you likely perceive your partner as 'socially inefficient' or 'emotionally compromised.' If you are the lower-score individual, you likely perceive your partner as 'detached' or 'calculated.'

**Strategic Insight:** Do not attempt to bridge this gap through 'empathy'—it will fail. Instead, bridge it through **Operational Alignment**. Define exactly what 'Transparency' looks like in this relationship to prevent the higher-shadow profile from retreating into 'Indirect Management.'
` : `
## Competitive Advantage: Strategic Detachment
With a weighted Shadow Score of ${selfAvg}%, you possess a rare immunity to "Social Friction." Most subjects are slowed down by the need for universal consensus—you are not.

**Strategic Insight:** You are best deployed in "Turnaround" scenarios or high-stakes negotiations where analytical logic must override traditional social norms. Your clinical detachment is not a character flaw; it is a proprietary asset that provides strong analytical resilience.

**Critical Vulnerability:** Without a curated "Social Adaptation," your strategic directness will inevitably be perceived as aggression, triggering retaliatory social friction. You must master the **Social Intelligence Layer** to protect your long-term influence.
`}
          `} 
        />
      </div>
    </div>
  );
}
