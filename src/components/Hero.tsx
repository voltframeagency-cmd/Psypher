"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import SplitType from "split-type";
import { ArrowRight } from "lucide-react";
import LiquidChrome from "./ui/LiquidChrome";
import Magnet from "./ui/Magnet";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize SplitType
      const headlineSplit = new SplitType(headlineRef.current!, { types: "words" });
      const subheadlineSplit = new SplitType(subheadlineRef.current!, { types: "words" });

      const tl = gsap.timeline({ 
        defaults: { ease: "power4.out", duration: 1.2 } 
      });

      // Reset initial state for words to avoid FOUC
      gsap.set([headlineSplit.words, subheadlineSplit.words], { 
        y: 40, 
        opacity: 0 
      });

      tl.from(".nav-reveal", {
        y: -10,
        opacity: 0,
        stagger: 0.1,
      })
      .to(headlineSplit.words, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
      }, "-=0.8")
      .to(subheadlineSplit.words, {
        y: 0,
        opacity: 1,
        stagger: 0.02,
      }, "-=1.0")
      .from(".cta-reveal", {
        y: 20,
        opacity: 0,
        duration: 0.8,
      }, "-=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col bg-[#0F0F0F] text-[#F5F0EB] overflow-hidden"
    >
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-10 w-full z-10">
        <div className="nav-reveal flex items-center space-x-2">
          <Magnet magnetStrength={3} padding={50}>
            <span className="text-2xl font-bold tracking-tighter uppercase italic cursor-pointer text-[#F5F0EB]">ψ Psypher</span>
          </Magnet>
        </div>
        <div className="hidden md:flex items-center space-x-12">
          {["How It Works", "Pricing", "About"].map((item) => (
            <Magnet key={item} wrapperClassName="nav-reveal" magnetStrength={5} padding={40}>
              <a 
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-xs font-bold uppercase tracking-widest text-[#F5F0EB]/50 hover:text-[#7C3AED] transition-colors"
              >
                {item}
              </a>
            </Magnet>
          ))}
        </div>
        <Magnet wrapperClassName="nav-reveal" magnetStrength={4} padding={50}>
          <button className="text-xs font-bold uppercase tracking-widest border border-[#F5F0EB]/10 px-8 py-3 hover:bg-[#F5F0EB] hover:text-[#0F0F0F] transition-all duration-500 rounded-sm text-[#F5F0EB]">
            Login
          </button>
        </Magnet>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full text-center py-20 pb-32">
        <div className="max-w-4xl">
          <span className="nav-reveal block text-[#7C3AED] text-xs font-bold tracking-[0.4em] uppercase mb-8">
            Engine-First Intelligence
          </span>
          <h1 
            ref={headlineRef}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 text-[#F5F0EB]"
          >
            What is your personality <br className="hidden md:block"/> 
            <span className="text-[#F5F0EB]/40 italic">costing you?</span>
          </h1>
          <p 
            ref={subheadlineRef}
            className="text-lg md:text-xl text-[#F5F0EB]/60 max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Traditional personality tests put you in a box. We give you the keys to break out of it. 
            Decode your psychological blueprint in 10 minutes.
          </p>
          
          <div className="cta-reveal flex flex-col items-center gap-6">
            <Magnet magnetStrength={3} padding={80}>
              <Link href="/assessment" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-12 py-6 text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center group shadow-xl shadow-[#7C3AED]/20">
                Get my free mini-report
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Magnet>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F5F0EB]/30">
              No credit card required. Discover your dominant trait instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Premium WebGL Background */}
      <div className="absolute inset-0 z-0 overflow-hidden mix-blend-screen opacity-70 pointer-events-none">
        <LiquidChrome />
      </div>
    </section>
  );
}
