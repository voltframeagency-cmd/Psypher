"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";

export default function ReportPage() {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bypass, setBypass] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      // Direct check to avoid async state race conditions
      const params = new URLSearchParams(window.location.search);
      const isBypassed = params.get("bypass") === "true";
      if (isBypassed) setBypass(true);

      try {
        const storedAnswers = sessionStorage.getItem("psypher_answers");
        
        // If bypassed, we allow mock data even without answers
        if (!storedAnswers && isBypassed) {
          setLoading(false);
          setReport(`## Subject Analysis: MOCK_PROTOCOL_0.1

### THE UNCOMFORTABLE TRUTH
You possess a rare alignment of high conscientious grit and strategic skepticism. Your superpower is the ability to see through "good enough" while maintaining a relentless drive for perfection. Your fatal flaw is a refusal to delegate, which acts as a ceiling on your ultimate scale.

### HOW YOU OPERATE
In professional conflict, you default to analytical dominance. You don't just want to win; you want the other party to admit they were logically incorrect. This ensures you are usually right but often isolated.

### YOUR SHADOW
Your dark triad metrics suggest a "Calculated Visionary" profile. You are not malicious—you are simply outcome-oriented to the exclusion of emotional friction. Use this to navigate high-stakes negotiations where others waver.

### THE ACTION PLAN
1. Delegate 3 tasks this week that make you feel genuinely anxious to let go of.
2. Ask one colleague for "unfiltered, brutal feedback" on your communication style.
3. Spend 30 minutes in deliberate "unproductive" reflection.`);
          
          // Trigger GSAP fade-in
          setTimeout(() => {
            gsap.to(containerRef.current, { opacity: 1, duration: 1, ease: "power4.out" });
          }, 100);
          return;
        }

        if (!storedAnswers) {
          router.push("/assessment");
          return;
        }

        const response = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: JSON.parse(storedAnswers) }),
        });

        if (!response.ok) throw new Error("Failed to generate report");
        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        gsap.to(containerRef.current, { opacity: 1, duration: 1, ease: "power4.out" });
      }
    };

    fetchReport();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center font-mono">
        <div className="space-y-4 text-center">
          <div className="w-16 h-[1px] bg-[#7C3AED] animate-pulse mx-auto" />
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-50">Decoding Neural Architecture...</p>
        </div>
      </main>
    );
  }

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-[#0B0B0B] text-white font-outfit p-8 md:p-24 opacity-0"
    >
      {/* Background Grid Accent */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Header */}
      <nav className="flex justify-between items-center mb-24 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-[#7C3AED]">Ψ</span>
          <span className="text-sm font-bold tracking-[0.2em] font-mono">PSYPHER</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono tracking-widest text-[#7C3AED] border border-[#7C3AED]/30 px-3 py-1 rounded-full uppercase">
            Strictly Confidential
          </span>
        </div>
      </nav>

      {/* Report Content */}
      <div ref={contentRef} className="max-w-4xl mx-auto space-y-24 relative z-10">
        {/* Hero Title */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#7C3AED] uppercase">Deep Decode Protocol // 001</span>
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.9]">
              Your Psychological <br/>
              <span className="opacity-40">Blueprint.</span>
            </h1>
          </div>
        </section>

        {/* Scoring Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm space-y-4">
            <span className="text-[10px] font-mono opacity-40 uppercase">Openness</span>
            <div className="text-4xl font-medium">84%</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#7C3AED]" style={{ width: "84%" }} />
            </div>
          </div>
          <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm space-y-4">
            <span className="text-[10px] font-mono opacity-40 uppercase">Conscientiousness</span>
            <div className="text-4xl font-medium">92%</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#7C3AED]" style={{ width: "92%" }} />
            </div>
          </div>
          <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm space-y-4">
            <span className="text-[10px] font-mono opacity-40 uppercase">Agreeableness</span>
            <div className="text-4xl font-medium">31%</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#7C3AED]" style={{ width: "31%" }} />
            </div>
          </div>
        </section>

        {/* Deep Analysis (Blurred for Paywall Preview unless bypassed) */}
        <section className="relative group">
          <div className={`prose prose-invert prose-2xl max-w-none space-y-12 transition-all duration-700 markdown-content ${
            bypass ? "blur-0 opacity-100" : "blur-md select-none opacity-40"
          }`}>
            <ReactMarkdown>
              {report || `### The Hidden Tax on Your Potential...`}
            </ReactMarkdown>
          </div>

          {/* Paywall Overlay - Hidden if bypassed */}
          {!bypass && (
            <div className="absolute inset-0 flex items-center justify-center pt-24 z-20">
              <div className="bg-[#0B0B0B]/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] max-w-lg text-center space-y-8 shadow-2xl">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-[0.4em] text-[#7C3AED] uppercase">Analysis Restricted</span>
                  <h2 className="text-3xl font-medium tracking-tight">The full decode is ready.</h2>
                  <p className="text-white/60 text-lg leading-relaxed">
                    Your mini-report indicates high-impact behavioral patterns. Unlock the full 24-page analysis, dark triad screening, and attachment metrics.
                  </p>
                </div>
                
                <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-4 transition-all duration-300 group">
                  Unlock the Deep Report — $18.99
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <p className="text-[10px] font-mono opacity-20 uppercase tracking-widest">
                  One-time access. No subscription.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Footer Info */}
        <section className="pt-24 border-t border-white/10 text-center">
          <p className="text-[10px] font-mono opacity-20 tracking-widest uppercase">
            PSYPHER INTELLIGENCE ENGINE v1.0 // SUBJECT_CONFIDENTIAL // Ψ
          </p>
        </section>
      </div>
    </main>
  );
}
