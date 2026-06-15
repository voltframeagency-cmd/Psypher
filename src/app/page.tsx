'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import HowItWorks from '@/components/HowItWorks';
import ReportPreview from '@/components/ReportPreview';
import SocialProof from '@/components/SocialProof';
import PricingSection from '@/components/PricingSection';
import FinalCTA from '@/components/FinalCTA';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const neuralSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Neural Canvas Image Sequence Scrubbing (The Apple Method)
      // We pre-load the 240-frame sequence for mathematically perfect scrub performance
      if (neuralSectionRef.current) {
        const canvas = document.getElementById("neural-canvas") as HTMLCanvasElement;
        const ctx = canvas?.getContext("2d");

        if (canvas && ctx) {
          canvas.width = 1920; 
          canvas.height = 1080;

          const frameCount = 240;
          const currentFrame = (index: number) => 
            `/assets/neural_sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

          const images: HTMLImageElement[] = [];
          const seq = { frame: 0 };

          // Preload images into memory
          for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
          }

          // Initial Render
          images[0].onload = render;
          
          function render() {
            if (images[seq.frame] && images[seq.frame].complete) {
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
              ctx?.drawImage(images[seq.frame], 0, 0, canvas.width, canvas.height);
            }
          }

          // Use a timeline for pinning and image sequence scrubbing
          const neuralTl = gsap.timeline({
            scrollTrigger: {
              trigger: neuralSectionRef.current,
              start: 'top top',
              end: '+=400%', // 4 full screen heights for buttery smooth frame distribution
              pin: true,
              scrub: 0.5, // low scrub value for tight, lag-free snapping
            }
          });

          // Sequence the canvas frames
          neuralTl.to(seq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            onUpdate: render,
            duration: 1
          }, 0);

          // Animate the copy over the canvas sequence
          neuralTl.fromTo('.neural-headline', 
            { y: 50, opacity: 0, filter: 'blur(10px)' }, 
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' },
            0.2
          );
          neuralTl.to('.neural-headline', 
            { opacity: 0, filter: 'blur(10px)', duration: 0.2, ease: 'power2.in' }, 
            0.7
          );
          neuralTl.fromTo('.neural-subline', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
            0.3
          );
          neuralTl.to('.neural-subline', 
            { opacity: 0, duration: 0.2 }, 
            0.8
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAF8] text-[#111111] overflow-hidden">
      {/* 1. Stunning Hero with WebGL LiquidChrome & Magnets */}
      <Hero />

      {/* 2. Problem / Legacy Test Limitations */}
      <ProblemSection />

      {/* Section 2.5: The Neural Reveal (Scroll-Based Scrubbing) */}
      <section 
        ref={neuralSectionRef} 
        className="relative h-screen flex items-center justify-center bg-[#0F0F0F] overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <canvas 
            id="neural-canvas"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent to-[#0F0F0F]" />
          {/* Heavy bottom gradient to hide video watermark and blend into the next black section */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/95 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-8 space-y-12">
          <h2 className="neural-headline text-5xl md:text-8xl font-bold tracking-tighter text-[#F5F0EB]">
            Your decisions aren't random<span className="text-[#7C3AED]">.</span>
          </h2>
          <p className="neural-subline text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            They are the product of complex biological and psychological architecture. Psypher decodes the neural firmware that dictates your every move.
          </p>
        </div>
      </section>

      {/* 3. Three Frameworks & The Agitation (Dark Mode Shift) */}
      <HowItWorks />

      {/* 4. Deep Report Preview (Lock Overlay & Interactive Parallax) */}
      <ReportPreview />

      {/* 5. Testimonial Social Proof & Staggered Counter */}
      <SocialProof />

      {/* 6. Spotlight Premium Pricing Grid */}
      <PricingSection />

      {/* 7. Final High-Status CTA & Stockholm Minimalist Footer */}
      <FinalCTA />
    </div>
  );
}
