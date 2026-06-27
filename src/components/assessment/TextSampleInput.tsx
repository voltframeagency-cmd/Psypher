"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { LINGUISTIC_PROXY_SCENARIOS } from "@/config/scenarios";
import { cn } from "@/lib/utils";
import { ArrowRight, Activity, AlertTriangle } from "lucide-react";

interface TextSampleInputProps {
  onSubmit: (selectedIds: string[]) => void;
  onSkip: () => void;
}

export default function TextSampleInput({ onSubmit, onSkip }: TextSampleInputProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentScenario = LINGUISTIC_PROXY_SCENARIOS[activeStep];
  const progressPercent = ((activeStep) / LINGUISTIC_PROXY_SCENARIOS.length) * 100;

  useEffect(() => {
    // Initial fade in
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
    );
  }, []);

  // Animating transition between steps
  const handleSelectOption = (optionId: string) => {
    const updatedIds = [...selectedIds, optionId];
    setSelectedIds(updatedIds);

    if (activeStep < LINGUISTIC_PROXY_SCENARIOS.length - 1) {
      // Clean slide out and in transition for scenarios
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setActiveStep(prev => prev + 1);
          gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
          );
        }
      });
    } else {
      onSubmit(updatedIds); // Fires the zero-cost score compiler instantly
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
      </div>

      {/* Pre-Authored Choice Matrices */}
      <div className="space-y-4">
        {currentScenario.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option.id)}
            className="w-full p-6 text-left border-2 border-zinc-100 rounded-2xl bg-white hover:bg-zinc-50/50 hover:border-purple-500/30 transition-all duration-300 flex items-center justify-between group active:scale-[0.99] cursor-pointer"
          >
            <span className="text-base text-zinc-600 group-hover:text-zinc-900 font-medium font-sans leading-relaxed max-w-[90%]">
              {option.text}
            </span>
            <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:border-purple-500 group-hover:bg-purple-50 shrink-0 ml-4 transition-colors">
              <ArrowRight size={14} className="text-zinc-300 group-hover:text-purple-600 transition-colors" />
            </div>
          </button>
        ))}
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
