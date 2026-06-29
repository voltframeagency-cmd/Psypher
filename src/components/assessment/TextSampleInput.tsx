"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { LINGUISTIC_PROXY_SCENARIOS } from "@/config/scenarios";
import { cn } from "@/lib/utils";
import { ArrowRight, Activity, Percent, Check, AlertTriangle } from "lucide-react";

interface TextSampleInputProps {
  onSubmit: (selectedIds: Record<string, number>) => void;
  onSkip: () => void;
}

export default function TextSampleInput({ onSubmit, onSkip }: TextSampleInputProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [latencies, setLatencies] = useState<Record<number, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const loadTimeRef = useRef<number>(Date.now());

  const currentScenario = LINGUISTIC_PROXY_SCENARIOS[activeStep];
  const progressPercent = ((activeStep) / LINGUISTIC_PROXY_SCENARIOS.length) * 100;

  // Retrieve current scenario options
  const optionIds = currentScenario.options.map(o => o.id);
  const valA = allocations[optionIds[0]] ?? 30;
  const valB = allocations[optionIds[1]] ?? 35;
  const valC = allocations[optionIds[2]] ?? 35;

  const totalAllocated = valA + valB + valC;

  useEffect(() => {
    // Initial fade in
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
    );
    loadTimeRef.current = Date.now();
  }, []);

  const handleSliderChange = (id: string, value: number) => {
    setAllocations(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNext = () => {
    if (totalAllocated !== 100) return;

    // Record response latency
    const latency = Date.now() - loadTimeRef.current;
    const updatedLatencies = {
      ...latencies,
      [currentScenario.id]: latency
    };
    setLatencies(updatedLatencies);

    // Save to session storage for longitudinal mlGVAR access
    sessionStorage.setItem("psypher_latencies", JSON.stringify(updatedLatencies));

    if (activeStep < LINGUISTIC_PROXY_SCENARIOS.length - 1) {
      // Transition to next step
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setActiveStep(prev => prev + 1);
          loadTimeRef.current = Date.now();
          gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
          );
        }
      });
    } else {
      // Complete assessment
      onSubmit(allocations);
    }
  };

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto px-6 py-20 font-outfit text-zinc-900">
      {/* Precision Micro Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-zinc-100 z-50">
        <div className="h-full bg-purple-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
      </div>

      <header className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-purple-600 animate-pulse" />
          <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-purple-600 font-black">
            VECTOR_B: LINGUISTIC_PROXY_SCAN // STEP {activeStep + 1} OF {LINGUISTIC_PROXY_SCENARIOS.length}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase text-zinc-900">
          {currentScenario.scenarioTitle}
        </h2>
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{currentScenario.domainContext}</p>
      </header>

      {/* Scenario Situation Block */}
      <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 mb-10 shadow-sm relative overflow-hidden">
        <p className="text-lg text-zinc-700 leading-relaxed font-normal">
          {currentScenario.context}
        </p>
        <div className="mt-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
          <AlertTriangle size={16} className="text-purple-600 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-800 leading-relaxed font-mono">
            <strong>IMPLICIT PROJECTION QUERY:</strong> Estimate the percentage of the general population that would select each response below. Allocations must sum to exactly 100%.
          </p>
        </div>
      </div>

      {/* Slider Controls for FCE */}
      <div className="space-y-6">
        {currentScenario.options.map((option, idx) => {
          const currentVal = allocations[option.id] ?? (idx === 0 ? 30 : 35);
          return (
            <div
              key={option.id}
              className="p-6 border-2 border-zinc-100 rounded-2xl bg-white transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-base text-zinc-700 font-medium font-sans leading-relaxed max-w-[85%]">
                  {option.text}
                </span>
                <span className="text-xl font-bold font-mono text-purple-600 bg-purple-50 px-3 py-1 rounded-lg shrink-0">
                  {currentVal}%
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-400">0%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentVal}
                  onChange={(e) => handleSliderChange(option.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <span className="text-xs font-mono text-zinc-400">100%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sum Indicator & Lock Button */}
      <div className="mt-8 p-6 rounded-2xl border border-zinc-100 bg-zinc-50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center text-white transition-colors",
            totalAllocated === 100 ? "bg-emerald-500" : "bg-amber-500"
          )}>
            {totalAllocated === 100 ? <Check size={12} /> : <span className="text-xs font-bold">!</span>}
          </div>
          <span className="text-sm font-mono text-zinc-600">
            Total Allocated: <strong className={cn(totalAllocated === 100 ? "text-emerald-600" : "text-amber-600")}>{totalAllocated}%</strong> (Must equal 100%)
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={totalAllocated !== 100}
          className={cn(
            "px-8 py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md",
            totalAllocated === 100
              ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-purple-500/20 active:scale-[0.98]"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          )}
        >
          {activeStep < LINGUISTIC_PROXY_SCENARIOS.length - 1 ? "Next Scenario" : "Lock Allocation"}
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Actions (Skip option) */}
      <div className="mt-16 flex items-center justify-between border-t border-zinc-100 pt-8">
        <button
          onClick={onSkip}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-4 decoration-zinc-200 cursor-pointer"
        >
          Skip behavioral assessment (Free Basic Report)
        </button>
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-300 font-black">
          SECURE CRYPTO MINT PROTOCOL
        </span>
      </div>
    </div>
  );
}
