"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Unlink, Lock, Ghost } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const problems = [
  {
    icon: Unlink,
    title: "The Linear Trap",
    description: "Legacy tests provide flat, static results. They fail to map the dynamic interplay between your traits."
  },
  {
    icon: Lock,
    title: "Shadow Architecture",
    description: "Most assessments ignore the 'Dark Triad'. We reveal the subterranean traits driving your high-stakes decisions."
  },
  {
    icon: Ghost,
    title: "Invisible Friction",
    description: "Conflict isn't personal; it's mechanical. Psypher maps the exact gears that cause friction in your connections."
  }
];

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "expo.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="how-it-works"
      className="py-32 bg-foreground text-background-warm"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <span className="block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-70">
            Current Limitations
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8">
            Legacy tests tell you <br />
            <span className="text-background-warm/40 italic">who you appear to be.</span>
          </h2>
          <p className="text-lg md:text-xl text-background-warm/60 max-w-2xl mx-auto leading-relaxed">
            They are built for recruitment, not self-mastery. They provide a description of the cage, 
            not the blueprints of the engine within.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <div 
              key={i}
              className="problem-card group p-10 border border-background-warm/10 bg-background-warm/5 hover:border-accent/40 transition-all rounded-sm"
            >
              <div className="mb-8 p-3 inline-flex bg-accent/10 text-accent rounded-full group-hover:scale-110 transition-transform">
                <p.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
              <p className="text-background-warm/50 leading-relaxed text-sm">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
