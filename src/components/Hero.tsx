"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ArrowRight } from "lucide-react";

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
      className="relative min-h-[90vh] flex flex-col bg-background overflow-hidden"
    >
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-10 w-full z-10">
        <div className="nav-reveal flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter uppercase italic">ψ Psypher</span>
        </div>
        <div className="hidden md:flex space-x-12">
          {["How It Works", "Pricing", "About"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="nav-reveal text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="nav-reveal">
          <button className="text-xs font-bold uppercase tracking-widest border border-foreground/10 px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-500 rounded-sm">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full text-center py-20 pb-32">
        <div className="max-w-4xl">
          <span className="nav-reveal block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-8">
            Engine-First Intelligence
          </span>
          <h1 
            ref={headlineRef}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12"
          >
            What is your personality <br className="hidden md:block"/> 
            <span className="text-foreground/40 italic">costing you?</span>
          </h1>
          <p 
            ref={subheadlineRef}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Traditional personality tests put you in a box. We give you the keys to break out of it. 
            Decode your psychological blueprint in 10 minutes.
          </p>
          
          <div className="cta-reveal flex flex-col items-center gap-6">
            <button className="bg-accent hover:bg-accent-hover text-white px-12 py-6 text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center group shadow-xl shadow-accent/20">
              Get my free mini-report
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/30">
              No credit card required. Discover your dominant trait instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000"
          style={{ 
            opacity: 0.6, 
            mixBlendMode: 'multiply' 
          }}
        >
          <source src="https://cdn.midjourney.com/video/566125f4-4a32-4676-9bb6-34ae4b723d70/0.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
