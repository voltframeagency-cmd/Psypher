"use client";

import { useState } from "react";
import AssessmentFrame from "@/components/assessment/AssessmentFrame";
import TextSampleInput from "@/components/assessment/TextSampleInput";
import { QUICK_SCAN_QUESTIONS } from "@/config/questions";
import { PsychologyEngine, HybridReport } from "@/lib/psychology/scoring";
import { cn } from "@/lib/utils";
import { Loader2, Brain, Fingerprint, Shield } from "lucide-react";

type AssessmentStatus = "questionnaire" | "text-sample" | "calculating" | "preview";

export default function QuickScanPage() {
  const [status, setStatus] = useState<AssessmentStatus>("questionnaire");
  const [questionnaireData, setQuestionnaireData] = useState<Record<number, number>>({});
  const [report, setReport] = useState<HybridReport | null>(null);

  // Step 1: Questionnaire completed
  const handleQuestionnaireComplete = (responses: Record<number, number>) => {
    setQuestionnaireData(responses);
    setStatus("text-sample"); // Advance to Step 2
  };

  // Step 2a: Text sample submitted → run hybrid analysis
  const handleTextSubmit = (selectedIds: string[]) => {
    setStatus("calculating");
    
    setTimeout(() => {
      const hybridReport = PsychologyEngine.generateHybridReport(questionnaireData, selectedIds);
      setReport(hybridReport);
      setStatus("preview");
    }, 3500); // Slightly longer for "Deep Analysis" feel
  };

  // Step 2b: Skip text → run questionnaire-only (free) report
  const handleTextSkip = () => {
    setStatus("calculating");
    
    setTimeout(() => {
      const hybridReport = PsychologyEngine.generateHybridReport(questionnaireData);
      setReport(hybridReport);
      setStatus("preview");
    }, 2500);
  };

  // --- CALCULATING STATE ---
  if (status === "calculating") {
    const isDeepScan = report === null; // Will be deep if text was provided
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-foreground-light">
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 -m-16">
            <div className="w-48 h-48 rounded-full border border-accent/10 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 -m-8">
            <div className="w-32 h-32 rounded-full border border-accent/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          
          <Loader2 className="animate-spin text-accent mb-8 relative z-10" size={48} />
        </div>
        
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 mt-8">
          {isDeepScan ? "Synthesizing Blueprint" : "Cross-Referencing Vectors"}
        </h2>
        
        {/* Analysis steps */}
        <div className="space-y-3 mt-8">
          <AnalysisStep icon={Brain} label="Scoring questionnaire dimensions" delay={0} />
          <AnalysisStep icon={Fingerprint} label="Analyzing linguistic fingerprint" delay={800} />
          <AnalysisStep icon={Shield} label="Computing congruency index" delay={1600} />
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

    return (
      <div className="min-h-screen bg-background-dark text-foreground-light py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-20 text-center">
            <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase block mb-4">
              Assessment Complete
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
              Your Intelligence Dossier is Ready.
            </h1>
            <p className="text-xl text-foreground-light/60 max-w-2xl mx-auto leading-relaxed">
              We have mapped your cognitive wiring as a{" "}
              <span className="text-foreground-light font-bold">
                dominant &ldquo;{wiring}&rdquo; configuration
              </span>
              {congruencyLabel && (
                <> with <span className={cn(
                  "font-bold",
                  report.overallCongruencyScore! >= 80 ? "text-emerald-400" : 
                  report.overallCongruencyScore! >= 50 ? "text-amber-400" : "text-red-400"
                )}>
                  {congruencyLabel}
                </span> between your self-image and behavioral patterns</>
              )}.
            </p>
          </header>

          {/* Blurred Result Preview */}
          <div className="relative group overflow-hidden border border-white/10 rounded-sm bg-white/5 p-8 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 blur-md select-none pointer-events-none">
              {/* Vector A Preview */}
              <div>
                <h3 className="text-2xl font-bold mb-2">Vector A: Self-Report</h3>
                <p className="text-xs text-foreground-light/30 mb-6 uppercase tracking-widest">Questionnaire Analysis</p>
                <div className="space-y-4">
                  {Object.entries(report.selfReport.bfi).map(([trait, score]: [string, any]) => (
                    <div key={trait} className="h-2 bg-white/10 rounded-full w-full">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${(score/5)*100}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector B Preview (or locked) */}
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {report.hasTextSample ? "Vector B: Linguistic" : "Vector B: Locked"}
                </h3>
                <p className="text-xs text-foreground-light/30 mb-6 uppercase tracking-widest">
                  {report.hasTextSample ? "Behavioral Patterns" : "Text Sample Required"}
                </p>
                <div className="space-y-4">
                  <div className="h-10 bg-white/10 w-full" />
                  <div className="h-10 bg-white/10 w-3/4" />
                  <div className="h-10 bg-white/10 w-5/6" />
                </div>
              </div>
            </div>

            {/* Congruency Tease */}
            {report.hasTextSample && (
              <div className="blur-md select-none pointer-events-none mt-12 pt-8 border-t border-white/10">
                <h3 className="text-2xl font-bold mb-4">Congruency Index</h3>
                <div className="text-6xl font-black text-accent">{report.overallCongruencyScore}%</div>
                <p className="text-sm text-foreground-light/40 mt-2">Self-image alignment score</p>
              </div>
            )}

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-dark/40 backdrop-blur-sm p-6 text-center">
              <div className="max-w-md bg-background-dark border border-accent/30 p-8 rounded-sm shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Unlock Your Full Dossier</h3>
                <p className="text-sm text-foreground-light/70 mb-8 leading-relaxed">
                  {report.hasTextSample ? (
                    <>We found <span className="text-accent font-bold">
                      {report.congruency?.filter(c => c.direction !== "aligned").length || 0} shadow patterns
                    </span> where your self-image diverges from your behavior. 
                    Dark Triad markers, Attachment maps, and full Congruency breakdown inside.</>
                  ) : (
                    <>Dark Triad markers, Attachment style, Cognitive mechanics, 
                    and 4 more clinical-grade frameworks — all from your assessment.</>
                  )}
                </p>
                <button className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 mb-4">
                  Decode This Person — $29
                </button>
                <p className="text-[10px] uppercase font-bold text-foreground-light/30">
                  One-time payment · 30-day money-back guarantee · Secure via Stripe
                </p>
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
      <main className="bg-background-warm min-h-screen">
        <TextSampleInput
          onSubmit={handleTextSubmit}
          onSkip={handleTextSkip}
        />
      </main>
    );
  }

  // --- QUESTIONNAIRE STEP (Step 1) ---
  return (
    <main className="bg-background-warm min-h-screen">
      <AssessmentFrame 
        questions={QUICK_SCAN_QUESTIONS}
        onComplete={handleQuestionnaireComplete}
      />
    </main>
  );
}

// --- Helper: Animated analysis step ---
function AnalysisStep({ icon: Icon, label, delay }: { icon: any; label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  
  useState(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  });

  return (
    <div className={cn(
      "flex items-center gap-3 text-sm transition-all duration-500",
      visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
    )}>
      <Icon size={14} className="text-accent" />
      <span className="text-foreground-light/50 font-mono text-xs tracking-wider animate-pulse">
        {label}...
      </span>
    </div>
  );
}
