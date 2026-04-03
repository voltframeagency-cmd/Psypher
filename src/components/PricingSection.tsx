"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Check, ArrowRight, Zap, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Basic Summary",
    price: "15.00",
    description: "A high-level overview of your Big Five traits.",
    features: ["Core OCEAN Profile", "Facet Summaries", "Dominant Trait Analysis"],
    icon: Target,
    button: "Get Basic",
    highlight: false
  },
  {
    name: "The Deep Report",
    price: "18.99",
    description: "The uncomfortable truth about how you operate.",
    features: [
      "Dark Triad Decoding",
      "Attachment Style Map",
      "Career Optimization",
      "Conflict Strategy"
    ],
    icon: Zap,
    button: "Get Deep Report",
    highlight: true
  },
  {
    name: "The Compatibility Report",
    price: "28.99",
    description: "Stop fighting. Start connecting.",
    features: [
      "Joint Analysis (2 Users)",
      "Friction Points Map",
      "Power Dynamics",
      "Resolution Blueprints"
    ],
    icon: Users,
    button: "Get Compatibility",
    highlight: false
  }
];

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="pricing"
      className="py-32 px-6 bg-[#FAFAF8]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Choose the depth <br />
            <span className="text-foreground/40 italic block md:inline">you are ready for.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div 
              key={i}
              className={cn(
                "pricing-card group relative p-12 rounded-sm border transition-all duration-500 hover:shadow-2xl flex flex-col",
                tier.highlight 
                  ? "bg-accent text-white border-accent scale-105 z-10 shadow-xl shadow-accent/20" 
                  : "bg-white border-foreground/5 text-foreground shadow-sm"
              )}
            >
              <div className="mb-10">
                <div className={cn(
                  "p-3 rounded-full inline-flex mb-8",
                  tier.highlight ? "bg-white/10 text-white" : "bg-accent/5 text-accent"
                )}>
                  <tier.icon size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{tier.name}</h3>
                <p className={cn(
                  "text-sm font-medium leading-relaxed mb-10",
                  tier.highlight ? "text-white/80" : "text-foreground/60"
                )}>
                  {tier.description}
                </p>
                <div className="flex items-baseline mb-12">
                  <span className="text-4xl md:text-6xl font-black tabular-nums">${tier.price}</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 mb-12">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <Check className={cn(
                      "shrink-0",
                      tier.highlight ? "text-white/40" : "text-accent"
                    )} size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={cn(
                "w-full py-6 text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center justify-center group",
                tier.highlight 
                  ? "bg-white text-accent hover:bg-white/90" 
                  : "bg-foreground text-white hover:bg-accent"
              )}>
                {tier.button}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
