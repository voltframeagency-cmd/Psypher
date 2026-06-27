"use client";

import { useEffect, useRef, useState, useId, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function interpolateHex(color1: string, color2: string, factor: number): string {
  const parseHex = (c: string) => {
    // Handle short hex codes like #fff -> #ffffff
    if (c.length === 4) {
      return parseInt(c[1] + c[1] + c[2] + c[2] + c[3] + c[3], 16);
    }
    return parseInt(c.slice(1), 16);
  };

  const val1 = parseHex(color1);
  const val2 = parseHex(color2);

  const r1 = (val1 >> 16) & 0xff;
  const g1 = (val1 >> 8) & 0xff;
  const b1 = val1 & 0xff;

  const r2 = (val2 >> 16) & 0xff;
  const g2 = (val2 >> 8) & 0xff;
  const b2 = val2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export interface BklitGaugeProps {
  value: number; // Arc fill level 0–100
  centerValue: number; // Center statistic
  totalNotches?: number;
  spacing?: number; // % of arc reserved for gaps between notches
  notchCornerRadius?: number; // rounded corner radius in pixels
  uniformWidth?: boolean; // rectangular vs tapered notches
  startAngle?: number; // start angle in degrees
  endAngle?: number; // end angle in degrees
  useGradient?: boolean;
  activeGradient?: [string, string];
  inactiveGradient?: [string, string];
  activeFill?: string;
  inactiveFill?: string;
  activeFillOpacity?: number;
  inactiveFillOpacity?: number;
  defaultLabel?: string;
  prefix?: string;
  suffix?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  notchLengthPercent?: number; // length of notches (5-100)%
  className?: string;
  theme?: "light" | "dark";
}

export default function BklitGauge({
  value,
  centerValue,
  totalNotches = 40,
  spacing = 25,
  notchCornerRadius = 1,
  uniformWidth = false,
  startAngle = 135,
  endAngle = 405,
  useGradient = false,
  activeGradient = ["#a855f7", "#6D28D9"],
  inactiveGradient,
  activeFill,
  inactiveFill = "rgba(255, 255, 255, 0.03)",
  activeFillOpacity = 1,
  inactiveFillOpacity = 1,
  defaultLabel = "Total",
  prefix = "",
  suffix = "%",
  width,
  height,
  minWidth = 140,
  notchLengthPercent = 100,
  className = "",
  theme = "dark",
}: BklitGaugeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const componentId = useId().replace(/:/g, "");
  const [dimensions, setDimensions] = useState({ w: width || 200, h: height || 200 });

  // Handle auto-resizing if dimensions are not explicitly provided
  useEffect(() => {
    if (width && height) return;
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rect = entries[0].contentRect;
      const side = Math.max(rect.width || minWidth, rect.height || minWidth);
      setDimensions({ w: side, h: side });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [width, height, minWidth]);

  // Notch Coordinates & Paths Calculation
  const { notches, resolvedSize, cx, cy, notchLength } = useMemo(() => {
    const size = Math.min(dimensions.w, dimensions.h);
    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;

    const outerRadius = size * 0.44;
    const innerRadiusBase = size * 0.32;
    const defaultDepth = outerRadius - innerRadiusBase;
    const depthFactor = Math.min(100, Math.max(5, notchLengthPercent)) / 100;
    const notchLength = defaultDepth * depthFactor;
    const innerRadius = outerRadius - notchLength;

    const activeNotches = Math.round((Math.max(0, Math.min(100, value)) / 100) * totalNotches);
    const totalAngle = endAngle - startAngle;
    const availableAngle = totalAngle * (1 - spacing / 100);
    const notchAngle = totalNotches > 0 ? availableAngle / totalNotches : 0;
    const gapDen = totalNotches - 1 > 0 ? totalNotches - 1 : 1;
    const gapAngle = (totalAngle * (spacing / 100)) / gapDen;

    const activeGrad0 = activeGradient?.[0] || "#a855f7";
    const activeGrad1 = activeGradient?.[1] || "#6D28D9";
    const inactiveGrad0 = inactiveGradient?.[0] || activeGrad0;
    const inactiveGrad1 = inactiveGradient?.[1] || activeGrad1;

    const computed = Array.from({ length: totalNotches }, (_, i) => {
      const angle = startAngle + i * (notchAngle + gapAngle) + notchAngle / 2;
      const radians = (angle * Math.PI) / 180;
      const notchWidth = notchAngle * 0.8;
      const halfWidth = (notchWidth * Math.PI) / 180 / 2;

      const x1 = cx + Math.cos(radians - halfWidth) * outerRadius;
      const y1 = cy + Math.sin(radians - halfWidth) * outerRadius;
      const x2 = cx + Math.cos(radians + halfWidth) * outerRadius;
      const y2 = cy + Math.sin(radians + halfWidth) * outerRadius;

      let x3: number, y3: number, x4: number, y4: number;

      if (uniformWidth) {
        const perpX = Math.cos(radians);
        const perpY = Math.sin(radians);
        x3 = x2 - perpX * notchLength;
        y3 = y2 - perpY * notchLength;
        x4 = x1 - perpX * notchLength;
        y4 = y1 - perpY * notchLength;
      } else {
        x3 = cx + Math.cos(radians + halfWidth) * innerRadius;
        y3 = cy + Math.sin(radians + halfWidth) * innerRadius;
        x4 = cx + Math.cos(radians - halfWidth) * innerRadius;
        y4 = cy + Math.sin(radians - halfWidth) * innerRadius;
      }

      const denom = totalNotches > 1 ? totalNotches - 1 : 1;
      const factor = i / denom;
      const activeColor = useGradient ? interpolateHex(activeGrad0, activeGrad1, factor) : activeGrad1;
      const inactiveColor = useGradient && inactiveGradient ? interpolateHex(inactiveGrad0, inactiveGrad1, factor) : inactiveFill;

      return {
        index: i,
        points: { x1, y1, x2, y2, x3, y3, x4, y4 },
        isActive: i < activeNotches,
        activeColor,
        inactiveColor,
      };
    });

    return { notches: computed, resolvedSize: size, cx, cy, notchLength };
  }, [dimensions, value, totalNotches, spacing, startAngle, endAngle, uniformWidth, notchLengthPercent, useGradient, activeGradient, inactiveGradient, inactiveFill]);

  // SVG Path with Rounded Corners fillet calculation
  const createNotchPath = (points: typeof notches[0]["points"], radius: number, depth: number) => {
    const { x1, y1, x2, y2, x3, y3, x4, y4 } = points;
    if (radius <= 0) {
      return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(bx - ax, by - ay);

    const d12 = dist(x1, y1, x2, y2);
    const d23 = dist(x2, y2, x3, y3);
    const d34 = dist(x3, y3, x4, y4);
    const d41 = dist(x4, y4, x1, y1);

    const minEdge = Math.min(d12, d23, d34, d41);
    const cr = Math.min(radius, depth * 0.48, d12 * 0.49, d23 * 0.49, d34 * 0.49, d41 * 0.49, minEdge * 0.49);

    const r1 = Math.min(cr / d12, 0.49);
    const r2 = Math.min(cr / d23, 0.49);
    const r3 = Math.min(cr / d34, 0.49);
    const r4 = Math.min(cr / d41, 0.49);

    const p1a = { x: lerp(x1, x4, r4), y: lerp(y1, y4, r4) };
    const p1b = { x: lerp(x1, x2, r1), y: lerp(y1, y2, r1) };
    const p2a = { x: lerp(x2, x1, r1), y: lerp(y2, y1, r1) };
    const p2b = { x: lerp(x2, x3, r2), y: lerp(y2, y3, r2) };
    const p3a = { x: lerp(x3, x2, r2), y: lerp(y3, y2, r2) };
    const p3b = { x: lerp(x3, x4, r3), y: lerp(y3, y4, r3) };
    const p4a = { x: lerp(x4, x3, r3), y: lerp(y4, y3, r3) };
    const p4b = { x: lerp(x4, x1, r4), y: lerp(y4, y1, r4) };

    return `M ${p1a.x} ${p1a.y} Q ${x1} ${y1} ${p1b.x} ${p1b.y} L ${p2a.x} ${p2a.y} Q ${x2} ${y2} ${p2b.x} ${p2b.y} L ${p3a.x} ${p3a.y} Q ${x3} ${y3} ${p3b.x} ${p3b.y} L ${p4a.x} ${p4a.y} Q ${x4} ${y4} ${p4b.x} ${p4b.y} Z`;
  };

  // GSAP Animations (Notch Reveal Stagger + Text Count Up)
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Quick reveal of all inactive track notches
      gsap.fromTo(
        `.notch-inactive-${componentId}`,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
          },
        }
      );

      // 2. Staggered sweep reveal of active notches (like a loading bar sweeping clockwise)
      gsap.fromTo(
        `.notch-active-${componentId}`,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.015,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
          },
        }
      );

      // 3. Count up value display
      const counter = { val: 0 };
      if (countRef.current) {
        gsap.to(counter, {
          val: centerValue,
          duration: 1.6,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
          },
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.innerText = `${prefix}${Math.round(counter.val)}${suffix}`;
            }
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [centerValue, notches, componentId, prefix, suffix]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{
        width: width || "100%",
        height: height || "100%",
        minWidth,
      }}
    >
      <svg
        aria-hidden="true"
        className="overflow-visible"
        width={dimensions.w}
        height={dimensions.h}
        viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
      >
        {/* Draw Inactive Track Notches */}
        {notches.map((notch: any) => (
          <path
            key={`bg-${notch.index}`}
            className={`notch-inactive-${componentId} transition-all duration-300 origin-center hover:brightness-125`}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            d={createNotchPath(notch.points, notchCornerRadius, notchLength)}
            fill={notch.inactiveColor}
            fillOpacity={inactiveFillOpacity}
          />
        ))}

        {/* Draw Active Notches */}
        {notches
          .filter((n: any) => n.isActive)
          .map((notch: any) => (
            <path
              key={`active-${notch.index}`}
              className={`notch-active-${componentId} transition-all duration-300 origin-center hover:brightness-150`}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              d={createNotchPath(notch.points, notchCornerRadius, notchLength)}
              fill={activeFill || notch.activeColor}
              fillOpacity={activeFillOpacity}
            />
          ))}
      </svg>

      {/* Central Metric Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          ref={countRef}
          className={`${theme === "light" ? "text-zinc-950" : "text-white"} font-extralight tracking-tighter tabular-nums leading-none`}
          style={{ fontSize: `${resolvedSize * 0.22}px` }}
        >
          {prefix}0{suffix}
        </span>
        {defaultLabel && (
          <span
            className={`text-[9px] font-mono tracking-widest ${theme === "light" ? "text-purple-600" : "text-purple-400"} font-bold uppercase mt-1.5 opacity-80`}
            style={{ fontSize: `${Math.max(8, resolvedSize * 0.045)}px` }}
          >
            {defaultLabel}
          </span>
        )}
      </div>
    </div>
  );
}
