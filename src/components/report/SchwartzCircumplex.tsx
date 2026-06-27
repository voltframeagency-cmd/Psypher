"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  Compass, Zap, Flame, Trophy, Crown, 
  Shield, Scale, History, Heart, Globe,
  Activity
} from "lucide-react";

interface SchwartzCircumplexProps {
  data: Record<string, number>;
  hoveredValue: string | null;
  onHoverValue: (value: string | null) => void;
}

// 10 Schwartz values ordered from innermost (0) to outermost (9)
const VALUES_ORDER = [
  { key: "Universalism", label: "Universalism", icon: Globe, color: "#10b981", quadrant: "Self-Transcendence" },
  { key: "Benevolence", label: "Benevolence", icon: Heart, iconColor: "#10b981", color: "#10b981", quadrant: "Self-Transcendence" },
  { key: "Tradition", label: "Tradition", icon: History, color: "#06b6d4", quadrant: "Conservation" },
  { key: "Conformity", label: "Conformity", icon: Scale, color: "#06b6d4", quadrant: "Conservation" },
  { key: "Security", label: "Security", icon: Shield, color: "#06b6d4", quadrant: "Conservation" },
  { key: "Power", label: "Power", icon: Crown, color: "#f43f5e", quadrant: "Self-Enhancement" },
  { key: "Achievement", label: "Achievement", icon: Trophy, color: "#f43f5e", quadrant: "Self-Enhancement" },
  { key: "Hedonism", label: "Hedonism", icon: Flame, color: "#a855f7", quadrant: "Openness to Change" },
  { key: "Stimulation", label: "Stimulation", icon: Zap, color: "#a855f7", quadrant: "Openness to Change" },
  { key: "SelfDirection", label: "Self-Direction", icon: Compass, color: "#a855f7", quadrant: "Openness to Change" }
];

export default function SchwartzCircumplex({ 
  data, 
  hoveredValue, 
  onHoverValue 
}: SchwartzCircumplexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const centerRef = useRef<HTMLDivElement>(null);

  // Calculate average index score for default center state
  const averageScore = Math.round(
    VALUES_ORDER.reduce((acc, curr) => acc + (data[curr.key] || 50), 0) / VALUES_ORDER.length
  );

  useEffect(() => {
    // Staggered ring drawing animation on mount
    circleRefs.current.forEach((circle, i) => {
      if (!circle) return;
      const item = VALUES_ORDER[i];
      const score = data[item.key] || 50;
      const r = 95 + i * 9;
      const circumference = 2 * Math.PI * r;
      const targetOffset = circumference * (1 - score / 100);

      gsap.fromTo(circle, 
        { strokeDashoffset: circumference },
        { 
          strokeDashoffset: targetOffset,
          duration: 1.6, 
          delay: i * 0.08, 
          ease: "power2.out"
        }
      );
    });
  }, [data]);

  // Determine active display details based on hover
  const activeItem = VALUES_ORDER.find(item => item.key === hoveredValue);
  const ActiveIcon = activeItem ? activeItem.icon : Activity;
  const activeValueScore = activeItem ? (data[activeItem.key] || 50) : averageScore;
  const activeLabel = activeItem ? activeItem.label : "DRIVERS INDEX";
  const activeSublabel = activeItem ? activeItem.quadrant : "Psypher Calibration";
  const activeColor = activeItem ? activeItem.color : "#6D28D9";

  // Clean fade transitions for center HUD content on change
  useEffect(() => {
    if (centerRef.current) {
      gsap.fromTo(centerRef.current,
        { opacity: 0.3, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [hoveredValue]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[440px] mx-auto aspect-square flex items-center justify-center bg-zinc-950/20 rounded-[2.5rem] border border-zinc-900/60 p-4 overflow-hidden shadow-2xl"
    >
      {/* Decorative technical grid background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", 
          backgroundSize: "20px 20px" 
        }} 
      />

      {/* Central Interactive HUD (Donut hole) */}
      <div className="absolute w-[180px] h-[180px] rounded-full bg-[#030303]/90 border border-zinc-900/80 flex flex-col items-center justify-center text-center z-20 backdrop-blur-md shadow-inner pointer-events-none">
        <div ref={centerRef} className="flex flex-col items-center justify-center p-4">
          <ActiveIcon 
            size={22} 
            className="transition-colors duration-300 mb-1" 
            style={{ color: activeColor }} 
          />
          <span className="text-[32px] font-bold tracking-tighter text-white font-mono leading-none">
            {activeValueScore}%
          </span>
          <span 
            className="text-[9.5px] font-mono tracking-widest font-black uppercase mt-1.5 px-2 py-0.5 rounded transition-all duration-300"
            style={{ 
              color: activeColor, 
              backgroundColor: activeItem ? `${activeColor}10` : "transparent",
              border: activeItem ? `1px solid ${activeColor}20` : "1px solid transparent"
            }}
          >
            {activeLabel}
          </span>
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5">
            {activeSublabel}
          </span>
        </div>
      </div>

      {/* Concentric Progress SVG Graphics */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
      >
        <g>
          {VALUES_ORDER.map((item, i) => {
            const score = data[item.key] || 50;
            const r = 95 + i * 9;
            const circumference = 2 * Math.PI * r;
            
            // Highlight styling states
            const isHovered = hoveredValue === item.key;
            const isAnyHovered = hoveredValue !== null;
            
            // Dim other rings slightly when one is hovered to emphasize
            const strokeOpacity = isHovered 
              ? 1.0 
              : isAnyHovered 
                ? 0.15 
                : 0.85;
                
            const strokeWidth = isHovered ? 9.0 : 6.5;

            return (
              <g key={item.key}>
                {/* Background Track Circle */}
                <circle
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={6.5}
                  strokeOpacity={isHovered ? 0.12 : 0.04}
                  className="transition-all duration-300"
                />

                {/* Concentric Progress Circle */}
                <circle
                  ref={(el) => { circleRefs.current[i] = el; }}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  transform="rotate(-90 200 200)"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 5px ${item.color}80)` : "none"
                  }}
                  className="transition-[stroke-width,stroke-opacity] duration-300 ease-out"
                />

                {/* Thick Invisible Hover Target Circle overlay */}
                <circle
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={18}
                  className="cursor-pointer"
                  onMouseEnter={() => onHoverValue(item.key)}
                  onMouseLeave={() => onHoverValue(null)}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
