"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

const SECTIONS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "dimension-1", label: "Personality" },
  { id: "dimension-2", label: "Dark Triad" },
  { id: "dimension-3", label: "Relational" },
  { id: "dimension-4", label: "Cognitive" },
  { id: "dimension-5", label: "Drivers" },
  { id: "dimension-6", label: "Linguistics" },
  { id: "dimension-7", label: "Resiliency" },
];

export function StickyReportNav() {
  const [activeId, setActiveId] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show nav only after scrolling past top section
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible section
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" } // trigger earlier when scrolling
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: `#${id}`, offsetY: 80 }, // Offset for sticky header
      ease: "power3.inOut"
    });
  };

  return (
    <nav 
      className={`fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 w-48 transition-all duration-1000 ${
        isVisible ? "opacity-100 pointer-events-auto translate-x-0 blur-none" : "opacity-0 pointer-events-none -translate-x-4 blur-sm"
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-black/5" />
      
      {SECTIONS.map((section, idx) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`relative flex items-center group text-left px-4 ${
              isActive ? "opacity-100" : "opacity-30 hover:opacity-100"
            } transition-all duration-500`}
          >
            {/* Indicator Dot/Line */}
            <div className={`absolute left-[-1px] w-[3px] bg-[#6D28D9] transition-all duration-500 ${
              isActive ? "h-full scale-y-100" : "h-0 scale-y-0 group-hover:h-2"
            }`} />
            
            <div className={`text-[10px] uppercase font-mono tracking-widest pl-2 transition-all duration-500 flex items-center ${
              isActive ? "text-[#0A0A0A] font-black translate-x-2" : "text-[#0A0A0A] font-medium"
            }`}>
              <span className={`text-[#6D28D9] mr-2 text-[8px] ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                {String(idx).padStart(2, '0')}
              </span>
              {section.label}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
