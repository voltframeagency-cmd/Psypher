"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift to Dark for Footer
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        onEnter: () => {
          gsap.to("body", { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 0.8 });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-40 px-6 bg-[#0F0F0F] text-[#F5F0EB]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12">
          Ready to decode <br />
          <span className="text-white/40 italic">your psychology?</span>
        </h2>
        <p className="text-xl md:text-2xl text-white/60 mb-16 font-medium max-w-2xl mx-auto">
          The cost of staying stuck is far greater than $18.99.
        </p>
        
        <button className="bg-accent hover:bg-accent-hover text-white px-12 py-8 text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center group shadow-2xl shadow-accent/20 mx-auto">
          Start my free assessment
          <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
        </button>

        <div className="mt-40 pt-20 border-t border-white/5 opacity-30">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold tracking-tighter uppercase italic mb-8">
              ψ Psypher
            </span>
            <div className="flex flex-wrap justify-center gap-8 mb-12 text-[10px] font-bold uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Science</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-[10px] tracking-[0.4em] font-mono">
              © 2026 PSYPHER ADVISORY GROUP. NYC / STO.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
