"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldAlert, Fingerprint, EyeOff, Activity, Target } from "lucide-react";
import NarrativeBlock from "@/components/ui/NarrativeBlock";

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
}

const TRAIT_MAPPING = {
  Machiavellianism: "Machiavellianism",
  Narcissism: "Grandiose Narcissism",
  Psychopathy: "Adaptive Psychopathy",
} as const;

const TRAIT_DESCRIPTIONS = {
  Psychopathy: "Lowered emotional reactivity and clinical detachment in high-stakes environments.",
  Machiavellianism: "Propensity for strategic long-term social management and indirect influence.",
  Narcissism: "Strategic self-positioning and baseline requirement for status maintenance.",
} as const;

export default function ShadowSection({ scores, partnerScores, narrative }: ShadowSectionProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".shadow-reveal", 
        { opacity: 0, y: 100, filter: "blur(20px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)", 
          duration: 1.5, 
          stagger: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-10 bg-zinc-950 text-white rounded-[2.5rem] px-8 md:px-16 border border-white/5 relative overflow-hidden my-8"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-red-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-zinc-800/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="space-y-4 mb-10 shadow-reveal">
          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-red-600/30" />
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-[#6D28D9] font-black">STRATEGIC_ACTIONS_INDEX</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-thin tracking-tighter leading-none lowercase">
            The_Shadow_Profile<span className="text-red-600">.</span>
          </h2>
          
          <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed italic">
            "Your clinical sub-indices (Dark Triad) reveal the strategic advantages and potential behavioral risks within your profile."
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(scores).map(([trait, val], i) => (
            <div 
              key={trait} 
              className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-700 shadow-reveal flex flex-col items-center text-center"
            >
              <div className="flex flex-col items-center mb-4 w-full">
                <div className="w-24 h-24 md:w-40 md:h-40 mb-4 relative group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
                  <img 
                    src={`/assets/report/THE Dark triad SVG/${trait}.svg`} 
                    alt={TRAIT_MAPPING[trait as keyof typeof TRAIT_MAPPING]} 
                    className="w-full h-full object-contain filter brightness-125 saturate-0 group-hover:saturate-100 transition-all duration-700"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-thin tracking-tighter font-mono text-white mb-1">{val}%</div>
                   {partnerScores && (
                     <div className="text-[8px] font-mono text-white/10 group-hover:text-white/30 transition-colors">ACT_REF: PS-ACT-{i+1}</div>
                   )}
                </div>
              </div>
              
              <h3 className="text-lg font-light mb-4 tracking-tight text-white/90">
                {TRAIT_MAPPING[trait as keyof typeof TRAIT_MAPPING]}
              </h3>
              
              <div className="h-[1px] w-16 bg-red-600/30 mb-4" />
              
              <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full mb-4 relative">
                  <div 
                    className="h-full bg-red-600 transition-all duration-[2000ms] delay-500 ease-expo relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    style={{ width: `${val}%` }}
                  />
                  <p className="flex items-center gap-2 text-[10px] text-white/20 mt-2">
                    <Target size={10} /> Strategic_Context
                  </p>
                  {partnerScores && (
                     <div 
                       className="absolute top-0 h-full bg-white/10 z-0 transition-all duration-[2000ms]"
                       style={{ width: `${partnerScores[trait as keyof typeof partnerScores]}%` }}
                     />
                  )}
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-light italic px-2">
                  {TRAIT_DESCRIPTIONS[trait as keyof typeof TRAIT_DESCRIPTIONS]}
                </p>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 shadow-reveal">
           <div className="flex items-center gap-6 mb-8">
              <ShieldAlert className="text-red-600" size={32} />
              <h3 className="text-3xl font-thin tracking-tighter">
                {partnerScores ? "Divergence Analysis: Conflict Matrix" : "Synthesized Clinical Risk Assessment"}
              </h3>
           </div>
           
           <NarrativeBlock 
             theme="dark"
             content={narrative || `
 ${partnerScores ? `
## Relational Divergence: The Shadow Gap
The primary friction point in this partnership lies in the **Gap_Variable**. You operate with a weighted Shadow Score of ${Math.round((scores.Machiavellianism + scores.Psychopathy + scores.Narcissism) / 3)}%, while your partner operates at ${Math.round((partnerScores.Machiavellianism + partnerScores.Psychopathy + partnerScores.Narcissism) / 3)}%.

**The Perceptual Gap:** If you are the higher-score individual, you likely perceive your partner as 'socially inefficient' or 'emotionally compromised.' If you are the lower-score individual, you likely perceive your partner as 'detached' or 'calculated.'

**Strategic Insight:** Do not attempt to bridge this gap through 'empathy'—it will fail. Instead, bridge it through **Operational Alignment**. Define exactly what 'Transparency' looks like in this relationship to prevent the higher-shadow profile from retreating into 'Indirect Management.'
` : `
## Competitive Advantage: Strategic Detachment
With a weighted Shadow Score of ${Math.round((scores.Machiavellianism + scores.Psychopathy + scores.Narcissism) / 3)}%, you possess a rare immunity to "Social Friction." Most subjects are slowed down by the need for universal consensus—you are not.

**Strategic Insight:** You are best deployed in "Turnaround" scenarios or high-stakes negotiations where analytical logic must override traditional social norms. Your clinical detachment is not a character flaw; it is a proprietary asset that provides strong analytical resilience.

**Critical Vulnerability:** Without a curated "Social Adaptation," your strategic directness will inevitably be perceived as aggression, triggering retaliatory social friction. You must master the **Social Intelligence Layer** to protect your long-term influence.
`}
           `} />

        </div>
      </div>
    </section>
  );
}
