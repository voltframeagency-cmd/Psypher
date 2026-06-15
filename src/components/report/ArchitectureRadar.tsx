"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ArchitectureRadarProps {
  data: Record<string, number>; // BFI traits
  color?: string;
}

export default function ArchitectureRadar({ data, color = "#6D28D9" }: ArchitectureRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const polygonRef = useRef<SVGPolygonElement>(null);

  const traits = [
    "OPEN_MINDEDNESS", 
    "CONSCIENTIOUSNESS", 
    "EXTRAVERSION", 
    "AGREEABLENESS", 
    "NEGATIVE_EMOTIONALITY"
  ];

  const labels: Record<string, string> = {
    "OPEN_MINDEDNESS": "Openness",
    "CONSCIENTIOUSNESS": "Conscientiousness",
    "EXTRAVERSION": "Extraversion",
    "AGREEABLENESS": "Agreeableness",
    "NEGATIVE_EMOTIONALITY": "Emotionality"
  };

  const calculatePoints = (scores: Record<string, number>, radius: number) => {
    return traits.map((trait, i) => {
      const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
      const score = scores[trait] || 50;
      const r = (score / 100) * radius;
      const x = 200 + r * Math.cos(angle);
      const y = 200 + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  useEffect(() => {
    if (!polygonRef.current) return;

    gsap.fromTo(polygonRef.current, 
      { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" },
      { 
        opacity: 0.2, 
        scale: 1, 
        duration: 2, 
        ease: "power4.out",
        delay: 0.5 
      }
    );

    // Animate individual data points
    traits.forEach((trait, i) => {
      gsap.fromTo(`#node-${i}`, 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 1 + (i * 0.1), ease: "back.out(1.7)" }
      );
    });
  }, []);

  return (
    <div className="relative w-full max-w-[280px] mx-auto aspect-square bg-[#F8F9FA] rounded-3xl border border-black/[0.03] p-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", backgroundSize: "20px 20px" }} />
      
      <svg ref={svgRef} viewBox="0 0 400 400" className="w-full h-full relative z-10 drop-shadow-2xl">
        {/* Hexagonal Grid Lines */}
        {[20, 40, 60, 80, 100].map((r) => (
          <polygon
            key={r}
            points={traits.map((_, i) => {
              const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
              const x = 200 + (r * 1.5) * Math.cos(angle);
              const y = 200 + (r * 1.5) * Math.sin(angle);
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="black"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {traits.map((_, i) => {
          const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
          const x2 = 200 + 150 * Math.cos(angle);
          const y2 = 200 + 150 * Math.sin(angle);
          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="black"
              strokeOpacity="0.05"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Data Shape */}
        <polygon
          ref={polygonRef}
          points={calculatePoints(data, 150)}
          fill={color}
          fillOpacity="0.15"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Data Nodes */}
        {traits.map((trait, i) => {
          const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
          const score = data[trait] || 50;
          const r = (score / 100) * 150;
          const x = 200 + r * Math.cos(angle);
          const y = 200 + r * Math.sin(angle);
          
          return (
            <g key={trait} id={`node-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke={color}
                strokeWidth="2"
              />
              <text
                x={200 + 175 * Math.cos(angle)}
                y={200 + 175 * Math.sin(angle)}
                textAnchor="middle"
                className="text-[10px] font-mono font-black fill-black/40 uppercase tracking-widest"
              >
                {labels[trait]}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Stability HUD */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-1">
        <span className="text-[8px] font-mono text-black/20 uppercase tracking-[0.2em]">Architecture_Density</span>
        <span className="text-xl font-bold tracking-tighter text-black">
          {Math.round(Object.values(data).reduce((a, b) => a + b, 0) / traits.length)}%
        </span>
      </div>
    </div>
  );
}
