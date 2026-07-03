"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AssessmentFrame from "@/components/assessment/AssessmentFrame";
import TextSampleInput from "@/components/assessment/TextSampleInput";
import { QUICK_SCAN_QUESTIONS } from "@/config/questions";
import { PsychologyEngine, HybridReport } from "@/lib/psychology/scoring";
import { cn } from "@/lib/utils";
import { Loader2, Brain, Fingerprint, Shield, Check, Lock, Activity, Search, Database } from "lucide-react";
import { useEffect } from "react";

type AssessmentStatus = "questionnaire" | "text-sample" | "calculating" | "preview";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "basic";
  
  const [status, setStatus] = useState<AssessmentStatus>("questionnaire");
  const [questionnaireData, setQuestionnaireData] = useState<Record<number, number>>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [report, setReport] = useState<HybridReport | null>(null);

  // Helper: Persist assessment to get ID
  const persistAssessment = async (answers: Record<number, number>) => {
    try {
      const res = await fetch("/api/assessment/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, tier }),
      });
      const data = await res.json();
      if (data.id) setAssessmentId(data.id);
    } catch (err) {
      console.error("Persistence failed:", err);
    }
  };

  // Step 1: Questionnaire completed
  const handleQuestionnaireComplete = (responses: Record<number, number>) => {
    setQuestionnaireData(responses);
    persistAssessment(responses); // Pre-save
    setStatus("text-sample"); // Advance to Step 2
  };

  // Step 2a: Text sample submitted → run hybrid analysis
  const handleTextSubmit = (selectedIds: Record<string, number>) => {
    setStatus("calculating");
    const locale = searchParams.get("lang") || searchParams.get("locale") || "en";
    
    setTimeout(() => {
      const hybridReport = PsychologyEngine.generateHybridReport(questionnaireData, selectedIds, locale);
      setReport(hybridReport);
      setStatus("preview");
    }, 3500); // Slightly longer for "Deep Analysis" feel
  };

  // Step 2b: Skip text → run questionnaire-only (free) report
  const handleTextSkip = () => {
    setStatus("calculating");
    const locale = searchParams.get("lang") || searchParams.get("locale") || "en";
    
    setTimeout(() => {
      const hybridReport = PsychologyEngine.generateHybridReport(questionnaireData, undefined, locale);
      setReport(hybridReport);
      setStatus("preview");
    }, 2500);
  };

  // --- CALCULATING STATE ---
  if (status === "calculating") {
    const isDeepScan = report?.hasTextSample ?? true; // Deep scan if text is provided or starting
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] text-zinc-900 px-6">
        <div className="relative mb-12">
          {/* Pulsing rings */}
          <div className="absolute inset-0 -m-20 overflow-visible pointer-events-none">
            <div className="w-56 h-56 rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: '4s' }} />
          </div>
          <div className="absolute inset-0 -m-10 overflow-visible pointer-events-none">
            <div className="w-36 h-36 rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          
          <div className="relative z-10 w-20 h-20 bg-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] rounded-full flex items-center justify-center border border-zinc-100">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">
            {isDeepScan ? "Synthesizing Blueprint" : "Mapping Vectors"}
          </h2>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Protocol 01-ALPHA · Engine: Psychology v2.4
          </p>
        </div>
        
        {/* Analysis steps */}
        <div className="max-w-sm w-full space-y-4">
          <AnalysisStep icon={Brain} label="Quantifying Core Dimensions" delay={0} />
          <AnalysisStep icon={Fingerprint} label="Extracting Linguistic Markers" delay={800} />
          <AnalysisStep icon={Activity} label="Calculating Congruency Index" delay={1600} />
          <AnalysisStep icon={Search} label="Scanning Dark Triad Shadow" delay={2400} />
        </div>
      </div>
    );
  }

  // --- PREVIEW STATE (Paywall) ---
  if (status === "preview" && report) {
    const wiring = report.selfReport.cognitiveWiring;
    const congruencyLabel = report.hasTextSample && report.overallCongruencyScore !== null
      ? report.overallCongruencyScore >= 80 
        ? "High Alignment" 
        : report.overallCongruencyScore >= 50 
          ? "Moderate Divergence" 
          : "Significant Shadow Patterns"
      : null;

    const price = tier === "deep" ? "$29" : tier === "compatibility" ? "$49" : "$19";
    const tierTitle = tier === "deep" ? "Deep Intelligence Dossier" : tier === "compatibility" ? "Compatibility Protocol" : "Basic Blueprint";

    return (
      <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 py-20 px-6 font-outfit">
        <div className="max-w-4xl mx-auto">
          <header className="mb-20 text-center">
            <span className="text-purple-600 text-[10px] font-bold tracking-[0.4em] uppercase block mb-4">
              {tierTitle} Status: Complete
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
              Your Intelligence Dossier is Ready.
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              We have mapped your cognitive wiring as a{" "}
              <span className="text-zinc-900 font-bold">
                dominant &ldquo;{wiring}&rdquo; configuration
              </span>
              {congruencyLabel && (
                <> with <span className={cn(
                  "font-bold",
                  report.overallCongruencyScore! >= 80 ? "text-emerald-500" : 
                  report.overallCongruencyScore! >= 50 ? "text-amber-500" : "text-red-500"
                )}>
                  {congruencyLabel}
                </span> between your self-image and behavioral patterns</>
              )}.
            </p>
          </header>

          {/* Blurred Result Preview */}
          <div className="relative group overflow-hidden border border-zinc-100 rounded-2xl bg-zinc-50/30 p-8 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 blur-md select-none pointer-events-none opacity-40">
              {/* Vector A Preview */}
              <div>
                <h3 className="text-2xl font-bold mb-2">Vector A: Self-Report</h3>
                <p className="text-xs text-zinc-400 mb-6 uppercase tracking-widest">Questionnaire Analysis</p>
                <div className="space-y-4">
                  {Object.entries(report.selfReport.bfi).map(([trait, score]: [string, any]) => (
                    <div key={trait} className="h-2 bg-zinc-100 rounded-full w-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(score/5)*100}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector B Preview (or locked) */}
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {report.hasTextSample ? "Vector B: Linguistic" : "Vector B: Locked"}
                </h3>
                <p className="text-xs text-zinc-400 mb-6 uppercase tracking-widest">
                  {report.hasTextSample ? "Behavioral Patterns" : "Text Sample Required"}
                </p>
                <div className="space-y-4">
                  <div className="h-10 bg-zinc-200/50 w-full rounded-lg" />
                  <div className="h-10 bg-zinc-200/50 w-3/4 rounded-lg" />
                  <div className="h-10 bg-zinc-200/50 w-5/6 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Congruency Tease */}
            {report.hasTextSample && (
              <div className="blur-md select-none pointer-events-none mt-12 pt-8 border-t border-zinc-100 opacity-40">
                <h3 className="text-2xl font-bold mb-4">Congruency Index</h3>
                <div className="text-6xl font-black text-purple-600">{report.overallCongruencyScore}%</div>
                <p className="text-sm text-zinc-400 mt-2 uppercase tracking-widest font-mono">Self-image alignment score</p>
              </div>
            )}

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm p-6 text-center">
              <div className="max-w-md bg-white border border-zinc-100 p-10 rounded-2xl shadow-2xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield size={32} className="text-purple-600" />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4">Unlock Your Full Dossier</h3>
                <p className="text-zinc-500 mb-10 leading-relaxed text-sm font-medium">
                  {report.hasTextSample ? (
                    <>We identified <span className="text-purple-600 font-bold">
                      {report.congruency?.filter(c => c.direction !== "aligned").length || 0} critical shadow patterns
                    </span> where your conscious self-image diverges from your behavioral reality.</>
                  ) : (
                    <>Dark Triad markers, Attachment geography, Cognitive mechanics, 
                    and 4 more clinical-grade frameworks ready for extraction.</>
                  )}
                </p>
                <button 
                  onClick={async () => {
                    if (!assessmentId) return;
                    setIsProcessingCheckout(true);
                    try {
                      const res = await fetch("/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ assessmentId, tier, price }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch (err) {
                      console.error("Checkout failed:", err);
                    } finally {
                      setIsProcessingCheckout(false);
                    }
                  }}
                  disabled={isProcessingCheckout || !assessmentId}
                  className="w-full py-5 bg-zinc-900 border-b-4 border-zinc-700 hover:bg-[#6D28D9] hover:border-[#4C1D95] text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:translate-y-1 active:border-b-0 mb-6 rounded-full flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessingCheckout ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>ACCESS REPORT — {price}</>
                  )}
                </button>
                {(process.env.NODE_ENV === "development") && (
                  <button
                    onClick={() => {
                      window.location.href = `/report?id=${assessmentId}&dev=true`;
                    }}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-widest font-black mb-6 rounded-full"
                  >
                    [DEV] Bypass Paywall & View Report
                  </button>
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] uppercase font-bold text-zinc-300 tracking-widest">
                    SECURE ENCRYPTION · ONE-TIME PAYMENT
                  </p>
                  <p className="text-[9px] uppercase font-bold text-zinc-300 tracking-widest">
                    30-DAY SATISFACTION GUARANTEE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TEXT SAMPLE STEP (Step 2) ---
  if (status === "text-sample") {
    return (
      <main className="bg-[#FDFDFD] min-h-screen">
        <TextSampleInput
          onSubmit={handleTextSubmit}
          onSkip={handleTextSkip}
        />
      </main>
    );
  }

  // --- QUESTIONNAIRE STEP (Step 1) ---
  return (
    <main className="bg-[#FDFDFD] min-h-screen">
      <AssessmentFrame 
        questions={QUICK_SCAN_QUESTIONS}
        onComplete={handleQuestionnaireComplete}
      />
    </main>
  );
}

// --- Helper: Animated analysis step ---
function AnalysisStep({ icon: Icon, label, delay }: { icon: any; label: string; delay: number }) {
  const [stepStatus, setStepStatus] = useState<"pending" | "processing" | "complete">("pending");
  
  useEffect(() => {
    const startTimer = setTimeout(() => setStepStatus("processing"), delay);
    const completeTimer = setTimeout(() => setStepStatus("complete"), delay + 1200);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [delay]);

  return (
    <div className={cn(
      "flex items-center gap-4 transition-all duration-700",
      stepStatus !== "pending" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500",
        stepStatus === "complete" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : 
        stepStatus === "processing" ? "bg-purple-50 border-purple-200 text-purple-600 shadow-[0_0_15px_-4px_rgba(168,85,247,0.3)]" : "bg-zinc-50 border-zinc-100 text-zinc-300"
      )}>
        {stepStatus === "complete" ? <Check size={14} strokeWidth={3} /> : <Icon size={14} className={stepStatus === "processing" ? "animate-pulse" : ""} />}
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "font-mono text-[10px] tracking-widest uppercase transition-colors duration-500",
          stepStatus === "complete" ? "text-zinc-400" : 
          stepStatus === "processing" ? "text-zinc-900 font-bold" : "text-zinc-200"
        )}>
          {label}
        </span>
        {stepStatus === "processing" && (
          <div className="h-[2px] w-full bg-zinc-100 mt-1 overflow-hidden rounded-full">
            <div className="h-full bg-purple-500 animate-[loading-bar_1.2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  );
}
