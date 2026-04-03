"use client";

import { cn } from "@/lib/utils";

interface QuestionItemProps {
  id: number;
  text: string;
  maxScore: number;
  value?: number;
  onChange: (value: number) => void;
}

export default function QuestionItem({ id, text, maxScore, value, onChange }: QuestionItemProps) {
  return (
    <div className="py-8 border-b border-foreground/5 last:border-0">
      <p className="text-xl font-medium mb-6 leading-tight">
        <span className="text-accent/50 mr-4 font-mono text-sm">{id.toString().padStart(2, '0')}</span>
        {text}
      </p>
      <div className="flex items-center justify-between gap-2 max-w-xl">
        <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/30">Strongly Disagree</span>
        <div className="flex items-center gap-1 md:gap-3">
          {Array.from({ length: maxScore }).map((_, i) => {
            const score = i + 1;
            const isSelected = value === score;
            
            return (
              <button
                key={score}
                onClick={() => onChange(score)}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full border transition-all duration-300 flex items-center justify-center text-sm font-bold",
                  isSelected 
                    ? "bg-accent border-accent text-white scale-110 shadow-lg shadow-accent/20" 
                    : "bg-white border-foreground/10 hover:border-accent text-foreground/50 hover:text-accent"
                )}
              >
                {score}
              </button>
            );
          })}
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/30 text-right">Strongly Agree</span>
      </div>
    </div>
  );
}
