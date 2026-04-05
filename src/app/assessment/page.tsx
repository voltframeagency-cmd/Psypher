"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { QUICK_SCAN_QUESTIONS, FULL_DECODE_QUESTIONS } from "@/config/questions";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const options = [
  { label: "Strongly Disagree", value: 1, size: "w-12 h-12" },
  { label: "Disagree", value: 2, size: "w-10 h-10" },
  { label: "Neutral", value: 3, size: "w-8 h-8" },
  { label: "Agree", value: 4, size: "w-10 h-10" },
  { label: "Strongly Agree", value: 5, size: "w-12 h-12" },
];

const BATCH_SIZE = 10;

// Utility for class concatenation
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tier = searchParams.get("tier");
  
  // Decide which question set to use
  const allQuestions = useMemo(() => {
    return (tier === "deep" || tier === "compatibility") ? FULL_DECODE_QUESTIONS : QUICK_SCAN_QUESTIONS;
  }, [tier]);

  const isBatchMode = allQuestions.length > 20;
  
  const [currentStep, setCurrentStep] = useState(0); // For Boutique Mode
  const [currentBatch, setCurrentBatch] = useState(0); // For Batch Mode
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  const totalSteps = isBatchMode ? Math.ceil(allQuestions.length / BATCH_SIZE) : allQuestions.length;
  const currentProgress = isBatchMode 
    ? ((currentBatch + 1) / totalSteps) * 100 
    : ((currentStep + 1) / totalSteps) * 100;

  // --- Boutique Mode Handlers ---
  const handleSingleAnswer = (value: number) => {
    const qId = allQuestions[currentStep].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (currentStep < allQuestions.length - 1) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0,
        filter: "blur(10px)",
        y: -20,
        duration: 0.3,
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          gsap.fromTo(contentRef.current, 
            { opacity: 0, filter: "blur(10px)", y: 20 },
            { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6, ease: "power4.out" }
          );
        }
      });
    } else {
      finishAssessment(newAnswers);
    }
  };

  // --- Batch Mode Handlers ---
  const handleBatchAnswer = (qId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const nextBatch = () => {
    // Validate all questions in current batch are answered
    const startIdx = currentBatch * BATCH_SIZE;
    const batchQuestions = allQuestions.slice(startIdx, startIdx + BATCH_SIZE);
    const allAnswered = batchQuestions.every(q => answers[q.id]);

    if (!allAnswered) {
      gsap.fromTo(".batch-error", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
      setTimeout(() => gsap.to(".batch-error", { opacity: 0, y: 10, duration: 0.4 }), 2500);
      return;
    }

    if (currentBatch < totalSteps - 1) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentBatch(currentBatch + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power4.out" }
          );
        }
      });
    } else {
      finishAssessment(answers);
    }
  };

  const prevBatch = () => {
    if (currentBatch > 0) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentBatch(currentBatch - 1);
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power4.out" }
          );
        }
      });
    }
  };

  const finishAssessment = (finalAnswers: Record<number, number>) => {
    setIsFinishing(true);
    sessionStorage.setItem("psypher_answers", JSON.stringify(finalAnswers));
    
    gsap.to(containerRef.current, {
      opacity: 0,
      filter: "blur(40px)",
      duration: 1.5,
      ease: "power3.inOut",
      onComplete: () => router.push("/report")
    });
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAFAF8] text-[#0B0B0B] font-outfit relative selection:bg-[#7C3AED]/10">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#7C3AED] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#7C3AED] blur-[150px] rounded-full" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100/50 z-[100]">
        <div 
          className="h-full bg-[#7C3AED] transition-all duration-1000 ease-out"
          style={{ width: `${currentProgress}%` }}
        />
      </div>

      {/* Nav */}
      <nav className="p-8 flex justify-between items-center bg-[#FAFAF8]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push("/")}>
          <span className="text-2xl transition-transform group-hover:scale-110">Ψ</span>
          <span className="text-sm font-bold tracking-[0.2em] font-mono">PSYPHER</span>
        </div>
        <div className="text-[9px] font-mono tracking-widest opacity-40 uppercase hidden md:block">
          SYNC_ACTIVE // {allQuestions.length}_DATA_NODES // Ψ
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        <div ref={contentRef} className="w-full">
          {!isBatchMode ? (
            // --- Boutique Mode UI (Single Question) ---
            <div className="text-center space-y-16 py-12 md:py-24">
              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-[0.4em] text-[#7C3AED] uppercase">
                  Node {currentStep + 1} of {allQuestions.length}
                </span>
                <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight max-w-3xl mx-auto">
                  {allQuestions[currentStep].text}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSingleAnswer(opt.value)}
                    className="group relative h-28 border border-gray-200/60 rounded-[2rem] flex flex-col items-center justify-center gap-3 overflow-hidden transition-all hover:border-[#7C3AED] hover:shadow-xl hover:shadow-[#7C3AED]/5"
                  >
                    <div className="absolute inset-0 bg-[#7C3AED] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative text-[10px] font-mono font-bold tracking-widest uppercase transition-colors group-hover:text-white px-2 text-center">
                      {opt.label}
                    </span>
                    <span className="relative text-xs opacity-20 group-hover:text-white/40 transition-colors">
                      {opt.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // --- Batch Mode UI (10 per screen) ---
            <div className="space-y-16 pb-40">
              <div className="text-center mb-16">
                <span className="text-[10px] font-mono tracking-[0.4em] text-[#7C3AED] uppercase mb-4 block">
                  Batch {currentBatch + 1} / {totalSteps}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Psychological Mapping</h1>
                <p className="text-gray-400 mt-4 text-sm max-w-lg mx-auto">Answer based on your overall behavior across different contexts.</p>
              </div>

              <div className="space-y-12">
                {allQuestions.slice(currentBatch * BATCH_SIZE, (currentBatch + 1) * BATCH_SIZE).map((q, idx) => (
                  <div key={q.id} className="space-y-10 py-12 border-b border-gray-100 last:border-0">
                    <div className="flex gap-6 items-start">
                      <span className="text-xs font-mono opacity-20 mt-1.5 md:mt-2">
                        {String((currentBatch * BATCH_SIZE) + idx + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl md:text-3xl font-medium flex-1 tracking-tight leading-snug">{q.text}</h2>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-0 justify-between px-2">
                      <span className="text-[9px] font-mono tracking-widest opacity-30 order-2 md:order-1 uppercase">Strongly Disagree</span>
                      <div className="flex items-center gap-5 md:gap-10 order-1 md:order-2">
                        {options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleBatchAnswer(q.id, opt.value)}
                            className={cn(
                              "rounded-full border-2 transition-all duration-500 flex items-center justify-center relative ring-offset-4 hover:ring-2 hover:ring-[#7C3AED]/20",
                              opt.size,
                              answers[q.id] === opt.value 
                                ? "bg-[#7C3AED] border-[#7C3AED] ring-2 ring-[#7C3AED]/10 shadow-lg shadow-[#7C3AED]/20 scale-110" 
                                : "border-gray-200/60 bg-white"
                            )}
                          >
                            {answers[q.id] === opt.value && <Check className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>
                      <span className="text-[9px] font-mono tracking-widest opacity-30 order-3 uppercase">Strongly Agree</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-16 border-t border-gray-100">
                <button 
                  onClick={prevBatch}
                  disabled={currentBatch === 0}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-20 text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Go Back
                </button>
                <div className="batch-error opacity-0 translate-y-2 text-[#7C3AED] text-[10px] font-mono tracking-widest uppercase font-bold text-center">
                   MISSING_DATA_POINTS // PLEASE COMPLETE ALL STATEMENTS
                </div>
                <button 
                  onClick={nextBatch}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-[#0B0B0B] text-white hover:bg-[#7C3AED] transition-all group text-sm font-medium shadow-xl shadow-[#0B0B0B]/10 hover:shadow-[#7C3AED]/20"
                >
                  {currentBatch === totalSteps - 1 ? "Complete Analysis" : "Analyze and Continue"}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isFinishing && (
        <div className="fixed inset-0 bg-[#FAFAF8] z-[200] flex items-center justify-center">
          <div className="text-center space-y-10">
            <div className="relative">
              <div className="w-20 h-20 border-t-2 border-b-2 border-[#7C3AED] rounded-full animate-spin mx-auto" />
              <span className="absolute inset-0 flex items-center justify-center text-xl">Ψ</span>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-mono tracking-[0.5em] uppercase animate-pulse">
                Synthesizing Neural Blueprint
              </p>
              <div className="flex items-center justify-center gap-3 opacity-30">
                <div className="h-0.5 w-12 bg-gray-400" />
                <p className="text-[9px] font-mono tracking-widest">
                  {Object.keys(answers).length} / {allQuestions.length} NODES_PROCESSED
                </p>
                <div className="h-0.5 w-12 bg-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Footer Metatag */}
      <footer className="py-12 border-t border-gray-50 text-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-mono tracking-[0.3em]">
          DATA_INTEGRITY_VERIFIED // SECURE_SOCKET_TRANSFER // PSYPHER_SYSTEM_AUTO
        </p>
      </footer>
    </main>
  );
}
