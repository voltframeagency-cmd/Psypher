"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { ArrowRight, FileText, Sparkles, AlertTriangle } from "lucide-react";

interface TextSampleInputProps {
  onSubmit: (text: string) => void;
  onSkip: () => void;
}

const SAMPLE_PROMPTS = [
  "Paste an email you've written recently",
  "Copy a text conversation thread",
  "Share a journal entry or reflection",
  "Paste a social media post you drafted",
  "Copy a work message or Slack thread",
];

const MIN_WORDS = 100;
const OPTIMAL_WORDS = 300;

export default function TextSampleInput({ onSubmit, onSkip }: TextSampleInputProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptIndex, setPromptIndex] = useState(0);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount >= MIN_WORDS;
  const qualityPercent = Math.min((wordCount / OPTIMAL_WORDS) * 100, 100);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Rotate prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex(prev => (prev + 1) % SAMPLE_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-black text-sm">2</span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent">
            Deep Scan — Behavioral Sample
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95]">
          Now show us how you <em className="not-italic text-accent">actually</em> communicate.
        </h2>

        <p className="text-base text-foreground/50 max-w-2xl leading-relaxed">
          Your questionnaire showed us your <strong className="text-foreground/80">self-image</strong>. 
          This step analyzes your <strong className="text-foreground/80">actual behavior</strong> — 
          the words you choose reveal patterns your conscious mind can't fake.
        </p>
      </div>

      {/* The Input Area */}
      <div className={cn(
        "relative border rounded-sm transition-all duration-500",
        focused 
          ? "border-accent/40 shadow-[0_0_60px_rgba(109,40,217,0.08)]" 
          : "border-foreground/10 hover:border-foreground/20"
      )}>
        {/* Floating Label */}
        <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none">
          <span className={cn(
            "text-[10px] font-bold tracking-[0.3em] uppercase transition-colors",
            focused ? "text-accent" : "text-foreground/30"
          )}>
            Behavioral Sample
          </span>
          <span className={cn(
            "text-[10px] font-mono tracking-wider transition-colors",
            wordCount < MIN_WORDS ? "text-foreground/30" : "text-accent"
          )}>
            {wordCount} / {OPTIMAL_WORDS}+ words
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={SAMPLE_PROMPTS[promptIndex] + "..."}
          className="w-full min-h-[320px] bg-transparent px-5 pt-12 pb-6 text-base leading-relaxed resize-none focus:outline-none placeholder:text-foreground/15 font-normal"
          spellCheck={false}
        />

        {/* Quality Progress Bar */}
        <div className="h-[2px] bg-foreground/5">
          <div 
            className={cn(
              "h-full transition-all duration-700 ease-out",
              qualityPercent >= 100 ? "bg-emerald-500" : qualityPercent >= 50 ? "bg-accent" : "bg-foreground/20"
            )}
            style={{ width: `${qualityPercent}%` }}
          />
        </div>
      </div>

      {/* Feedback Strip */}
      <div className="mt-4 flex items-center gap-3">
        {wordCount === 0 ? (
          <p className="text-xs text-foreground/30 flex items-center gap-2">
            <FileText size={12} />
            Paste any text you&apos;ve written — emails, messages, journal entries, social posts
          </p>
        ) : wordCount < MIN_WORDS ? (
          <p className="text-xs text-amber-500/80 flex items-center gap-2">
            <AlertTriangle size={12} />
            Need at least {MIN_WORDS - wordCount} more words for accurate analysis
          </p>
        ) : wordCount < OPTIMAL_WORDS ? (
          <p className="text-xs text-accent/70 flex items-center gap-2">
            <Sparkles size={12} />
            Good sample. {OPTIMAL_WORDS - wordCount} more words will increase precision
          </p>
        ) : (
          <p className="text-xs text-emerald-500/80 flex items-center gap-2">
            <Sparkles size={12} />
            Excellent sample quality — ready for deep linguistic analysis
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-16 flex items-center justify-between border-t border-foreground/10 pt-12">
        <button
          onClick={onSkip}
          className="text-sm font-medium text-foreground/40 hover:text-foreground/60 transition-colors underline underline-offset-4 decoration-foreground/10"
        >
          Skip — use questionnaire only (Free Report)
        </button>

        <button
          onClick={() => onSubmit(text)}
          disabled={!isValid}
          className={cn(
            "px-8 py-3 bg-foreground text-background text-sm font-bold flex items-center space-x-3 rounded-sm transition-all shadow-sm",
            !isValid 
              ? "opacity-20 cursor-not-allowed" 
              : "hover:bg-accent hover:shadow-xl active:scale-95"
          )}
        >
          <span>Run Deep Analysis</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Trust Strip */}
      <div className="mt-8 text-center">
        <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/20 font-bold">
          Your text is analyzed locally · Never stored · Zero data retention
        </p>
      </div>
    </div>
  );
}
