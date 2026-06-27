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
  theme?: "light" | "dark";
}

/**
 * NarrativeBlock: The High-Fluency 'Intelligence Dossier' Component.
 * Optimized for System 1 processing via authoritative serif typography 
 * and disciplined line lengths (65ch max).
 */
export default function NarrativeBlock({ content, className, animate = true, theme = "light" }: NarrativeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll("p, h2, li, blockquote");
      if (targets && targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out"
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animate, content]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "narrative-block font-sans leading-[1.65] selection:bg-purple-500/20",
        theme === "light" ? "text-zinc-900" : "text-zinc-300",
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
               <h2 className={cn(
                 "text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase",
                 theme === "light" ? "text-black" : "text-white"
               )}>{children}</h2>
               <div className="w-12 h-1 bg-purple-600 rounded-full" />
            </div>
          ),
          strong: ({ children }) => (
            <strong className={cn(
              "font-bold underline decoration-purple-500/40 decoration-4 underline-offset-4",
              theme === "light" ? "text-black" : "text-white"
            )}>{children}</strong>
          ),
          em: ({ children }) => (
            <em className={cn(
              "italic font-medium",
              theme === "light" ? "text-zinc-600" : "text-zinc-400"
            )}>{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* Precision Decorative Element */}
      <div className="flex items-center gap-6 mt-16 opacity-10">
        <div className={cn("flex-1 h-px", theme === "light" ? "bg-black" : "bg-white")} />
        <div className="text-[10px] font-mono tracking-[1em] uppercase">Diag_Report_End</div>
        <div className={cn("flex-1 h-px", theme === "light" ? "bg-black" : "bg-white")} />
      </div>
    </div>
  );
}
