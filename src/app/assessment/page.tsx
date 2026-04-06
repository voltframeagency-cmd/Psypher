"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { QUICK_SCAN_QUESTIONS, FULL_DECODE_QUESTIONS, Question } from "@/config/questions";
import { ChevronLeft, ChevronRight, Check, Activity, Cpu, Shield, Zap } from "lucide-react";

const options = [
  { label: "Strongly Disagree", value: 1, size: "w-14 h-14" },
  { label: "Disagree", value: 2, size: "w-11 h-11" },
  { label: "Neutral", value: 3, size: "w-9 h-9" },
  { label: "Agree", value: 4, size: "w-11 h-11" },
  { label: "Strongly Agree", value: 5, size: "w-14 h-14" },
];

const BATCH_SIZE = 10;

// Utility for class concatenation
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const BiometricTouchpoint = ({ 
  value, 
  active, 
  onClick, 
  size 
}: { 
  value: number; 
  active: boolean; 
  onClick: () => void; 
  size: string 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center transition-all duration-500 group",
        size
      )}
    >
      {/* Outer Ring */}
      <div className={cn(
        "absolute inset-0 rounded-full border border-zinc-200 transition-all duration-700",
        active ? "scale-125 border-purple-500/50 opacity-100" : "group-hover:border-purple-300 opacity-40"
      )} />
      
      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-purple-500/0 blur-md transition-all duration-500",
        active ? "bg-purple-500/10 scale-150" : "group-hover:bg-purple-500/5"
      )} />

      {/* Internal Core */}
      <div className={cn(
        "w-2 h-2 rounded-full transition-all duration-500 ease-out",
        active 
          ? "bg-purple-500 scale-[2.5] shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
          : "bg-zinc-300 group-hover:bg-purple-400 group-hover:scale-150"
      )} />

      {/* Ripple */}
      {active && (
        <div className="absolute inset-0 rounded-full border border-purple-500 animate-ping opacity-20" />
      )}
    </button>
  );
};

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tier = searchParams.get("tier");
  
  const allQuestions = useMemo(() => {
    return (tier === "deep" || tier === "compatibility") ? FULL_DECODE_QUESTIONS : QUICK_SCAN_QUESTIONS;
  }, [tier]);

  const isBatchMode = allQuestions.length > 20;
  
  const [currentStep, setCurrentStep] = useState(0); 
  const [currentBatch, setCurrentBatch] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power4.out" }
    );
  }, []);

  const totalSteps = isBatchMode ? Math.ceil(allQuestions.length / BATCH_SIZE) : allQuestions.length;
  const currentProgress = isBatchMode 
    ? ((currentBatch + 1) / totalSteps) * 100 
    : ((currentStep + 1) / totalSteps) * 100;

  // --- Neural Phase Mapping ---
  const getPhaseName = (batchIndex: number) => {
    const startIdx = batchIndex * BATCH_SIZE;
    const q = allQuestions[startIdx];
    if (!q) return "NEURAL_PHASE_FINAL";
    
    switch (q.category) {
      case "BFI": return "NEURAL_PHASE_01: CORE_REACTION";
      case "DT": return "NEURAL_PHASE_02: SHADOW_VECTORS";
      case "ATTACH": return "NEURAL_PHASE_03: RELATIONAL_DYNAMICS";
      case "VALUE": return "NEURAL_PHASE_04: VALUE_ALIGNMENT";
      default: return `NEURAL_PHASE_${String(batchIndex + 1).padStart(2, '0')}`;
    }
  };

  const handleSingleAnswer = (value: number) => {
    const qId = allQuestions[currentStep].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (currentStep < allQuestions.length - 1) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0,
        filter: "blur(20px)",
        y: -30,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          gsap.fromTo(contentRef.current, 
            { opacity: 0, filter: "blur(20px)", y: 30 },
            { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, ease: "power4.out" }
          );
        }
      });
    } else {
      finishAssessment(newAnswers);
    }
  };

  const handleBatchAnswer = (qId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    gsap.fromTo(".processing-flicker", 
      { opacity: 0.5 }, 
      { opacity: 1, duration: 0.1, yoyo: true, repeat: 1 }
    );
  };

  const nextBatch = () => {
    const startIdx = currentBatch * BATCH_SIZE;
    const batchQuestions = allQuestions.slice(startIdx, startIdx + BATCH_SIZE);
    const allAnswered = batchQuestions.every(q => answers[q.id]);

    if (!allAnswered) {
      gsap.fromTo(".batch-error", 
        { opacity: 0, x: -10 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
      );
      return;
    }

    if (currentBatch < totalSteps - 1) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0,
        x: -40,
        filter: "blur(15px)",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentBatch(currentBatch + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: 40, filter: "blur(15px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" }
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
        x: 40,
        filter: "blur(15px)",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentBatch(currentBatch - 1);
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: -40, filter: "blur(15px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" }
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
      filter: "blur(60px)",
      scale: 1.05,
      duration: 2,
      ease: "power3.inOut",
      onComplete: () => router.push("/report")
    });
  };

  const batchQuestions = useMemo(() => {
    return allQuestions.slice(currentBatch * BATCH_SIZE, (currentBatch + 1) * BATCH_SIZE);
  }, [allQuestions, currentBatch]);

  const answeredInBatch = useMemo(() => {
    return batchQuestions.filter(q => answers[q.id]).length;
  }, [batchQuestions, answers]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-zinc-900 font-outfit relative selection:bg-purple-500/10 overflow-x-hidden">
      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-400 blur-[180px] rounded-full" />
      </div>

      {/* Progress Matrix Header */}
      <header className="fixed top-0 left-0 w-full z-[100] border-b border-zinc-100/50 bg-[#FDFDFD]/80 backdrop-blur-2xl">
        <div className="h-1.5 w-full bg-zinc-100/50">
          <div 
            className="h-full bg-purple-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg text-white font-bold text-lg transition-transform group-hover:scale-110">Ψ</div>
            <span className="text-xs font-bold tracking-[0.4em] font-mono text-zinc-400 group-hover:text-zinc-900 transition-colors uppercase">PSYPHER_LAB</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-purple-500 animate-pulse" />
              <span>LIVE_NEURAL_SYNC: ACTIVE</span>
            </div>
            <div className="w-px h-3 bg-zinc-200" />
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-purple-500" />
              <span>NODES_MAPPED: {Object.keys(answers).length} / {allQuestions.length}</span>
            </div>
          </div>

          <button className="px-6 py-2 border border-zinc-200 rounded-full text-[10px] font-mono tracking-widest uppercase hover:bg-zinc-50 transition-colors">
            Exit_Session
          </button>
        </div>
      </header>

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        {/* Left Column: Phase Tracker (Large screens only) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-12 sticky top-48 h-fit">
          <div className="space-y-6">
            <h3 className="text-[10px] font-mono tracking-[0.5em] text-zinc-400 uppercase">Current_Protocol</h3>
            <div className="space-y-3">
              {isBatchMode ? (
                Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={cn(
                      "w-1 h-1 rounded-full transition-all duration-500",
                      currentBatch === i ? "bg-purple-500 scale-[2] shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-zinc-200 group-hover:bg-zinc-300"
                    )} />
                    <span className={cn(
                      "text-[9px] font-mono tracking-widest transition-colors",
                      currentBatch === i ? "text-zinc-900 font-bold" : "text-zinc-300 group-hover:text-zinc-400"
                    )}>
                      {getPhaseName(i).split(": ")[0]}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[9px] font-mono tracking-widest text-zinc-900 font-bold">
                  PRECISION_BOUTIQUE_PROTOCOL
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-zinc-50/50 border border-zinc-100 rounded-2xl space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              <span>Batch_Integrity</span>
              <span className="processing-flicker">{Math.round((answeredInBatch / BATCH_SIZE) * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-900 transition-all duration-500" 
                style={{ width: `${(answeredInBatch / BATCH_SIZE) * 100}%` }}
              />
            </div>
            <p className="text-[9px] font-mono text-zinc-300 uppercase leading-relaxed">
              Synthesizing response patterns into high-fidelity psychological vectors...
            </p>
          </div>
        </aside>

        {/* Center Column: Questions */}
        <div ref={contentRef} className="lg:col-span-9 max-w-4xl">
          {!isBatchMode ? (
            // --- Boutique Mode UI (Single Question) ---
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-20">
              <div className="space-y-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-[1px] bg-zinc-100" />
                  <span className="text-[11px] font-mono tracking-[0.6em] text-purple-500 uppercase">
                    Node {currentStep + 1} // Precision_Scan
                  </span>
                  <div className="w-12 h-[1px] bg-zinc-100" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] max-w-3xl mx-auto">
                  {allQuestions[currentStep].text}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full max-w-5xl">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSingleAnswer(opt.value)}
                    className="group relative py-12 px-6 border border-zinc-100 rounded-[2.5rem] bg-white transition-all hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
                  >
                    <div className="absolute top-4 right-6 text-[10px] font-mono text-zinc-200 group-hover:text-purple-300">
                      0{opt.value}
                    </div>
                    <span className="relative text-[10px] font-mono font-bold tracking-widest uppercase transition-colors group-hover:text-white px-2 text-center text-zinc-500">
                      {opt.value === 1 && "[-] "}
                      {opt.label}
                      {opt.value === 5 && " [+]"}
                    </span>
                    <div className="mt-4 flex justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-100 group-hover:bg-purple-500 group-hover:scale-150 transition-all shadow-[0_0_10px_transparent] group-hover:shadow-purple-500/50" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // --- Batch Mode UI (10 per screen) ---
            <div className="space-y-20">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-[0.4em] text-purple-500 uppercase">
                  {getPhaseName(currentBatch)}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">Psychological Mapping</h1>
                <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">Respond honestly based on your repeated patterns of behavior in core professional and social environments.</p>
              </div>

              <div className="space-y-16">
                {batchQuestions.map((q, idx) => (
                  <div key={q.id} className="group/q space-y-12 pb-16 border-b border-zinc-100 last:border-0">
                    <div className="flex gap-8 items-start">
                      <span className="text-[10px] font-mono text-zinc-300 mt-2 block group-hover/q:text-purple-500 transition-colors">
                        {String((currentBatch * BATCH_SIZE) + idx + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 group-hover/q:translate-x-1 transition-transform tracking-tight leading-snug max-w-3xl">
                        {q.text}
                      </h2>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0 justify-between px-4">
                      <span className="text-[10px] font-mono tracking-[0.5em] text-zinc-500 order-2 md:order-1 uppercase flex items-center gap-2 md:mr-12">
                        <span className="opacity-40">[-]</span> Strongly_Disagree
                      </span>
                      
                      <div className="flex items-center gap-8 md:gap-14 order-1 md:order-2">
                        {options.map((opt) => (
                          <div key={opt.value} className="flex flex-col items-center gap-4">
                            <BiometricTouchpoint 
                              value={opt.value}
                              active={answers[q.id] === opt.value}
                              onClick={() => handleBatchAnswer(q.id, opt.value)}
                              size={opt.size}
                            />
                          </div>
                        ))}
                      </div>

                      <span className="text-[10px] font-mono tracking-[0.5em] text-zinc-500 order-3 uppercase flex items-center gap-2 md:ml-12">
                        Strongly_Agree <span className="opacity-40">[+]</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-16 border-t border-zinc-100 relative">
                <button 
                  onClick={prevBatch}
                  disabled={currentBatch === 0}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-6 rounded-full border border-zinc-200 text-zinc-900 font-bold text-sm tracking-widest hover:bg-zinc-50 transition-all disabled:opacity-30 disabled:pointer-events-none group uppercase"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                  Protocol_Back
                </button>

                <div className="batch-error opacity-0 text-purple-600 text-[10px] font-mono tracking-[0.3em] font-bold uppercase text-center absolute left-1/2 -top-4 -translate-x-1/2 flex items-center gap-2">
                   <Shield className="w-3 h-3" /> DATA_INTEGRITY_FAILED // COMPLETE_ALL_NODES
                </div>

                <div className="flex flex-col items-center gap-2 order-3 md:order-2">
                  <span className="text-[9px] font-mono text-zinc-300 tracking-[0.3em] uppercase">Security_Check: Verified</span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div key={i} className={cn(
                        "w-6 h-[2px] rounded-full transition-all duration-500",
                        currentBatch === i ? "bg-purple-500" : i < currentBatch ? "bg-zinc-900" : "bg-zinc-100"
                      )} />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={nextBatch}
                  className="w-full md:w-auto flex items-center justify-center gap-4 px-16 py-6 rounded-full bg-zinc-900 text-white font-bold text-sm tracking-widest hover:bg-purple-600 transition-all group uppercase shadow-2xl shadow-zinc-900/10 hover:shadow-purple-500/30 active:scale-95"
                >
                  {currentBatch === totalSteps - 1 ? "Start_Neural_Synthesis" : "Advance_Protocol"}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Neural Synthesis Overlay */}
      {isFinishing && (
        <div className="fixed inset-0 bg-[#FDFDFD] z-[200] flex items-center justify-center overflow-hidden">
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(124, 58, 237, 0.02) 50%)", backgroundSize: "100% 4px" }} />
          
          <div className="text-center space-y-16 relative z-0">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full" />
              <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-2 border border-zinc-200 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">Ψ</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase italic">Neural_Synthesis_In_Progress</h2>
                <div className="h-[1px] w-64 bg-zinc-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-500 animate-[loading_2s_ease-in-out_infinite]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4 max-w-4xl mx-auto px-8">
                {[
                  "BIOMETRIC_CHECK", "OCEAN_MAPPING", "DARK_VECTORS", "ATTACHMENT_SYNC",
                  "VALUE_CALIBRATION", "SEMANTIC_PARSING", "PSYCH_SKEW_CORR", "GEN_DOSSIER"
                ].map((task, i) => (
                  <div key={task} className="flex items-center gap-3 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse" />
                    <span>{task}</span>
                    <span className="text-purple-500 font-bold ml-auto opacity-0 animate-[fadeIn_0.5s_forwards]" style={{ animationDelay: `${i * 0.2}s` }}>OK</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-zinc-300 tracking-[0.4em] uppercase">
               SYSTEM_STABLE // DATA_NODES_SECURE // {allQuestions.length}_VECTORS_PARSED
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for custom animations */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </main>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}
