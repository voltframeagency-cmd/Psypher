"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Zap, Heart, ShieldAlert, TrendingUp, UserMinus } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const frameworks = [
  {
    icon: Layers,
    title: "The Big Five",
    subtitle: "Your core architecture",
    description: "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism."
  },
  {
    icon: ShieldAlert,
    title: "The Dark Triad",
    subtitle: "Your shadow side",
    description: "Machiavellianism, Narcissism, Psychopathy — decoded as strategic assets."
  },
  {
    icon: Heart,
    title: "Attachment Style",
    subtitle: "How you connect",
    description: "Anxious, Avoidant, or Secure — and why your relationships repeat."
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const agitationRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift
      ScrollTrigger.create({
        trigger: agitationRef.current,
        start: "top center",
        onEnter: () => {
          gsap.to(document.body, { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 1, ease: "power2.inOut" });
        },
        onLeaveBack: () => {
          gsap.to(document.body, { backgroundColor: "#FAFAF8", color: "#111111", duration: 1, ease: "power2.inOut" });
        }
      });

      gsap.set(".framework-card", { y: 40, opacity: 0 });
      gsap.to(".framework-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          once: true,
        },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.set(".agitation-item", { y: 30, opacity: 0 });
      gsap.to(".agitation-item", {
        scrollTrigger: {
          trigger: agitationRef.current,
          start: "top 70%",
          once: true,
        },
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <span className="block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Three frameworks. <span className="text-foreground/40 italic text-3xl md:text-5xl block md:inline">One truth.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {frameworks.map((f, i) => (
              <SpotlightCard 
                key={i} 
                className="framework-card group p-10 bg-white/70 border border-neutral-200/50 backdrop-blur-md rounded-2xl hover:shadow-2xl transition-all duration-500"
                spotlightColor="rgba(139, 92, 246, 0.12)"
              >
                <f.icon className="text-accent mb-8 group-hover:scale-110 transition-transform" size={32} />
                <span className="block text-[10px] font-bold tracking-widest uppercase text-foreground/40 mb-2">{f.subtitle}</span>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  {f.description}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Agitation (Dark Mode Target) */}
      <section ref={agitationRef} className="py-40 px-6 bg-[#0F0F0F] text-[#F5F0EB]">
        <div className="max-w-4xl mx-auto">
          <span className="agitation-item block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-12">
            The Hidden Tax
          </span>
          <h2 className="agitation-item text-5xl md:text-7xl font-black tracking-tighter leading-none mb-16">
            You are flying <span className="text-white/30 italic">blind.</span>
          </h2>
          
          <div className="space-y-12">
            <p className="agitation-item text-xl md:text-2xl font-medium leading-relaxed opacity-90">
              You are working hard. You are putting in the hours. You are trying to say the right things in the right meetings.
            </p>
            <p className="agitation-item text-xl md:text-2xl font-medium leading-relaxed opacity-70">
              But you keep hitting a ceiling. You watch people with half your talent get the promotions, the funding, and the relationships you want. You do not understand your own psychological wiring, which means you cannot control how others perceive you.
            </p>
            <div className="agitation-item pt-8 border-t border-white/10 flex items-start gap-6">
              <ShieldAlert className="text-accent shrink-0 mt-1" size={32} />
              <p className="text-2xl md:text-3xl font-black tracking-tight">
                This is the hidden tax of low self-awareness. It costs you money. It costs you influence. It costs you peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
