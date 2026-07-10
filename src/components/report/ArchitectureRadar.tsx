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
  semData?: Record<string, number>;
  stressData?: Record<string, number>;
  showStress?: boolean;
}

export default function ArchitectureRadar({ 
  data, 
  color = "#6D28D9",
  hoveredTrait = null,
  onHoverTrait,
  showLabels = true,
  standalone = true,
  semData,
  stressData,
  showStress = false,
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

  const calculateSemPoints = (scores: Record<string, number>, semScores: Record<string, number> | undefined, radius: number, type: "inner" | "outer") => {
    return traits.map((trait, i) => {
      const angle = (i / traits.length) * 2 * Math.PI - Math.PI / 2;
      const scoreKey = traitKeyMapping[trait] || trait;
      const score = scores[scoreKey] || 50;
      const semVal = semScores?.[scoreKey] || 7.2;
      const finalScore = type === "inner" ? Math.max(0, score - semVal) : Math.min(100, score + semVal);
      const r = (finalScore / 100) * radius;
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
            strokeOpacity="0.08"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
        ))}

        {/* Oscilloscope Center Crosshair */}
        <path 
          d="M 188,200 L 212,200 M 200,188 L 200,212 M 200,100 L 200,105 M 200,300 L 200,295 M 100,200 L 105,200 M 300,200 L 295,200" 
          stroke="white" 
          strokeOpacity="0.2" 
          strokeWidth="0.8" 
        />

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
              strokeOpacity={isHighlighted ? "0.6" : "0.08"}
              strokeWidth={isHighlighted ? "1.5" : "0.8"}
              strokeDasharray={isHighlighted ? "none" : "3 5"}
              className="transition-all duration-300"
            />
          );
        })}

        {/* SEM Confidence Bands */}
        {semData && (
          <>
            {/* Outer envelope */}
            <polygon
              points={calculateSemPoints(data, semData, 160, "outer")}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              strokeDasharray="2 4"
              opacity="0.2"
              className="transition-all duration-1000 ease-in-out"
            />
            {/* Inner envelope */}
            <polygon
              points={calculateSemPoints(data, semData, 160, "inner")}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              strokeDasharray="2 4"
              opacity="0.2"
              className="transition-all duration-1000 ease-in-out"
            />
          </>
        )}

        {/* Stress state volatility curve */}
        {showStress && stressData && (
          <polygon
            points={calculatePoints(stressData, 160)}
            fill="rgba(239, 68, 68, 0.03)"
            stroke="#ef4444"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            opacity="0.75"
            className="transition-all duration-1000 ease-in-out"
          />
        )}

        {/* Data Shape */}
        <polygon
          ref={polygonRef}
          points={calculatePoints(data, 160)}
          fill="url(#radar-gradient-report)"
          stroke={color}
          strokeWidth="2"
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

          const stressScore = stressData?.[scoreKey];
          const showStressIndicator = showStress && stressScore !== undefined;
          const stressR = showStressIndicator ? (stressScore / 100) * 160 : 0;
          const stressX = 200 + stressR * Math.cos(angle);
          const stressY = 200 + stressR * Math.sin(angle);
          
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
              {/* Baseline Node */}
              <circle
                cx={x}
                cy={y}
                r={isHighlighted ? "6.5" : "4"}
                fill={isHighlighted ? "#a855f7" : "white"}
                stroke={isHighlighted ? "white" : color}
                strokeWidth={isHighlighted ? "1.5" : "2"}
                className="transition-all duration-300 ease-out"
              />

              {/* Stress State Node */}
              {showStressIndicator && (
                <circle
                  cx={stressX}
                  cy={stressY}
                  r={isHighlighted ? "6" : "3.5"}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-1000 ease-in-out"
                  opacity="0.9"
                />
              )}

              {isHighlighted && (
                <>
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="#a855f7"
                    className="font-mono text-[8px] font-black fill-purple-450 pointer-events-none"
                  >
                    {score}%
                  </text>
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
                </>
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
