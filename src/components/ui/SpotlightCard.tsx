"use client";
import React, { useRef, useState } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  spotlightRange?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(139, 92, 246, 0.15)', // Premium violet spotlight to match Psypher's aesthetic
  spotlightRange = 350,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Spotlight highlight layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 will-change-transform"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${spotlightRange}px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      
      {/* Content slot */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
