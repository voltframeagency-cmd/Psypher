"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NarrativeBlockProps {
  content: string;
  className?: string;
  animate?: boolean;
}

/**
 * NarrativeBlock: The High-Fluency 'Intelligence Dossier' Component.
 * Optimized for System 1 processing via authoritative serif typography 
 * and disciplined line lengths (65ch max).
 */
export default function NarrativeBlock({ content, className, animate = true }: NarrativeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const paragraphs = containerRef.current.querySelectorAll("p, h2, div");
    
    paragraphs.forEach((p) => {
      gsap.fromTo(
        p,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: p,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [animate, content]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "narrative-block font-sans text-zinc-900 leading-[1.65] selection:bg-purple-500/20",
        "max-w-[75ch] mx-auto text-lg md:text-xl antialiased tracking-[-0.01em]",
        className
      )}
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-10 last:mb-0 font-normal">{children}</p>,
          h2: ({ children }) => (
            <div className="mb-10 mt-16 first:mt-0">
               <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4 uppercase">{children}</h2>
               <div className="w-12 h-1 bg-purple-600 rounded-full" />
            </div>
          ),
          strong: ({ children }) => (
            <strong className="text-black font-bold underline decoration-purple-500/40 decoration-4 underline-offset-4">{children}</strong>
          ),
          em: ({ children }) => <em className="text-zinc-600 italic font-medium">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* Precision Decorative Element */}
      <div className="flex items-center gap-6 mt-16 opacity-10">
        <div className="flex-1 h-px bg-black" />
        <div className="text-[10px] font-mono tracking-[1em] uppercase">Diag_Report_End</div>
        <div className="flex-1 h-px bg-black" />
      </div>
    </div>
  );
}
