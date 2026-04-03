"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Zap, Heart, ShieldAlert, TrendingUp, UserMinus } from "lucide-react";

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
          gsap.to("body", { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 1, ease: "power2.inOut" });
        },
        onLeaveBack: () => {
          gsap.to("body", { backgroundColor: "#FAFAF8", color: "#111111", duration: 1, ease: "power2.inOut" });
        }
      });

      // Card Parallax
      gsap.from(".framework-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        yPercent: 15,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out"
      });

      // Agitation Stagger
      gsap.from(".agitation-item", {
        scrollTrigger: {
          trigger: agitationRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
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
              <div key={i} className="framework-card group p-10 bg-white border border-foreground/5 rounded-sm hover:shadow-2xl transition-all duration-500">
                <f.icon className="text-accent mb-8 group-hover:scale-110 transition-transform" size={32} />
                <span className="block text-[10px] font-bold tracking-widest uppercase text-foreground/40 mb-2">{f.subtitle}</span>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  {f.description}
                </p>
              </div>
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
