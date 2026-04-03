"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const questions = [
  { id: 1, text: "I see myself as someone who is talkative", category: "Extraversion" },
  { id: 2, text: "I tend to find fault with others", category: "Agreeableness" },
  { id: 3, text: "I do a thorough job", category: "Conscientiousness" },
  { id: 4, text: "I am depressed, blue", category: "Neuroticism" },
  { id: 5, text: "I am original, come up with new ideas", category: "Openness" },
  { id: 6, text: "I am reserved", category: "Extraversion" },
  { id: 7, text: "I am helpful and unselfish with others", category: "Agreeableness" },
  { id: 8, text: "I can be somewhat careless", category: "Conscientiousness" },
  { id: 9, text: "I am relaxed, handle stress well", category: "Neuroticism" },
  { id: 10, text: "I am curious about many different things", category: "Openness" },
];

const options = [
  { label: "STRONGLY DISAGREE", value: 1 },
  { label: "DISAGREE", value: 2 },
  { label: "NEUTRAL", value: 3 },
  { label: "AGREE", value: 4 },
  { label: "STRONGLY AGREE", value: 5 },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      // Animate transition to next question
      const tl = gsap.timeline();
      tl.to(questionRef.current, {
        opacity: 0,
        filter: "blur(10px)",
        y: -20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          gsap.fromTo(
            questionRef.current,
            { opacity: 0, filter: "blur(10px)", y: 20 },
            { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6, ease: "power4.out" }
          );
        },
      });
    } else {
      // Finish assessment
      setIsFinishing(true);
      sessionStorage.setItem("psypher_answers", JSON.stringify(newAnswers));
      
      const tl = gsap.timeline();
      tl.to(containerRef.current, {
        opacity: 0,
        filter: "blur(20px)",
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          router.push("/report");
        },
      });
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-[#FAFAF8] text-[#0B0B0B] font-outfit p-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED] blur-[150px] rounded-full" />
      </div>

      {/* Header / Nav */}
      <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">Ψ</span>
          <span className="text-sm font-bold tracking-[0.2em] font-mono">PSYPHER</span>
        </div>
        <div className="text-[10px] font-mono tracking-widest opacity-40 uppercase">
          PROTOCOL V1.0 // SESSION_ACTIVE
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#E5E5E5] z-50">
        <div 
          ref={progressRef}
          className="h-full bg-[#7C3AED] transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Container */}
      <div className="max-w-3xl w-full text-center z-10">
        <div ref={questionRef} className="space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#7C3AED] uppercase">
              Question {currentStep + 1} of {questions.length}
            </span>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
              {questions[currentStep].text}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={isFinishing}
                className="group relative h-24 border border-[#0B0B0B]/10 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden transition-all duration-500 hover:border-[#7C3AED]"
              >
                <div className="absolute inset-0 bg-[#7C3AED] translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative text-[9px] font-mono tracking-widest font-bold transition-colors duration-500 group-hover:text-white uppercase px-2 text-center">
                  {option.label}
                </span>
                <span className="relative text-xs opacity-40 group-hover:text-white group-hover:opacity-100 transition-all duration-500">
                  {option.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {isFinishing && (
          <div className="fixed inset-0 bg-[#FAFAF8] z-[100] flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-12 h-12 border-t-2 border-[#7C3AED] rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-mono tracking-[0.4em] uppercase animate-pulse">
                Synthesizing Psychological Blueprint...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Institutional Metadata Footnote */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-[9px] font-mono opacity-20 tracking-widest">
          SYSTEM_IDENT_HIGH_PRECISION // DATA_ENCRYPTION_ACTIVE // Ψ
        </p>
      </div>
    </main>
  );
}
