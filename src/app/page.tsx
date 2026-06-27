'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Play, User, Shield, Brain, Zap, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MOCKUP_LAYERS = [
  {
    id: "BIG5",
    title: "01. THE UNCOMFORTABLE TRUTH",
    desc: "Your dominant trait is High Conscientiousness combined with High Machiavellianism. Your superpower is ruthless execution. Your fatal flaw is alienating your team when under pressure.",
    traits: [
      { name: "Openness", val: 85 },
      { name: "Conscientiousness", val: 42 },
      { name: "Extraversion", val: 91 },
      { name: "Agreeableness", val: 30 },
      { name: "Neuroticism", val: 65 }
    ]
  },
  {
    id: "DARK",
    title: "02. THE DARK TRIAD",
    desc: "Elevated Machiavellianism vectors detected. You optimize for outcomes over cohesion. Strategic empathy is deployed exclusively as an instrumental mechanism for stakeholder compliance.",
    traits: [
      { name: "Machiavellianism", val: 88 },
      { name: "Narcissism", val: 64 },
      { name: "Psychopathy", val: 21 },
      { name: "Risk Tolerance", val: 95 },
      { name: "Empathy Deficit", val: 45 }
    ]
  },
  {
    id: "COG",
    title: "03. COGNITIVE DYNAMICS",
    desc: "Extreme pattern recognition efficiency observed. You process complex, ambiguous datasets 40% faster than baseline, but experience rapid cognitive fatigue during repetitive, low-leverage tasks.",
    traits: [
      { name: "Pattern Recognition", val: 94 },
      { name: "Lateral Thinking", val: 82 },
      { name: "Processing Speed", val: 78 },
      { name: "Cognitive Load Cap", val: 88 },
      { name: "Systemizing", val: 91 }
    ]
  }
];

function RadarChartSection({ isActive }: { isActive: boolean }) {
  const [hoveredRadarIndex, setHoveredRadarIndex] = useState<number | null>(null);
  const [radarProgress, setRadarProgress] = useState(0);
  const tweenRef = useRef<any>(null);

  const getPentagonPoints = (r: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = 90 + r * Math.cos(angle);
      const y = 90 + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  const getRadarValuePoints = (progress: number) => {
    const traits = MOCKUP_LAYERS[0].traits;
    return traits.map((trait, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const r = 65 * (trait.val / 100) * progress;
      const x = 90 + r * Math.cos(angle);
      const y = 90 + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  useEffect(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    if (isActive) {
      const obj = { val: 0 };
      tweenRef.current = gsap.to(obj, {
        val: 1,
        duration: 1.3,
        delay: 0.15,
        ease: 'power4.out',
        onUpdate: () => setRadarProgress(obj.val),
      });
    } else {
      setRadarProgress(0);
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [isActive]);

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to SVG viewBox (0 to 180)
    const normX = (x / rect.width) * 180;
    const normY = (y / rect.height) * 180;
    
    let minD = Infinity;
    let minIdx = -1;
    
    const traits = MOCKUP_LAYERS[0].traits;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const r = 65 * (traits[i].val / 100) * radarProgress;
      const vx = 90 + r * Math.cos(angle);
      const vy = 90 + r * Math.sin(angle);
      const dx = normX - vx;
      const dy = normY - vy;
      const d = dx * dx + dy * dy;
      if (d < minD) {
        minD = d;
        minIdx = i;
      }
    }
    
    // Check if close enough (within 25px -> d < 625)
    if (minD < 625) {
      setHoveredRadarIndex(minIdx);
    } else {
      setHoveredRadarIndex(null);
    }
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 flex items-center justify-between gap-4 transition-all duration-500 ease-in-out",
        isActive ? "opacity-100 z-10 pointer-events-auto scale-100" : "opacity-0 z-0 pointer-events-none scale-[0.97]"
      )}
    >
      {/* Left Legend */}
      <div className="flex-1 flex flex-col gap-1.5 z-20">
        {MOCKUP_LAYERS[0].traits.map((trait, i) => {
          const isHovered = hoveredRadarIndex === i;
          return (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between py-1 px-1.5 rounded-lg border border-transparent transition-all duration-300 cursor-pointer",
                isHovered ? "bg-white/[0.04] border-white/5" : ""
              )}
              onMouseEnter={() => setHoveredRadarIndex(i)}
              onMouseLeave={() => setHoveredRadarIndex(null)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                <span className={cn(
                  "text-[9px] font-bold tracking-wider uppercase truncate transition-colors duration-300",
                  isHovered ? "text-white" : "text-gray-400"
                )}>
                  {trait.name}
                </span>
              </div>
              <span className={cn(
                "text-[9.5px] font-mono font-medium transition-colors duration-300",
                isHovered ? "text-[#A78BFA]" : "text-gray-500"
              )}>
                {trait.val}%
              </span>
            </div>
          );
        })}
      </div>
      {/* Right SVG */}
      <div className="w-[180px] h-[180px] flex items-center justify-center relative z-10">
        <svg 
          width={180} 
          height={180} 
          className="overflow-visible select-none"
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setHoveredRadarIndex(null)}
        >
          <defs>
            <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.45} />
            </radialGradient>
          </defs>
          {/* Grid concentric levels */}
          {[25, 50, 75, 100].map((lvl) => (
            <polygon
              key={lvl}
              points={getPentagonPoints(65 * (lvl / 100))}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={1}
            />
          ))}
          {/* Axis lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x2 = 90 + 65 * Math.cos(angle);
            const y2 = 90 + 65 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={90}
                y1={90}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
              />
            );
          })}
          {/* Filled Radar Area */}
          <polygon
            points={getRadarValuePoints(radarProgress)}
            fill="url(#radar-gradient)"
            stroke="#7C3AED"
            strokeWidth={1.5}
            filter="drop-shadow(0 0 5px rgba(124, 58, 237, 0.3))"
          />
          {/* Dots */}
          {MOCKUP_LAYERS[0].traits.map((trait, i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const r = 65 * (trait.val / 100) * radarProgress;
            const x = 90 + r * Math.cos(angle);
            const y = 90 + r * Math.sin(angle);
            const isHovered = hoveredRadarIndex === i;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={isHovered ? 4.5 : 2.5}
                fill="#7C3AED"
                stroke="#FFFFFF"
                strokeWidth={1}
                className="transition-[r] duration-200"
              />
            );
          })}
          {/* OCEAN Text Labels */}
          {["O", "C", "E", "A", "N"].map((char, i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = 90 + 78 * Math.cos(angle);
            const y = 90 + 78 * Math.sin(angle);
            const isHovered = hoveredRadarIndex === i;
            return (
              <text
                key={char}
                x={x}
                y={y + 3}
                textAnchor="middle"
                fill={isHovered ? "#7C3AED" : "#6B7280"}
                className="text-[9px] font-bold tracking-wider transition-colors duration-200"
              >
                {char}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function RingChartSection({ isActive }: { isActive: boolean }) {
  const [hoveredRingIndex, setHoveredRingIndex] = useState<number | null>(null);
  const [ringProgress, setRingProgress] = useState(0);
  const tweenRef = useRef<any>(null);

  useEffect(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    if (isActive) {
      const obj = { val: 0 };
      tweenRef.current = gsap.to(obj, {
        val: 1,
        duration: 1.3,
        delay: 0.15,
        ease: 'power4.out',
        onUpdate: () => setRingProgress(obj.val),
      });
    } else {
      setRingProgress(0);
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [isActive]);

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) * 180;
    const normY = (y / rect.height) * 180;
    
    const dx = normX - 90;
    const dy = normY - 90;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Rings are at radii: 74, 64, 54, 44, 34
    if (dist >= 69 && dist <= 79) setHoveredRingIndex(0);
    else if (dist >= 59 && dist <= 69) setHoveredRingIndex(1);
    else if (dist >= 49 && dist <= 59) setHoveredRingIndex(2);
    else if (dist >= 39 && dist <= 49) setHoveredRingIndex(3);
    else if (dist >= 29 && dist <= 39) setHoveredRingIndex(4);
    else setHoveredRingIndex(null);
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 flex items-center justify-between gap-4 transition-all duration-500 ease-in-out",
        isActive ? "opacity-100 z-10 pointer-events-auto scale-100" : "opacity-0 z-0 pointer-events-none scale-[0.97]"
      )}
    >
      {/* Left Legend */}
      <div className="flex-1 flex flex-col gap-1.5 z-20">
        {MOCKUP_LAYERS[1].traits.map((trait, i) => {
          const isHovered = hoveredRingIndex === i;
          const ringColors = ["#7C3AED", "#A78BFA", "#EC4899", "#06B6D4", "#10B981"];
          return (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between py-1 px-1.5 rounded-lg border border-transparent transition-all duration-300 cursor-pointer",
                isHovered ? "bg-white/[0.04] border-white/5" : ""
              )}
              onMouseEnter={() => setHoveredRingIndex(i)}
              onMouseLeave={() => setHoveredRingIndex(null)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ringColors[i] }} />
                <span className={cn(
                  "text-[9px] font-bold tracking-wider uppercase truncate transition-colors duration-300",
                  isHovered ? "text-white" : "text-gray-400"
                )}>
                  {trait.name}
                </span>
              </div>
              <span className={cn(
                "text-[9.5px] font-mono font-medium transition-colors duration-300"
              )} style={{ color: isHovered ? ringColors[i] : "#6B7280" }}>
                {trait.val}%
              </span>
            </div>
          );
        })}
      </div>
      {/* Right SVG */}
      <div className="w-[180px] h-[180px] flex items-center justify-center relative z-10">
        <svg 
          width={180} 
          height={180} 
          className="overflow-visible select-none"
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setHoveredRingIndex(null)}
        >
          {MOCKUP_LAYERS[1].traits.map((trait, i) => {
            const r = 74 - i * 10;
            const c = 2 * Math.PI * r;
            const ringColors = ["#7C3AED", "#A78BFA", "#EC4899", "#06B6D4", "#10B981"];
            const isHovered = hoveredRingIndex === i;
            const isFaded = hoveredRingIndex !== null && hoveredRingIndex !== i;
            const isPushedOut = hoveredRingIndex !== null && hoveredRingIndex < i;
            
            const strokeDashoffset = c - (c * (trait.val / 100)) * ringProgress;

            return (
              <g key={i}>
                {/* Background Track */}
                <circle
                  cx={90}
                  cy={90}
                  r={r}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth={5}
                  className="transition-[opacity,transform] duration-300"
                  style={{
                    opacity: isFaded ? 0.3 : 1,
                    transform: isHovered ? "scale(1.03)" : isPushedOut ? "scale(1.02)" : "scale(1)",
                    transformOrigin: "90px 90px"
                  }}
                />
                {/* Active Progress Ring */}
                <circle
                  cx={90}
                  cy={90}
                  r={r}
                  fill="none"
                  stroke={ringColors[i]}
                  strokeWidth={5}
                  strokeDasharray={c}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                  className="transition-[opacity,transform,filter] duration-300"
                  style={{
                    opacity: isFaded ? 0.4 : 1,
                    transform: `rotate(-90deg) ${isHovered ? "scale(1.03)" : isPushedOut ? "scale(1.02)" : "scale(1)"}`,
                    transformOrigin: "90px 90px",
                    filter: isHovered ? `drop-shadow(0 0 6px ${ringColors[i]})` : "none"
                  }}
                />
              </g>
            );
          })}
          {/* Center Info Text */}
          <text x={90} y={85} textAnchor="middle" fill="#6B7280" className="text-[7px] font-bold tracking-widest uppercase transition-all duration-300">
            {hoveredRingIndex !== null ? MOCKUP_LAYERS[1].traits[hoveredRingIndex].name : "Dark Triad"}
          </text>
          <text x={90} y={102} textAnchor="middle" fill="#FFFFFF" className="text-[14px] font-bold font-mono transition-all duration-300">
            {hoveredRingIndex !== null 
              ? `${MOCKUP_LAYERS[1].traits[hoveredRingIndex].val}%` 
              : `${Math.round(MOCKUP_LAYERS[1].traits.reduce((acc, t) => acc + t.val, 0) / 5)}%`
            }
          </text>
        </svg>
      </div>
    </div>
  );
}

function ProgressBarSection({ isActive }: { isActive: boolean }) {
  const [barProgress, setBarProgress] = useState(0);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const tweenRef = useRef<any>(null);

  useEffect(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    if (isActive) {
      const obj = { val: 0 };
      tweenRef.current = gsap.to(obj, {
        val: 1,
        duration: 1.3,
        delay: 0.15,
        ease: 'power4.out',
        onUpdate: () => setBarProgress(obj.val),
      });
    } else {
      setBarProgress(0);
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [isActive]);

  return (
    <div 
      className={cn(
        "absolute inset-0 space-y-5 transition-all duration-500 ease-in-out z-10 pointer-events-auto",
        isActive ? "opacity-100 z-10 pointer-events-auto scale-100" : "opacity-0 z-0 pointer-events-none scale-[0.97]"
      )}
    >
      {MOCKUP_LAYERS[2].traits.map((trait, i) => {
        const isHovered = hoveredBarIndex === i;
        const isDimmed = hoveredBarIndex !== null && hoveredBarIndex !== i;
        return (
          <div 
            key={i} 
            className={cn(
              "flex flex-col gap-1.5 overflow-hidden cursor-pointer transition-all duration-300 py-1 px-1.5 rounded-lg border border-transparent",
              isHovered ? "bg-white/[0.04] border-white/5" : "",
              isDimmed ? "opacity-40" : "opacity-100"
            )}
            onMouseEnter={() => setHoveredBarIndex(i)}
            onMouseLeave={() => setHoveredBarIndex(null)}
          >
            <div className="flex justify-between items-end">
              <span className={cn(
                "text-[10px] font-bold tracking-widest uppercase transition-colors duration-300",
                isHovered ? "text-white" : "text-gray-400"
              )}>
                {trait.name}
              </span>
              <span className={cn(
                "text-[10px] font-mono font-medium transition-colors duration-300",
                isHovered ? "text-[#A78BFA]" : "text-gray-500"
              )}>
                {trait.val}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-800/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]" 
                style={{ width: `${trait.val * barProgress}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const footerLogoRef = useRef<HTMLImageElement>(null);
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const lightSectionRef = useRef<HTMLDivElement>(null);
  const neuralSectionRef = useRef<HTMLDivElement>(null);
  const neuralVideoRef = useRef<HTMLVideoElement>(null);

  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayerIndex((prev) => (prev + 1) % MOCKUP_LAYERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize states with safety checks
      if (logoRef.current) gsap.set(logoRef.current, { filter: "invert(0)", maxWidth: "180px" });
      if (footerLogoRef.current) gsap.set(footerLogoRef.current, { filter: "invert(1) hue-rotate(180deg)", maxWidth: "120px" });
      gsap.set('.nav-item', { color: "#F5F0EB" });
      gsap.set('.nav-button', { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.2)" });

      // Moved color shift ScrollTriggers to the bottom of the GSAP ctx scope 
      // to ensure they calculate their positions after the pin-spacers are injected.

      // Hero Entrance Sequence
      const heroTl = gsap.timeline();
      heroTl
        .fromTo('#hero-reveal-circle', 
          { attr: { r: 0 } },
          { 
            attr: { r: 1.5 },
            duration: 1.8,
            ease: 'power3.inOut'
          },
          0
        )
        .fromTo('.hero-clip-notched',
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: 'power2.out' },
          0
        )
        .to('.hero-video', { opacity: 0.6, duration: 2, ease: 'power2.inOut' }, 0.2)
        .to('.hero-title span span', { 
          y: 0, 
          duration: 1.4, 
          stagger: 0.1, 
          ease: 'expo.out' 
        }, 0.2)
        .to('.hero-desc', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.8)
        .to('.hero-cta', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.8);
      
      // Hero Mouse Parallax
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth) - 0.5;
        const yPos = (clientY / window.innerHeight) - 0.5;

        // Subtle Tilt for content
        gsap.to('.hero-content', {
          rotationY: xPos * 4,
          rotationX: -yPos * 4,
          x: xPos * 10,
          y: yPos * 10,
          duration: 1.2,
          ease: 'power2.out'
        });

        // Floating Vignettes Parallax
        gsap.to('.vignette-float', {
          x: (i) => xPos * (40 + i * 20),
          y: (i) => yPos * (40 + i * 20),
          duration: 2,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      
      // Vignettes Floating (Base logic)
      gsap.utils.toArray('.vignette-float').forEach((el: any) => {
        gsap.to(el, {
          y: '+=20',
          x: '+=20',
          rotation: 'random(-10, 10)',
          duration: 'random(4, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // How It Works
      gsap.fromTo('.hiw-header', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: '#how-it-works', start: 'top 80%' } });
      gsap.fromTo('.hiw-card', 
        { y: 60, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power4.out', scrollTrigger: { trigger: '.hiw-card', start: 'top 85%' } }
      );

      // Agitation
      gsap.fromTo('.agitation-text', 
        { opacity: 0, filter: 'blur(15px)', y: 40 }, 
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.5, stagger: 0.3, ease: 'power2.out', scrollTrigger: { trigger: darkSectionRef.current, start: 'top 70%' } }
      );

      // Report Preview
      gsap.fromTo('.report-text', { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.report-text', start: 'top 75%' } });
      gsap.fromTo('.report-card', { x: 100, opacity: 0, rotationZ: 10 }, { x: 0, opacity: 1, rotationZ: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.report-card', start: 'top 75%' } });
      gsap.fromTo('.progress-bar-fill', { width: '0%' }, { width: (i, el) => el.getAttribute('data-width'), duration: 1.5, ease: 'power4.out', scrollTrigger: { trigger: '.report-card', start: 'top 60%' } });

      // Floating lock animation + Parallax
      gsap.to('.floating-lock', {
        y: -15,
        rotationZ: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      const reportCard = document.querySelector('.report-card');
      const floatingLock = document.querySelector('.floating-lock');
      
      if (reportCard && floatingLock) {
        reportCard.addEventListener('mousemove', (e: any) => {
          const rect = reportCard.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          
          gsap.to(floatingLock, {
            x: x * -40,
            y: y * -40,
            rotationY: x * 15,
            rotationX: -y * 15,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
        
        reportCard.addEventListener('mouseleave', () => {
          gsap.to(floatingLock, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 1.5,
            ease: 'elastic.out(1.2, 0.6)'
          });
        });
      }

      // Neural Canvas Image Sequence Scrubbing (The Apple Method)
      // We replaced the continuous video with a 240-frame image sequence for mathematically perfect scrubbing
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

      // Generic Reveals
      gsap.utils.toArray('.reveal-text').forEach((el: any) => {
        gsap.fromTo(el, 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });

      gsap.utils.toArray('.parallax-card').forEach((el: any) => {
        gsap.fromTo(el,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });

      // Number Ticker
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 12847, 
        duration: 2.5, 
        ease: 'power2.out', 
        scrollTrigger: { trigger: '.counter-text', start: 'top 85%' },
        onUpdate: () => {
          const el = document.querySelector('.counter-text');
          if (el) el.innerHTML = Math.floor(counterObj.val).toLocaleString();
        }
      });

      // Color shifts MUST be declared AFTER pin-spacers (like neural-canvas) 
      // so ScrollTrigger calculates their top/bottom positions accurately.
      ScrollTrigger.create({
        trigger: ".hero-section-wrapper",
        start: "top top",
        end: "bottom top",
        onLeave: () => {
          gsap.to('.nav-item', { color: "#111111", duration: 0.15 });
          gsap.to('.nav-button', { backgroundColor: "#111111", color: "#FFFFFF", border: "1px solid transparent", duration: 0.15 });
          if (logoRef.current) gsap.to(logoRef.current, { filter: "invert(0) hue-rotate(0deg)", duration: 0.15 });
        },
        onEnterBack: () => {
          gsap.to('.nav-item', { color: "#F5F0EB", duration: 0.15 });
          gsap.to('.nav-button', { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.2)", duration: 0.15 });
          if (logoRef.current) gsap.to(logoRef.current, { filter: "invert(0) hue-rotate(0deg)", duration: 0.15 });
        }
      });
      ScrollTrigger.create({
        trigger: darkSectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 0.3 });
          gsap.to('.nav-item', { color: "#F5F0EB", duration: 0.15 });
          if (logoRef.current) gsap.to(logoRef.current, { filter: "invert(1) hue-rotate(180deg)", duration: 0.15 });
          gsap.to('.nav-button', { backgroundColor: "#7C3AED", color: "#FFFFFF", border: "1px solid transparent", duration: 0.15 });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#FAFAF8", color: "#111111", duration: 0.3 });
          gsap.to('.nav-item', { color: "#111111", duration: 0.15 });
          if (logoRef.current) gsap.to(logoRef.current, { filter: "invert(0) hue-rotate(0deg)", duration: 0.15 });
          gsap.to('.nav-button', { backgroundColor: "#111111", color: "#FFFFFF", border: "1px solid transparent", duration: 0.15 });
        },
      });
      ScrollTrigger.create({
        trigger: lightSectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#FAFAF8", color: "#111111", duration: 0.3 });
          gsap.to('.nav-item', { color: "#111111", duration: 0.15 });
          if (logoRef.current) gsap.to(logoRef.current, { filter: "invert(0) hue-rotate(0deg)", duration: 0.15 });
          gsap.to('.nav-button', { backgroundColor: "#111111", color: "#FFFFFF", border: "1px solid transparent", duration: 0.15 });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 0.3 });
          gsap.to('.nav-item', { color: "#F5F0EB", duration: 0.15 });
          if (logoRef.current) gsap.to(logoRef.current, { filter: "invert(1) hue-rotate(180deg)", duration: 0.15 });
          gsap.to('.nav-button', { backgroundColor: "#7C3AED", color: "#FFFFFF", border: "1px solid transparent", duration: 0.15 });
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen transition-colors duration-700 bg-[#FAFAF8] text-[#111111] [--padding:16px] md:[--padding:24px] lg:[--padding:32px]">
      {/* Inline SVG defining the custom rounded notch clip-path for responsive scaling */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <clipPath id="hero-clip-reveal" clipPathUnits="objectBoundingBox">
            <circle id="hero-reveal-circle" cx="0.5" cy="0.5" r="0" />
          </clipPath>
          <clipPath id="hero-clip-notched" clipPathUnits="objectBoundingBox">
            <path 
              id="hero-clip-path"
              d="
                M 0, 0.94
                L 0, 0.22
                C 0, 0.1869 0.0157, 0.16 0.035, 0.16
                L 0.165, 0.16
                C 0.1843, 0.16 0.20, 0.1331 0.20, 0.10
                L 0.20, 0.06
                C 0.20, 0.0269 0.2157, 0 0.235, 0
                L 0.965, 0
                C 0.9843, 0 1, 0.0269 1, 0.06
                L 1, 0.68
                C 1, 0.7131 0.9843, 0.74 0.965, 0.74
                L 0.695, 0.74
                C 0.6757, 0.74 0.66, 0.7669 0.66, 0.80
                L 0.66, 0.94
                C 0.66, 0.9731 0.6443, 1 0.625, 1
                L 0.035, 1
                C 0.0157, 1 0, 0.9731 0, 0.94
                Z
              " 
            />
          </clipPath>
        </defs>
      </svg>
      {/* Navigation */}
      <nav ref={navRef} className="fixed top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 lg:top-8 lg:left-8 lg:right-8 z-50 px-6 md:px-[8%] py-4 md:py-6 flex items-center justify-between transition-all duration-500">
        <div className="flex items-center gap-3 md:absolute md:left-[9.5%] md:top-[calc(8vh-0.16*var(--padding))] md:-translate-x-1/2 md:-translate-y-1/2 transition-all duration-500">
          <img 
            ref={logoRef}
            src="/logo.svg" 
            alt="Psypher Logo" 
            className="h-10 md:h-12 w-auto transition-all duration-500" 
            style={{ filter: "invert(0)" }}
          />
        </div>
        <div className="hidden md:block flex-1" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#how-it-works" className="nav-item text-white/80 hover:text-white transition-all duration-500">How It Works</a>
          <a href="#pricing" className="nav-item text-white/80 hover:text-white transition-all duration-500">Pricing</a>
          <Link 
            href="/assessment" 
            className="nav-button px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full hover:scale-105 transition-all duration-500 backdrop-blur-sm"
          >
            Start Assessment
          </Link>
        </div>
      </nav>

      {/* Section 1: Hero Wrapper with carved-out underlay */}
      <div className="hero-section-wrapper relative bg-[#FAFAF8] w-full min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-stretch justify-stretch">
        {/* Underlay Content: Revealed in the carved-away notched spaces */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle Tech Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* Section 1: Hero (Clipped) */}
        <div className="flex-1 flex flex-col items-stretch justify-stretch hero-reveal-wrap">
          <section 
            className="relative flex-1 flex flex-col justify-center overflow-hidden bg-[#0F0F0F] text-[#F5F0EB] z-10 transition-all duration-500 hero-clip-notched"
          >
            <div className="noise-overlay" />
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="hero-video absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-0"
              src="https://cdn.midjourney.com/video/566125f4-4a32-4676-9bb6-34ae4b723d70/0.mp4"
            />
            {/* Animated Vignette 1 */}
            <svg className="vignette-float absolute top-1/4 right-1/4 w-80 h-80 text-[#7C3AED] opacity-20 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.4,-2.5C98,13.1,93.2,28.9,84.1,42.3C75,55.7,61.6,66.7,46.7,74.4C31.8,82.1,15.9,86.5,0.2,86.2C-15.5,85.9,-31,80.9,-44.6,72.6C-58.2,64.3,-69.9,52.7,-78.3,39.1C-86.7,25.5,-91.8,9.9,-91.3,-5.4C-90.8,-20.7,-84.7,-35.7,-75.2,-48.2C-65.7,-60.7,-52.8,-70.7,-38.8,-77.9C-24.8,-85.1,-9.7,-89.5,3.1,-94.1C15.9,-98.7,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>

            <div className="w-full relative z-10 px-8 md:pl-[20%] md:pr-[8%] lg:pl-[24%] lg:pr-[12%] pt-32 pb-16">
              <div className="max-w-4xl hero-content">
                <h1 className="hero-title text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-8 flex flex-wrap gap-x-4">
                  {["What", "is", "your", "personality", "costing", "you?"].map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden">
                      <span className="inline-block translate-y-[100%]">{word}</span>
                    </span>
                  ))}
                </h1>
                <p className="hero-desc text-xl md:text-2xl text-[#F5F0EB]/85 font-light max-w-2xl mb-12 leading-relaxed opacity-0">
                  Traditional personality tests put you in a box. We give you the keys to break out of it. Decode your psychological blueprint in 10 minutes.
                </p>
                <div className="hero-cta flex flex-col items-start gap-4 opacity-0">
                  <Link 
                    href="/assessment" 
                    className="shimmer-btn inline-flex items-center justify-center px-8 py-4 bg-[#7C3AED] text-white font-semibold rounded-full hover:bg-[#6D28D9] hover:scale-105 active:scale-[0.98] transition-all duration-300 group shadow-lg hover:shadow-[0_0_35px_rgba(124,58,237,0.35)] shadow-[#7C3AED]/20"
                  >
                    Get my free mini-report
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-sm text-[#F5F0EB]/50 font-medium">
                    No credit card required. Discover your dominant trait instantly.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-32 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto relative">
        {/* Animated Vignette */}
        <svg className="vignette-float absolute bottom-0 left-10 w-48 h-48 text-gray-200 opacity-50 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.9,-65.7C54.1,-60.5,69.6,-53.8,79.5,-41.8C89.4,-29.8,93.7,-12.5,91.3,4.1C88.9,20.7,79.8,36.6,67.6,48.8C55.4,61,40.1,69.5,23.9,75.1C7.7,80.7,-9.4,83.4,-25.2,79.5C-41,75.6,-55.5,65.1,-66.1,51.6C-76.7,38.1,-83.4,21.6,-84.9,4.7C-86.4,-12.2,-82.7,-29.5,-73.2,-43.6C-63.7,-57.7,-48.4,-68.6,-33.4,-73.3C-18.4,-78,-3.7,-76.5,10.2,-73.7C24.1,-70.9,37.3,-66.8,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>

        <div className="hiw-header mb-20 text-center relative z-10">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#7C3AED] mb-4 block">How It Works</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black">Seven dimensions. One truth.</h2>
        </div>
        
        {/* Row 1: 3 cards (Personality Architecture, Shadow Profile, Connection Blueprint) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 relative z-10">
          {/* Card 1: Personality Architecture */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-12 lg:col-span-4 h-auto lg:min-h-[148px] group">
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/40 blur-[40px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/30 blur-[40px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/30 blur-[40px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[42%] to prevent overlap) */}
            <div className="w-full pr-[42%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">01</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  THE BIG FIVE ARCHITECTURE
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Personality Architecture</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                The baseline of your psychological foundation. Reveals how you process information, manage stress, and interact with your environment.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
                  <line x1="50" y1="50" x2="20" y2="20" />
                  <circle cx="20" cy="20" r="2" fill="currentColor" />
                  <line x1="50" y1="50" x2="80" y2="20" />
                  <circle cx="80" cy="20" r="2" fill="currentColor" />
                  <line x1="50" y1="50" x2="15" y2="50" />
                  <circle cx="15" cy="50" r="2" fill="currentColor" />
                  <line x1="50" y1="50" x2="85" y2="50" />
                  <circle cx="85" cy="50" r="2" fill="currentColor" />
                  <line x1="50" y1="50" x2="30" y2="80" />
                  <circle cx="30" cy="80" r="2" fill="currentColor" />
                  <line x1="50" y1="50" x2="70" y2="80" />
                  <circle cx="70" cy="80" r="2" fill="currentColor" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/card-01-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[160%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 25px), -50%)' }}
                alt="Trait Map Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Trait Map
              </span>
            </div>
          </div>

          {/* Card 2: Shadow Profile */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-12 lg:col-span-4 h-auto lg:min-h-[148px] group">

            {/* Left Column: Text (pr-[42%] to prevent overlap) */}
            <div className="w-full pr-[42%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">02</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  THE DARK TRIAD
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Shadow Profile</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                The unfiltered reality of your darker traits. Machiavellianism — Narcissism — Psychopathy. Expose your blind spots.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <path d="M15 20 H40 V80" />
                  <circle cx="15" cy="20" r="2" fill="currentColor" />
                  <circle cx="40" cy="80" r="2" fill="currentColor" />
                  <path d="M85 20 H60 V80" />
                  <circle cx="85" cy="20" r="2" fill="currentColor" />
                  <circle cx="60" cy="80" r="2" fill="currentColor" />
                  <line x1="20" y1="50" x2="80" y2="50" strokeDasharray="2 2" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/card-02-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[160%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 22px), -48%)' }}
                alt="Shadow Signals Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Shadow Signals
              </span>
            </div>
          </div>

          {/* Card 3: Connection Blueprint */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-12 lg:col-span-4 h-auto lg:min-h-[148px] group">
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-50 group-hover:opacity-85 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/25 blur-[40px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/20 blur-[40px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/20 blur-[40px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[42%] to prevent overlap) */}
            <div className="w-full pr-[42%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">03</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  ATTACHMENT STYLE
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Connection Blueprint</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                Decodes your primary relationship script. Understand the patterns you attract. Master your interpersonal dynamics.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <path d="M20 35 L50 65 L80 35" />
                  <circle cx="20" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="50" cy="65" r="2.5" fill="currentColor" />
                  <circle cx="80" cy="35" r="2.5" fill="currentColor" />
                  <path d="M50 35 V65" strokeDasharray="3 3" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/card-03-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[165%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 22px), -50%)' }}
                alt="Trust Pattern Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Trust Pattern
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: 24-column Grid Container to handle custom card widths */}
        <div className="grid grid-cols-1 md:grid-cols-24 gap-6 mb-6 relative z-10">
          {/* Card 4: Cognitive Wiring */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-24 lg:col-span-7 h-auto lg:min-h-[148px] group">
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/40 blur-[40px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/30 blur-[40px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/30 blur-[40px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[42%] to prevent overlap) */}
            <div className="w-full pr-[42%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">04</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  COGNITIVE DYNAMICS
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Cognitive Wiring</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                Maps your internal processing hardware. Discover how you perceive complexity. Measure your cognitive endurance.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <path d="M25 20 V80 L50 55 H80" />
                  <circle cx="25" cy="20" r="2" fill="currentColor" />
                  <circle cx="80" cy="55" r="2" fill="currentColor" />
                  <circle cx="50" cy="55" r="2" fill="currentColor" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/card-04-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[170%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 15px), -46%)' }}
                alt="Decision Style Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Decision Style
              </span>
            </div>
          </div>

          {/* Card 5: Core Drivers */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-24 lg:col-span-5 h-auto lg:min-h-[148px] group">
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-40 group-hover:opacity-75 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/20 blur-[40px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/15 blur-[40px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/15 blur-[40px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[50%] to prevent overlap) */}
            <div className="w-full pr-[50%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">05</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  SCHWARTZ VALUES
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Core Drivers</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                Identifies the values dictating your priorities. Discover what motivates you. Act when stakes are highest.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <rect x="25" y="25" width="50" height="50" rx="3" transform="rotate(45 50 50)" />
                  <line x1="15" y1="50" x2="85" y2="50" />
                  <line x1="50" y1="15" x2="50" y2="85" />
                  <circle cx="50" cy="15" r="2" fill="currentColor" />
                  <circle cx="50" cy="85" r="2" fill="currentColor" />
                  <circle cx="15" cy="50" r="2" fill="currentColor" />
                  <circle cx="85" cy="50" r="2" fill="currentColor" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/core-drivers-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[165%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 30px), -50%)' }}
                alt="Value Drivers Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Value Drivers
              </span>
            </div>
          </div>

          {/* Card 6: Language Fingerprint */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-24 lg:col-span-5 h-auto lg:min-h-[148px] group">
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/40 blur-[40px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/30 blur-[40px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/30 blur-[40px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[50%] to prevent overlap) */}
            <div className="w-full pr-[50%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">06</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  LINGUISTIC ANALYSIS
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Language Fingerprint</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                Linguistic analysis of your communication style. Uncover emotional subtext — status signaling. Read the cognitive transparency.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <path d="M20 50 C 35 25, 65 25, 80 50" strokeDasharray="2 2" />
                  <path d="M20 50 C 35 75, 65 75, 80 50" />
                  <circle cx="20" cy="50" r="2" fill="currentColor" />
                  <circle cx="80" cy="50" r="2" fill="currentColor" />
                  <circle cx="50" cy="38" r="2" fill="currentColor" />
                  <circle cx="50" cy="62" r="2" fill="currentColor" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/card-05-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[165%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 30px), -50%)' }}
                alt="Language Signals Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Language Signals
              </span>
            </div>
          </div>

          {/* Card 7: Resilience Index */}
          <div className="hiw-card p-3.5 lg:p-[14px] border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden md:col-span-24 lg:col-span-7 h-auto lg:min-h-[148px] group">
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/40 blur-[40px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/30 blur-[40px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/30 blur-[40px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[42%] to prevent overlap) */}
            <div className="w-full pr-[42%] flex flex-col justify-center min-h-[120px] min-w-0 relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base lg:text-lg font-light text-black/15 tracking-tight font-sans leading-none">07</span>
                <div className="px-2 py-0.5 border border-black/[0.08] rounded-full text-[7.5px] font-bold text-black/40 uppercase tracking-widest bg-[#F5F5F3] whitespace-nowrap">
                  RESILIENCE INDEX
                </div>
              </div>
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold text-black mb-0.5 tracking-tight leading-tight">Resilience Index</h3>
              <p className="text-[9.5px] lg:text-[10px] xl:text-[10.5px] text-black/50 leading-snug font-normal">
                A benchmark of psychological durability. Measure your stress-response markers. Track your wellbeing stability.
              </p>
            </div>

            {/* Right Column: Absolute-positioned Graphic & Label */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <path d="M10 50 H 30 L 38 25 L 46 75 L 54 40 L 60 60 L 66 50 H 90" strokeWidth="1" />
                  <circle cx="10" cy="50" r="2" fill="currentColor" />
                  <circle cx="90" cy="50" r="2" fill="currentColor" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-24 h-24 rounded-full bg-[#7C3AED]/5 blur-[20px] pointer-events-none z-0" />
              {/* 3D Image */}
              <img 
                src="/assets/card-06-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[165%] w-auto max-w-none object-contain z-10 hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 28px), -50%)' }}
                alt="Stress Response Graphic" 
              />
              {/* Label */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white/80 backdrop-blur-sm border border-black/[0.08] rounded-full text-[9px] font-semibold text-black/60 tracking-normal font-sans z-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Stress Response
              </span>
            </div>
          </div>
        </div>

        {/* Row 3 CTA: centered spanning 10 columns and starting at column 8 in a 24-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-24 gap-6 mb-6 relative z-10">
          <Link 
            href="/assessment" 
            className="hiw-card border border-[#E8E4F3] rounded-[24px] bg-white/95 backdrop-blur-md p-3.5 lg:p-[14px] flex flex-col md:flex-row items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_15px_45px_rgb(124,58,237,0.04)] relative overflow-hidden group md:col-span-24 lg:col-span-10 lg:col-start-8 h-auto lg:min-h-[125px]"
          >
            {/* Animated Lumen-style Mesh Gradient Container */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden z-0 pointer-events-none rounded-r-[24px] opacity-75 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] rounded-full bg-[#7C3AED]/15 blur-[45px] animate-blob-1" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] rounded-full bg-[#EC4899]/12 blur-[45px] animate-blob-2" />
              <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#06B6D4]/12 blur-[45px] animate-blob-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-[1]" />
            </div>
            {/* Left Column: Text (pr-[42%] to prevent overlap) */}
            <div className="w-full pr-[42%] flex flex-col justify-center min-h-[97px] min-w-0 pl-4 relative z-10">
              <h3 className="text-xs lg:text-[12px] xl:text-[13px] font-bold tracking-tight text-black mb-0.5 leading-tight">
                Generate Your Detailed Dimension Report
              </h3>
              <p className="text-[10px] lg:text-[10.5px] xl:text-[11px] text-black/45 font-medium">
                Private Report / Report Preview CTA
              </p>
            </div>
            
            {/* Right Column: Absolute-positioned Graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none z-10">
              {/* Circuit board SVG background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-center justify-center">
                <svg className="w-full h-full text-[#7C3AED]/8" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <rect x="40" y="40" width="120" height="120" rx="8" strokeDasharray="3 3" />
                  <path d="M20 100 H 180" />
                  <path d="M100 20 V 180" />
                  <circle cx="100" cy="100" r="3" fill="currentColor" />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute w-28 h-28 rounded-full bg-[#7C3AED]/5 blur-[25px] pointer-events-none z-0" />
              <img 
                src="/assets/card-07-transparent.png" 
                className="absolute top-1/2 left-1/2 h-[170%] w-auto max-w-none object-contain z-10 group-hover:scale-105 transition-transform duration-500" 
                style={{ transform: 'translate(calc(-50% + 20px), -48%)' }}
                alt="Report Dossier Graphic" 
              />
            </div>
          </Link>
        </div>
      </section>

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

      {/* Section 3: The Agitation (Dark Mode Trigger) */}
      <section ref={darkSectionRef} className="py-32 px-8 md:px-24 min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Animated Vignette */}
        <svg className="vignette-float absolute top-1/3 right-10 w-96 h-96 text-[#7C3AED] opacity-10 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M51.8,-72.5C65.5,-61.5,73.8,-43.3,79.3,-24.1C84.8,-4.9,87.5,15.3,79.9,31.8C72.3,48.3,54.4,61.1,35.6,69.5C16.8,77.9,-2.9,81.9,-21.5,78.2C-40.1,74.5,-57.6,63.1,-69.5,47.4C-81.4,31.7,-87.7,11.7,-84.8,-7.1C-81.9,-25.9,-69.8,-43.5,-54.1,-55.1C-38.4,-66.7,-19.2,-72.3,0.8,-73.4C20.8,-74.5,41.6,-71.1,51.8,-72.5Z" transform="translate(100 100)" />
        </svg>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="agitation-text text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block">The Hidden Tax</span>
          <h2 className="agitation-text text-5xl md:text-7xl font-bold tracking-tighter mb-12">You are flying blind.</h2>
          
          <div className="space-y-8 text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
            <p className="agitation-text">
              You are working hard. You are putting in the hours. You are trying to say the right things in the right meetings.
            </p>
            <p className="agitation-text">
              But you keep hitting a ceiling. You watch people with half your talent get the promotions, the funding, and the relationships you want. You do not understand your own psychological wiring, which means you cannot control how others perceive you.
            </p>
            <p className="agitation-text text-[#F5F0EB] font-medium">
              This is the hidden tax of low self-awareness. It costs you money. It costs you influence. It costs you peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Report Preview */}
      <section className="py-32 px-8 md:px-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 report-text">
            <span className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block">Your Deep Report</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">The uncomfortable truth about how you operate.</h2>
            <Link 
              href="/assessment" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#7C3AED] text-white font-medium rounded-full hover:bg-[#6D28D9] transition-colors"
            >
              Unlock your report
            </Link>
          </div>
          <div className="flex-1 w-full report-card">
            <div 
              className="relative w-full aspect-[4/5] bg-[#1A1A1A] rounded-2xl border border-gray-800 p-8 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 relative z-20">
                <div className="text-[10px] font-mono tracking-[0.2em] text-[#7C3AED]">REPORT ID: #PZ-8274</div>
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-full px-2 py-1 select-none pointer-events-auto">
                  {MOCKUP_LAYERS.map((layer, idx) => (
                    <button
                      key={layer.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLayerIndex(idx);
                      }}
                      className={cn(
                        "w-3.5 h-1 rounded-full transition-all duration-300 cursor-pointer",
                        activeLayerIndex === idx ? "bg-[#7C3AED]" : "bg-gray-700 hover:bg-gray-500"
                      )}
                      title={layer.title}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-10 h-[220px] relative">
                <RadarChartSection isActive={activeLayerIndex === 0} />
                <RingChartSection isActive={activeLayerIndex === 1} />
                <ProgressBarSection isActive={activeLayerIndex === 2} />
              </div>

              <div className="flex-1 mt-2 relative overflow-hidden">
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#7C3AED] mb-3 uppercase animate-fade-in" key={`title-${activeLayerIndex}`}>
                  {MOCKUP_LAYERS[activeLayerIndex].title}
                </h4>
                <div className="space-y-4">
                  <p className="text-[11px] leading-relaxed text-gray-300 font-medium animate-fade-in" key={`desc-${activeLayerIndex}`}>
                    {MOCKUP_LAYERS[activeLayerIndex].desc}
                  </p>
                  <p className="text-[11px] leading-relaxed text-gray-400 opacity-60 blur-[1.5px] select-none">
                    Attachment style analysis detects secondary avoidant triggers under high-pressure cognitive load, impacting conflict-resolution speed and long-term team cohesion...
                  </p>
                  <p className="text-[11px] leading-relaxed text-gray-500 opacity-40 blur-[2.5px] select-none">
                    Strategic Machiavellianism markers are effectively utilized for project optimization while maintaining baseline professional trust and organizational velocity...
                  </p>
                  <p className="text-[11px] leading-relaxed text-gray-600 opacity-20 blur-[4px] select-none">
                    Core personality architecture remains stable under stress, however secondary DSM-5 cluster traits may emerge in isolation...
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/40 to-transparent pointer-events-none flex items-end justify-end pb-10 pr-10">
                <div className="relative group pointer-events-auto cursor-pointer z-30">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <span className="relative flex items-center gap-3 px-6 py-2 bg-[#0A0A0A]/80 border border-white/5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-[#A78BFA] shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#7C3AED]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]"></span>
                    Confidential Analysis
                  </span>
                </div>
              </div>
            </div>
            
            {/* 3D Floating Lock (Canva Export) */}
            <img 
              src="/assets/3D Lock.svg" 
              alt="Confidential Lock"
              className="absolute -left-16 -bottom-8 w-[350px] h-[350px] max-w-none object-contain drop-shadow-2xl pointer-events-none z-20 floating-lock"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
            />
          </div>
        </div>
      </section>

      {/* Section 5: Social Proof (Light Mode Trigger) */}
      <section ref={lightSectionRef} className="py-32 px-8 md:px-24 bg-[#FAFAF8] text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block reveal-text">What They Discovered</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter reveal-text">Real people. Real reports. Real change.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="parallax-card p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "I thought I was an introvert. Psypher showed me I was avoidant. That one insight saved my marriage."
              </p>
              <div className="font-medium">Sarah K.</div>
              <div className="text-sm text-gray-500">Product Manager</div>
            </div>
            <div className="parallax-card p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "The Dark Triad section made me uncomfortable. That is exactly why I needed it."
              </p>
              <div className="font-medium">James R.</div>
              <div className="text-sm text-gray-500">Executive Coach</div>
            </div>
          </div>
          
          <div className="text-center reveal-text">
            <div className="counter-text text-5xl font-bold tracking-tighter mb-2">12,847</div>
            <div className="text-gray-500 font-medium">reports generated this month.</div>
          </div>
        </div>
      </section>

      {/* Section 6: Pricing */}
      <section id="pricing" className="py-32 px-8 md:px-24 bg-[#FAFAF8] text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="block text-[#7C3AED] text-xs font-bold tracking-[0.4em] uppercase mb-4">One-Time Payment</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter reveal-text">Choose the depth you are ready for.</h2>
            <p className="text-gray-400 text-sm mt-6 max-w-md mx-auto">No subscriptions. No recurring charges. Pay once, keep your report forever.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="parallax-card p-8 bg-white rounded-2xl border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Basic Report</h3>
              <div className="text-4xl font-bold mb-6">Free</div>
              <p className="text-gray-600 mb-8 flex-1">See the surface. Your Big Five personality at a glance.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Core OCEAN Profile</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Facet Summaries</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Dominant Trait Analysis</li>
              </ul>
              <Link href="/assessment" className="w-full py-3 text-center border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Start Free Analysis
              </Link>
            </div>
            
            {/* Tier 2 (Highlighted) */}
            <div className="parallax-card p-8 bg-[#0F0F0F] text-[#F5F0EB] rounded-2xl border border-gray-800 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">The Deep Report</h3>
              <div className="text-4xl font-bold mb-6">$29</div>
              <p className="text-gray-400 mb-8 flex-1">The uncomfortable truth about how you operate. 7 frameworks. Zero sugarcoating.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Dark Triad Decoding</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Attachment Style Map</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Cognitive Mechanics</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> DSM-5 Risk Flags</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Schwartz Value Profile</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Conflict Strategy</li>
              </ul>
              <Link href="/assessment?tier=deep" className="w-full py-3 text-center bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors">
                Decode This Person — $29
              </Link>
            </div>
            
            {/* Tier 3 */}
            <div className="parallax-card p-8 bg-white rounded-2xl border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Compatibility Report</h3>
              <div className="text-4xl font-bold mb-6">$39</div>
              <p className="text-gray-600 mb-8 flex-1">Two minds. One verdict. See what happens when two personalities collide.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Two Full Deep Reports</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Friction Points Map</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Power Dynamics Analysis</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Resolution Blueprints</li>
              </ul>
              <Link href="/assessment?tier=compatibility" className="w-full py-3 text-center border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Compare Two People — $39
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA & Footer */}
      <section className="py-32 px-8 md:px-24 bg-[#0F0F0F] text-[#F5F0EB] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 reveal-text">Ready to decode your psychology?</h2>
          <p className="text-xl text-gray-400 mb-12 reveal-text">The cost of staying stuck is far greater than $29.</p>
          <Link 
            href="/assessment" 
            className="inline-flex items-center justify-center px-10 py-5 bg-[#7C3AED] text-white font-medium rounded-full hover:bg-[#6D28D9] transition-colors text-lg reveal-text"
          >
            Start my free assessment
          </Link>
        </div>
        
        <footer className="mt-32 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img 
              ref={footerLogoRef}
              src="/logo.svg" 
              alt="Psypher Logo" 
              className="h-8 md:h-10 w-auto" 
            />
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </footer>
      </section>
    </div>
  );
}
