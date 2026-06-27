"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ArchitectureRadarProps {
  data: Record<string, number>; // BFI traits
  color?: string;
  hoveredTrait?: string | null;
  onHoverTrait?: (trait: string | null) => void;
  showLabels?: boolean;
  standalone?: boolean;
}

export default function ArchitectureRadar({ 
  data, 
  color = "#6D28D9",
  hoveredTrait = null,
  onHoverTrait,
  showLabels = true,
  standalone = true
}: ArchitectureRadarProps) {
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
    "OPEN_MINDEDNESS": "O",
    "CONSCIENTIOUSNESS": "C",
    "EXTRAVERSION": "E",
    "AGREEABLENESS": "A",
    "NEGATIVE_EMOTIONALITY": "N"
  };

  const traitKeyMapping: Record<string, string> = {
    "OPEN_MINDEDNESS": "Openness",
    "CONSCIENTIOUSNESS": "Conscientiousness",
    "EXTRAVERSION": "Extraversion",
    "AGREEABLENESS": "Agreeableness",
    "NEGATIVE_EMOTIONALITY": "Neuroticism"
  };

  const calculatePoints = (scores: Record<string, number>, radius: number) => {
    return traits.map((trait, i) => {
      const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
      const scoreKey = traitKeyMapping[trait] || trait;
      const score = scores[scoreKey] || 50;
      const r = (score / 100) * radius;
      const x = 200 + r * Math.cos(angle);
      const y = 200 + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  useEffect(() => {
    if (!polygonRef.current) return;

    gsap.fromTo(polygonRef.current, 
      { opacity: 0, scale: 0.5, transformOrigin: "200px 200px" },
      { 
        opacity: 0.3, 
        scale: 1, 
        duration: 2, 
        ease: "back.out(1.8)",
        delay: 0.5 
      }
    );

    // Animate individual data points with a springy ease
    traits.forEach((trait, i) => {
      gsap.fromTo(`#node-${i}`, 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, delay: 0.8 + (i * 0.1), ease: "back.out(3)" }
      );
    });
  }, []);

  return (
    <div className={standalone 
      ? "relative w-full max-w-[340px] mx-auto aspect-[6/5] bg-zinc-950/20 rounded-3xl border border-zinc-900 p-6 flex flex-col items-center justify-center overflow-hidden"
      : "relative w-full aspect-square flex flex-col items-center justify-center overflow-hidden"
    }>
      {/* Background Grid */}
      {standalone && (
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
      )}
      
      <svg ref={svgRef} viewBox="0 0 400 400" className="w-full h-full relative z-10 drop-shadow-2xl">
        <defs>
          <radialGradient id="radar-gradient-report" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
          </radialGradient>
        </defs>

        {/* Hexagonal Grid Lines (Rings at 20%, 40%, 60%, 80%, 100%) */}
        {[32, 64, 96, 128, 160].map((r) => (
          <polygon
            key={r}
            points={traits.map((_, i) => {
              const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
              const x = 200 + r * Math.cos(angle);
              const y = 200 + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="white"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {traits.map((trait, i) => {
          const scoreKey = traitKeyMapping[trait] || trait;
          const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
          const x2 = 200 + 160 * Math.cos(angle);
          const y2 = 200 + 160 * Math.sin(angle);
          const isHighlighted = hoveredTrait === scoreKey;
          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke={isHighlighted ? "#a855f7" : "white"}
              strokeOpacity={isHighlighted ? "0.6" : "0.1"}
              strokeWidth={isHighlighted ? "1.8" : "1"}
              strokeDasharray={isHighlighted ? "none" : "4 4"}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Data Shape */}
        <polygon
          ref={polygonRef}
          points={calculatePoints(data, 160)}
          fill="url(#radar-gradient-report)"
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Data Nodes */}
        {traits.map((trait, i) => {
          const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
          const scoreKey = traitKeyMapping[trait] || trait;
          const score = data[scoreKey] || 50;
          const r = (score / 100) * 160;
          const x = 200 + r * Math.cos(angle);
          const y = 200 + r * Math.sin(angle);
          const isHighlighted = hoveredTrait === scoreKey;
          
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          
          // Outer radius for label alignment (185px creates perfect separation)
          const labelRadius = 185;
          const labelX = 200 + labelRadius * cos;
          const labelY = 200 + labelRadius * sin + (sin < -0.5 ? -4 : (sin > 0.5 ? 9 : 3));
          
          return (
            <g 
              key={trait} 
              id={`node-${i}`}
              className="cursor-pointer group/node"
              onMouseEnter={() => onHoverTrait?.(scoreKey)}
              onMouseLeave={() => onHoverTrait?.(null)}
            >
              <circle
                cx={x}
                cy={y}
                r={isHighlighted ? "7" : "4.5"}
                fill={isHighlighted ? "#a855f7" : "white"}
                stroke={isHighlighted ? "white" : color}
                strokeWidth={isHighlighted ? "2" : "2.5"}
                className="transition-all duration-300 ease-out"
              />
              {isHighlighted && (
                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                >
                  <animate
                    attributeName="r"
                    from="7"
                    to="20"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {showLabels && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className={`text-[14px] font-sans font-black uppercase tracking-wider transition-all duration-300 ${
                    isHighlighted ? "fill-purple-400" : "fill-zinc-300 group-hover/node:fill-zinc-100"
                  }`}
                >
                  {labels[trait]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Stability HUD */}
      {standalone && (
        <div className="absolute bottom-5 left-5 flex flex-col gap-1">
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Architecture_Density</span>
          <span className="text-xl font-bold tracking-tighter text-white">
            {Math.round(traits.reduce((sum, trait) => sum + (data[traitKeyMapping[trait] || trait] || 50), 0) / traits.length)}%
          </span>
        </div>
      )}
    </div>
  );
}
