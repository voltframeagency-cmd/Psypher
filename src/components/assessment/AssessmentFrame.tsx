"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Question } from "@/config/questions";
import QuestionItem from "./QuestionItem";
import { cn } from "@/lib/utils";

interface AssessmentFrameProps {
  questions: Question[];
  onComplete: (responses: Record<number, number>) => void;
}

export default function AssessmentFrame({ questions, onComplete }: AssessmentFrameProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  
  const currentQuestions = questions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const progress = (Object.keys(responses).length / questions.length) * 100;
  const isPageComplete = currentQuestions.every(q => responses[q.id] !== undefined);

  useEffect(() => {
    gsap.fromTo(".assessment-page", 
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(responses);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-20 pb-40">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-foreground/5 z-50">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-12 flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest uppercase text-foreground/40">
          Page {currentPage + 1} of {totalPages}
        </span>
        <span className="text-xs font-bold tracking-widest uppercase text-accent">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <div className="assessment-page space-y-4">
        {currentQuestions.map((q) => (
          <QuestionItem
            key={q.id}
            id={q.id}
            text={q.text}
            maxScore={q.maxScore}
            value={responses[q.id]}
            onChange={(val) => setResponses(prev => ({ ...prev, [q.id]: val }))}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-16 flex items-center justify-between border-t border-foreground/10 pt-12">
        <button
          onClick={handleBack}
          disabled={currentPage === 0}
          className={cn(
            "flex items-center space-x-2 text-sm font-bold transition-all",
            currentPage === 0 ? "opacity-20 cursor-not-allowed" : "hover:text-accent"
          )}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isPageComplete}
          className={cn(
            "px-8 py-3 bg-foreground text-background text-sm font-bold flex items-center space-x-3 rounded-sm transition-all shadow-sm",
            !isPageComplete ? "opacity-20 cursor-not-allowed" : "hover:bg-accent hover:shadow-xl active:scale-95"
          )}
        >
          <span>{currentPage === totalPages - 1 ? "Calculate Results" : "Next Page"}</span>
          {currentPage === totalPages - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
