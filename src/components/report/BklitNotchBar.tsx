"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BklitNotchBarProps {
  value: number; // 0-100 progress value
  segments?: number; // total number of discrete blocks
  activeColor?: string; // Tailwind class name or custom color style
  inactiveColor?: string; // Tailwind class for tracking blocks
  className?: string;
}

export default function BklitNotchBar({
  value,
  segments = 10,
  activeColor = "bg-purple-600 shadow-[0_0_10px_rgba(109,40,217,0.3)]",
  inactiveColor = "bg-zinc-950/80 border border-zinc-900",
  className = "",
}: BklitNotchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSegments = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const activeFills = containerRef.current?.querySelectorAll(".notch-active-fill");
      if (activeFills && activeFills.length > 0) {
        gsap.fromTo(
          activeFills,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 95%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [value, segments]);

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full items-center gap-1.5 h-3", className)}
    >
      {Array.from({ length: segments }).map((_, i) => {
        const isActive = i < activeSegments;
        return (
          <div
            key={i}
            className={cn(
              "flex-1 h-full rounded-sm relative overflow-hidden",
              inactiveColor
            )}
          >
            {isActive && (
              <div
                className={cn(
                  "notch-active-fill absolute inset-0 w-full h-full rounded-sm origin-left",
                  activeColor
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
