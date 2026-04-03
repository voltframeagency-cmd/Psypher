"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, Lock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ReportPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color and Body state
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        onEnter: () => {
          gsap.to("body", { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 0.8 });
        }
      });

      // Parallax on Visual
      gsap.from(visualRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        yPercent: 15,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-[#0F0F0F] text-[#F5F0EB] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4">
            Your Deep Report
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            The uncomfortable truth <br />
            <span className="text-white/40 italic">about how you operate.</span>
          </h2>
        </div>

        <div ref={visualRef} className="relative max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/10">
            <span className="text-sm font-bold tracking-widest uppercase text-white/40 italic">PSYPHR BLUEPRINT</span>
            <span className="text-[10px] uppercase tracking-widest text-white/20">Version 2.4.1</span>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex items-center space-x-3 mb-6 text-accent">
                <BarChart3 size={20} />
                <span className="text-xs font-bold tracking-[0.4em] uppercase">BIG FIVE ANALYSIS</span>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Openness", val: 82 },
                  { label: "Conscientiousness", val: 94 },
                  { label: "Extraversion", val: 31 },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50">
                      <span>{stat.label}</span>
                      <span>{stat.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${stat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pt-12 border-t border-white/10">
              <div className="blur-md opacity-20 select-none space-y-4">
                <div className="h-4 bg-white/50 rounded w-3/4" />
                <div className="h-4 bg-white/50 rounded w-full" />
                <div className="h-4 bg-white/50 rounded w-5/6" />
                <div className="h-4 bg-white/50 rounded w-2/3" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 mt-12">
                <div className="bg-accent/20 p-4 rounded-full text-accent mb-4">
                  <Lock size={24} />
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-white/90">
                  Detailed Facet Decoding Hidden
                </p>
                <p className="text-[10px] font-medium tracking-wide text-white/40 mt-2">
                   Upgrade to 'The Deep Report' to reveal shadow traits and conflict roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
