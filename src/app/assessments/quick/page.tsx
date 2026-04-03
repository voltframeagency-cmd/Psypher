"use client";

import { useState } from "react";
import AssessmentFrame from "@/components/assessment/AssessmentFrame";
import { QUICK_SCAN_QUESTIONS } from "@/config/questions";
import { PsychologyEngine } from "@/lib/psychology/scoring";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function QuickScanPage() {
  const [status, setStatus] = useState<"testing" | "calculating" | "preview">("testing");
  const [results, setResults] = useState<any>(null);

  const handleComplete = (responses: Record<number, number>) => {
    setStatus("calculating");
    
    // Simulate engine processing
    setTimeout(() => {
      const bfi = PsychologyEngine.calculateBFI2S(responses);
      const dtdd = PsychologyEngine.calculateDTDD(responses);
      const wiring = PsychologyEngine.getCognitiveWiring(bfi);
      
      setResults({ bfi, dtdd, wiring });
      setStatus("preview");
    }, 2500);
  };

  if (status === "calculating") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-foreground-light">
        <Loader2 className="animate-spin text-accent mb-8" size={48} />
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Synthesizing Blueprint</h2>
        <p className="text-foreground-light/50 font-mono text-sm animate-pulse">
          Analyzing 7 psychological dimensions...
        </p>
      </div>
    );
  }

  if (status === "preview") {
    return (
      <div className="min-h-screen bg-background-dark text-foreground-light py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-20 text-center">
            <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase block mb-4">Assessment Complete</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Your Shadow Profile is Ready.</h1>
            <p className="text-xl text-foreground-light/60 max-w-2xl mx-auto leading-relaxed">
              We have successfully mapped your cognitive wiring and trait architecture. 
              The results reveal a <span className="text-foreground-light font-bold">dominant "{results.wiring}" configuration</span> with specific markers of interest.
            </p>
          </header>

          {/* Blurred Result Preview as per PRD */}
          <div className="relative group overflow-hidden border border-white/10 rounded-sm bg-white/5 p-8 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 blur-md select-none pointer-events-none">
              <div>
                <h3 className="text-2xl font-bold mb-6">01. Personality Architecture</h3>
                <div className="space-y-4">
                  {Object.entries(results.bfi).map(([trait, score]: [string, any]) => (
                    <div key={trait} className="h-2 bg-white/10 rounded-full w-full">
                      <div className="h-full bg-accent" style={{ width: `${(score/5)*100}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6">02. Shadow Profile</h3>
                <div className="space-y-4">
                  <div className="h-10 bg-white/10 w-full" />
                  <div className="h-10 bg-white/10 w-3/4" />
                </div>
              </div>
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-dark/40 backdrop-blur-sm p-6 text-center">
              <div className="max-w-md bg-background-dark border border-accent/30 p-8 rounded-sm shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Unlock Your Deep Report</h3>
                <p className="text-sm text-foreground-light/70 mb-8 leading-relaxed">
                  Get the uncomfortable truth about how you operate. Includes Your Shadow Profile, 
                  Connection Blueprint, and a 3-step Reslience Action Plan.
                </p>
                <button className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 mb-4">
                  Buy Full Report — $18.99
                </button>
                <p className="text-[10px] uppercase font-bold text-foreground-light/30">Secure Checkout via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-background-warm min-h-screen">
      <AssessmentFrame 
        questions={QUICK_SCAN_QUESTIONS}
        onComplete={handleComplete}
      />
    </main>
  );
}
