"use client";

// Force Dynamic Rendering for useSearchParams Static Analysis
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import ReactMarkdown from "react-markdown";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

// Elite Motion Constants (Cubic-Bezier)
const EASE_STANDARD = "cubic-bezier(0.2, 0.0, 0, 1.0)";
const EASE_ENTRANCE = "cubic-bezier(0.05, 0.7, 0.1, 1.0)";
const EASE_EXIT = "cubic-bezier(0.3, 0.0, 0.8, 0.15)";
const DUR_MICRO = 0.15;
const DUR_STRUCTURAL = 0.4;
const STAGGER_DEFAULT = 0.05;

const LoadingState = () => (
  <main className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] flex flex-col items-center justify-center font-mono p-12 overflow-hidden">
    <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
         style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(0,0,0,1) 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
    
    <div className="relative">
      <div className="w-1 h-32 bg-black/5 relative overflow-hidden mb-12 mx-auto">
         <div className="absolute top-0 left-0 w-full bg-[#6D28D9] h-1/2 animate-[shimmer_1.5s_infinite_linear]" />
      </div>
      <div className="text-center space-y-6">
        <p className="text-[9px] tracking-[0.8em] font-black uppercase text-[#6D28D9] animate-pulse">Syncing_Neural_Map</p>
        <div className="flex flex-col gap-2">
          <p className="text-[8px] tracking-[0.3em] font-mono text-black/20 uppercase">PROTOCOL: PS-SYN-8821</p>
          <p className="text-[8px] tracking-[0.3em] font-mono text-black/20 uppercase">TARGET_LOC: SCR_SCR_01</p>
        </div>
      </div>
    </div>
    
    <style jsx>{`
      @keyframes shimmer {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(200%); }
      }
    `}</style>
  </main>
);

// Elite Motion Constants (Luxurious & Slow)
const EASE_LUXE = "cubic-bezier(0.16, 1, 0.3, 1)";
const DUR_LUXE = 2.4; 
const STAGGER_LUXE = 0.4;
const PROTOCOL_VERSION = "V1.2 // REPORT_GENERATIVE_STATE";
const SYSTEM_AUTH = "SYSTEM_IDENT_HIGH_PRECISION // DATA_ENCRYPTION_ACTIVE // Ψ";

// Stockholm Minimalism Palette (Laboratory Light)
const COLORS = {
  bg: "#FDFDFD",
  text: "#0A0A0A",
  accent: "#6D28D9",
  hairline: "rgba(0,0,0,0.05)",
  dimText: "rgba(0,0,0,0.3)",
};

// Asset Mapping for the 7 Dimensions
const DIMENSION_ASSETS: Record<string, { folder: string; icons: Record<string, string> }> = {
  bfi: {
    folder: "Big 5 SVG",
    icons: {
      Openness: "Openness.svg",
      Conscientiousness: "Conscientiousness.svg",
      Extraversion: "Extraversion.svg",
      Agreeableness: "Agreeableness.svg",
      Neuroticism: "Neuroticism.svg",
    }
  },
  attachment: {
    folder: "Attachment style SVG",
    icons: {
      "Anxious-Preoccupied": "Anxious-Preoccupied.svg",
      "Dismissive-Avoidant": "Dismissive-Avoidant.svg",
      "Fearful-Avoidant": "Fearful-Avoidant.svg",
      "Secure": "Secure.svg",
    }
  },
  darkTriad: {
    folder: "THE Dark triad SVG",
    icons: {
      Machiavellianism: "Machiavellianism.svg",
      Narcissism: "Narcissism.svg",
      Psychopathy: "Psychopathy.svg",
    }
  },
  cognitive: {
    folder: "Cognitive Functions SVG",
    icons: {
      "Adaptive Observation": "Adaptive Observation.svg",
      "Empathic Integration": "Empathic Integration.svg",
      "External Engagement": "External Engagement.svg",
      "Internal Reflector": "Internal Reflector.svg",
    }
  }
};

const GEN_ASSETS: Record<string, string> = {
  drivers: "/assets/report/drivers.png",
  language: "/assets/report/language.png",
  resilience: "/assets/report/resilience.png",
};

/**
 * IntelligenceRow: A minimalist, row-based display for traits.
 * This is the core of the Stockholm School layout.
 */
function IntelligenceRow({ label, value, description, color, icon, variant = "default" }: { label: string, value: number | string, description: string, color: string, icon: any, variant?: "default" | "compact" | "card" }) {
  if (variant === "card") {
    return (
      <div className="stagger-reveal group relative p-12 rounded-[4rem] bg-black/[0.02] border border-black/5 backdrop-blur-xl transition-all duration-700 hover:bg-black group-hover:text-white hover:-translate-y-4 overflow-hidden flex flex-col items-center text-center">
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-60 transition-opacity ${color.replace('text-', 'bg-')}`} />
        
        <div className="relative z-10 space-y-12 w-full">
          <div className="group-hover:scale-110 transition-all duration-1000 flex justify-center">
            {icon ? (typeof icon === 'string' ? <img src={icon} className="w-56 h-56 group-hover:drop-shadow-[0_0_40px_rgba(109,40,217,0.3)] transition-all object-contain" alt="" /> : icon) : null}
          </div>
          
          <div className="space-y-6">
            <div className="text-7xl md:text-8xl font-thin tracking-tighter text-[#0A0A0A] group-hover:text-white transition-colors">
              {value}{typeof value === 'number' ? '%' : ''}
            </div>
            <div className="text-[12px] font-mono tracking-[0.6em] text-black/40 group-hover:text-white/60 transition-opacity uppercase font-black">
              {label}
            </div>
          </div>
 
          <p className="text-sm text-black/50 leading-relaxed font-light px-8 group-hover:text-white/80 transition-colors">
            {description}
          </p>
        </div>
      </div>
    );
  }
 
  if (variant === "compact") {
    return (
      <div className="stagger-reveal group py-10 border-b border-black/5 flex flex-col md:grid md:grid-cols-12 gap-8 items-center hover:bg-black/[0.01] transition-all px-8 md:px-0">
        <div className="md:col-span-1 flex justify-center opacity-60">
           {icon ? (typeof icon === 'string' ? <img src={icon} className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all object-contain" alt="" /> : icon) : null}
        </div>
        <div className="md:col-span-3 space-y-2 text-center md:text-left">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#6D28D9] uppercase font-black">{label}</p>
          <p className="text-sm text-black/50 font-light italic leading-tight">{description}</p>
        </div>
        <div className="md:col-span-8 w-full h-[6px] bg-black/5 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#6D28D9] transition-all duration-1000 origin-left"
            style={{ width: `${value}%` }} 
          />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-black/20" />
        </div>
      </div>
    );
  }
 
  return (
    <div className="stagger-reveal group flex items-center justify-between py-12 border-b border-black/10 hover:bg-black/[0.02] transition-all px-4 rounded-xl">
      <div className="flex items-center gap-10">
        <div className="w-16 h-16 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          {icon ? (typeof icon === 'string' ? <img src={icon} className="w-16 h-16 object-contain" alt="" /> : icon) : null}
        </div>
        <div className="space-y-2">
          <h4 className="text-[12px] font-mono tracking-[0.6em] text-[#6D28D9] uppercase font-black">{label}</h4>
          <p className="text-sm text-black/40 font-light max-w-md">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-6xl md:text-8xl font-thin tracking-tighter text-[#0A0A0A] opacity-80 group-hover:opacity-100 transition-all`}>
          {value}{typeof value === 'number' ? '%' : ''}
        </span>
      </div>
    </div>
  );
}

/**
 * DossierSection: Immersive vertical section with extreme white space.
 */
function DossierSection({ num, title, description, children, accentColor = "text-[#6D28D9]", illustration, variant = "default", id }: { num: number, title: string, description: string, children: React.ReactNode, accentColor?: string, illustration?: string, variant?: "default" | "flipped" | "centered" | "heroic" | "protocol", id?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dataSeg = `DATA_SEG_0${num}`;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Header reveal (Assessment-style: Blur + Y-slide)
    gsap.fromTo(titleRef.current, 
      { opacity: 0, filter: "blur(10px)", y: 20 },
      { 
        opacity: 1, filter: "blur(0px)", y: 0, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
      }
    );

    // Staggered reveal for children
    gsap.fromTo(sectionRef.current.querySelectorAll('.stagger-reveal'),
      { opacity: 0, filter: "blur(8px)", y: 30 },
      {
        opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.15, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
      }
    );

    // Image reveal
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, filter: "blur(15px)", y: 40 },
        {
          opacity: 1, filter: "blur(0px)", y: 0, duration: 2, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );
      
      // Subtle float parallax
      gsap.to(imageRef.current.querySelector('img'), {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, [variant]);

  if (variant === "heroic") {
    return (
      <section ref={sectionRef} id={id || `dimension-${num}`} className="py-32 border-t border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src={illustration} className="w-full h-full object-cover opacity-5 border-black/10 blur-xl scale-110" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#FDFDFD] via-transparent to-[#FDFDFD]" />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-24">
          <div className="space-y-12 max-w-4xl mx-auto">
            <span className={`text-[12px] font-mono ${accentColor} tracking-[1em] font-black uppercase opacity-60`}>Finale_Dimension_0{num}</span>
            <h2 ref={titleRef} className="text-6xl md:text-[8rem] font-thin tracking-tighter text-[#0A0A0A] leading-none capitalize">{title}</h2>
            <p className="text-2xl text-black/50 font-light leading-relaxed max-w-3xl mx-auto italic">
              {description}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "protocol") {
    return (
      <section ref={sectionRef} id={id || `dimension-${num}`} className="py-32 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-8 w-full space-y-32">
          <div className="text-center space-y-16 stagger-reveal">
            <div className="flex flex-col items-center gap-8">
              <span className={`text-[11px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Dimension_Ref_{num} // Segment_0{num}</span>
              <div className="w-[1px] h-[100px] bg-gradient-to-b from-black/20 to-transparent" />
            </div>
            <h2 ref={titleRef} className="text-5xl md:text-8xl font-thin tracking-tight text-[#0A0A0A] leading-tight capitalize max-w-4xl mx-auto">
              {title}
            </h2>
            <p className="text-2xl text-black/40 font-light leading-relaxed max-w-2xl mx-auto px-4 italic">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {children}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section ref={sectionRef} id={id || `dimension-${num}`} className="py-32">
        <div className="max-w-7xl mx-auto px-8 space-y-32">
          <div className="text-center space-y-16">
            <div className="flex flex-col items-center gap-8">
              <span className={`text-[10px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Dimension_0{num} // PSYPHER_DATA_SEG</span>
              <div className="w-[1px] h-[80px] bg-black/10" />
            </div>
            <h2 ref={titleRef} className="text-6xl md:text-8xl font-thin tracking-tighter text-[#0A0A0A] leading-tight capitalize max-w-5xl mx-auto">{title}</h2>
            <p className="text-xl text-black/40 font-medium leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          
          <div ref={imageRef} className="max-w-4xl mx-auto aspect-video relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent rounded-3xl blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <img src={illustration} className="w-full h-full object-contain relative z-10 brightness-95 opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-90 group-hover:scale-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-12">
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id={id || `dimension-${num}`} className="py-40 first:pt-0">
      <div className="max-w-7xl mx-auto px-8 space-y-24">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-24 items-center ${variant === "flipped" ? "direction-rtl" : ""}`}>
          <div className={`${variant === "flipped" ? "lg:col-start-7 lg:col-span-6 lg:order-2" : "lg:col-span-7"} space-y-8`}>
            <div className={`flex items-center gap-6 ${variant === "flipped" ? "flex-row-reverse" : ""}`}>
              <span className={`text-[10px] font-mono ${accentColor} tracking-[0.5em] font-black uppercase opacity-60`}>Dimension_0{num}</span>
              <div className="w-[40px] h-[0.5px] bg-black/10" />
            </div>
            <h2 ref={titleRef} className="text-7xl md:text-9xl font-thin tracking-tighter text-[#0A0A0A] leading-none uppercase">{title}</h2>
            <p className="text-xl text-black/40 font-medium leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          <div ref={imageRef} className={`${variant === "flipped" ? "lg:col-span-6 lg:order-1" : "lg:col-span-5"} aspect-square relative group pb-12`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6D28D9]/5 to-transparent rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <img 
              src={illustration} 
              alt="" 
              className="w-full h-full object-contain relative z-10 opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
            />
          </div>
        </div>

        <div className="space-y-0">
          {children}
        </div>
      </div>
    </section>
  );
}

function ReportContent() {
  const [report, setReport] = useState<string>("");
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchReport = async () => {
      const isDemo = searchParams.get("demo") === "true";
      const isBypass = searchParams.get("bypass") === "true";
      if (isDemo || isBypass) setIsUnlocked(true);

      try {
        if (isDemo) {
          setScores({
            bfi: { 
              Openness: 88, 
              Conscientiousness: 92, 
              Extraversion: 45, 
              Agreeableness: 32, 
              Neuroticism: 58 
            },
            darkTriad: { 
              Machiavellianism: 84, 
              Psychopathy: 22, 
              Narcissism: 68 
            },
            attachment: { 
              Style: "Dismissive-Avoidant", 
              Security: 15, 
              Anxiety: 48, 
              Avoidance: 89 
            },
            cognitive: {
              Type: "Strategic Architect (INTJ)",
              Functions: { 
                "Adaptive Observation": 95, 
                "Empathic Integration": 42, 
                "External Engagement": 65, 
                "Internal Reflector": 88 
              }
            },
            drivers: {
              "Power & Impact": 85,
              "Self-Direction": 92,
              "Achievement": 78,
              "Security": 45
            },
            language: {
              Analytical: 94,
              Social: 12,
              Clout: 88,
              Authentic: 35
            },
            resilience: {
              Durability: 82,
              Agility: 65,
              "Stress Level": 28,
              Focus: 91
            }
          });
          setReport(`# Executive Summary: The Architect Map

## ANALYSIS: TARGET STATUS
Your neural architecture reflects a rare alignment between objective logic and long-term vision protocol. 
Most professionals struggle with the "noise" of social momentum or emotional reactive cycles.
You operate entirely above the status quo.

## FRICTION: THE COST OF HEDGING
Remaining unaware of these high-stakes patterns leads to significant decision friction and efficiency leaks.
You possess a Strategic Alpha Edge (84%) but often isolate your data while building systems alone.
Actionable results require collaborative alignment without compromising your core architectural values.

## PROTOCOL: PSYPHER SYNTHESIS
We mapped seven layers of hidden cognitive habits to reveal your unique success blueprint.
This dossier removes the guesswork from your interpersonal dynamics and high-pressure negotiations.
Reclaim your focus by applying the specific "Emotional Stoicism" triggers found in this report.`);
          setLoading(false);
          return;
        }
        
        const storedAnswers = sessionStorage.getItem("psypher_answers");
        if (storedAnswers) {
          const response = await fetch("/api/generate-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: JSON.parse(storedAnswers) }),
          });
          if (response.ok) {
            const data = await response.json();
            setScores(data.scores);
            setReport(data.report);
          }
        }
      } catch (err) {
        console.error("Report Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [searchParams]);

  // Entrance Animation Reveal Logic
  useEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        // Enforce Elite Cubic-Bezier for Entrance
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: DUR_STRUCTURAL,
          ease: "none",
        });

        // Global Scroll Progress Bar
        gsap.to("#scroll-progress-bar", {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
          }
        });

        // Staggered Entrance for Initial View Sections
        gsap.from("section", {
          y: 40,
          opacity: 0,
          duration: DUR_LUXE,
          stagger: STAGGER_LUXE,
          ease: CustomEase.create("custom", "0.16, 1, 0.3, 1"),
        });
      }, containerRef);
      
      return () => ctx.revert();
    }
  }, [loading]);

  if (loading) return <LoadingState />;

  const getIcon = (dimension: string, trait: string) => {
    const dim = DIMENSION_ASSETS[dimension];
    if (!dim) return GEN_ASSETS[dimension] || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=300";
    return `/assets/report/${dim.folder}/${dim.icons[trait] || "default.svg"}`;
  };

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] font-outfit pb-40 opacity-0 selection:bg-[#6D28D9] selection:text-white"
    >
      {/* Delicate Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Sticky Progress Line */}
      <div className="fixed left-0 top-0 w-[2px] h-full bg-white/5 z-50">
        <div id="scroll-progress-bar" className="absolute top-0 left-0 w-full bg-[#6D28D9] shadow-[0_0_20px_rgba(109,40,217,0.5)]" style={{ height: "0%" }} />
      </div>
      <header className="px-8 md:px-24 py-4 flex justify-between items-center relative z-20 border-b border-black/5 bg-[#FDFDFD]/60 backdrop-blur-3xl sticky top-0 font-outfit">
        <div className="flex items-center">
           <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
             <div className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center text-sm font-light text-[#0A0A0A] group-hover:bg-black group-hover:text-white transition-all duration-500">Ψ</div>
             <span className="text-[9px] font-bold tracking-[0.5em] uppercase opacity-60">Psypher</span>
           </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 opacity-30 select-none text-[#0A0A0A]">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black italic">{PROTOCOL_VERSION}</span>
        </div>
 
        <div className="flex gap-10 items-center">
          <button className="text-[8px] font-mono font-black uppercase tracking-widest opacity-20 hover:opacity-80 transition-opacity text-[#0A0A0A]">
            Download
          </button>
          <button className="text-[8px] font-mono font-black uppercase tracking-widest bg-black text-white px-6 py-2 rounded-full hover:bg-[#0A0A0A]/80 transition-all">
            Export
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 md:px-24 mt-40 space-y-32 relative z-10">
        
        {/* Initial Profile Hero */}
        <section className="space-y-32">
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono text-[#6D28D9] tracking-[0.6em] uppercase font-black">Subject_Analysis</span>
              <div className="flex-1 h-[0.5px] bg-black/5" />
            </div>
            <h1 className="text-8xl md:text-[14rem] font-thin tracking-tighter leading-none text-[#0A0A0A] lowercase">
              Profile_Alpha<span className="text-[#6D28D9]">.</span>
            </h1>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-end">
            <div className="lg:col-span-7 space-y-12">
              <p className="text-4xl md:text-6xl font-extralight text-black/90 leading-[1.1] tracking-tight">
                You operate as a <span className="text-[#0A0A0A] font-medium italic underline decoration-[#6D28D9]/40 underline-offset-8">Strategic Architect</span>.
              </p>
              <p className="text-xl text-black/40 leading-relaxed font-medium max-w-xl">
                This dossier removes the guesswork from your interpersonal dynamics and high-pressure negotiations. 
                We have synthesized seven layers of cognitive habits to reveal your underlying success blueprint.
              </p>
            </div>
            <div className="lg:col-span-5 space-y-12 border-l border-black/5 pl-12 h-fit mb-4">
               {[
                { label: "Internal_ID", val: "SYN-8821" },
                { label: "Assessed_On", val: new Date().toISOString().split('T')[0] },
                { label: "Reliability", val: "99.4%" },
               ].map((item) => (
                <div key={item.label} className="flex justify-between items-center group/meta">
                   <span className="text-[9px] font-mono text-black/20 uppercase tracking-[0.3em] font-black group-hover/meta:text-[#6D28D9] transition-colors">{item.label}</span>
                   <span className="text-[11px] font-mono text-[#0A0A0A] font-black uppercase tracking-widest">{item.val}</span>
                </div>
               ))}
            </div>
          </div>
        </section>

        {/* Executive Summary Narrative */}
        <DossierSection
          num={0}
          title="Executive Summary"
          description="A high-level synthesis of your primary neural architectural markers."
          accentColor="text-black"
          variant="protocol"
          id="executive-summary"
        >
          <div className="col-span-full py-12 bg-black/[0.02] -mx-4 rounded-3xl px-12 md:px-24 border border-black/5 stagger-reveal">
             <div className="max-w-4xl mx-auto space-y-20 report-markdown py-20 text-black/80">
                <ReactMarkdown>{report}</ReactMarkdown>
             </div>
          </div>
        </DossierSection>

        {/* Intelligence Journey */}
        <div className="space-y-40">
          
          <DossierSection 
            num={1}
            title="Personality Architecture"
            description="The core layers of your everyday behavior and how you engage with your environment."
            illustration="/assets/report/Big 5 SVG/Openness.svg"
            variant="protocol"
            accentColor="text-purple-500"
          >
            {scores?.bfi && Object.entries(scores.bfi).map(([trait, val]: any) => (
              <IntelligenceRow 
                key={trait}
                label={trait}
                value={val}
                color="text-purple-500"
                variant="card"
                icon={getIcon("bfi", trait)}
                description={
                  trait === "Openness" ? "Neural potential for high-stakes innovation vs status-quo maintenance." :
                  trait === "Conscientiousness" ? "Quality-control protocol and systemic organizational persistence." :
                  trait === "Extraversion" ? "Social recharge velocity and independent work durability." :
                  trait === "Agreeableness" ? "Negotiation stance—results priority vs collective harmony." :
                  "Targeted environmental sensitivity and risk-mitigation radar."
                }
              />
            ))}
          </DossierSection>

          <DossierSection 
            num={2}
            title="The Dark Triad"
            description="The clinical sub-clinical triad: Machiavellianism, Narcissism, and Psychopathy. Your scores represent high-stakes tactical advantages and risk markers."
            accentColor="text-red-600"
            illustration="/assets/report/THE Dark triad SVG/Narcissism.svg"
            variant="protocol"
          >
            {scores?.darkTriad && Object.entries(scores.darkTriad).map(([trait, val]: any) => (
              <IntelligenceRow 
                key={trait}
                label={trait}
                value={val}
                color="text-red-600"
                variant="card"
                icon={getIcon("darkTriad", trait)}
                description={
                  trait === "Machiavellianism" ? "Strategic deception, social manipulation, and the calculated use of others as instruments for goal achievement." :
                  trait === "Narcissism" ? "Ego maintenance, grandiosity, and the exploitation of perceived status symbols for dominance." :
                  "Lowered inhibitory response and a clinical capacity for emotional detachment in high-stress, high-stakes decision cycles."
                }
              />
            ))}
          </DossierSection>

          <DossierSection 
            num={3}
            title="Relational Matrix"
            description="How you build trust, manage professional boundaries, and relate to your peers."
            accentColor="text-blue-400"
            illustration="/assets/report/Attachment style SVG/Secure.svg"
            variant="protocol"
          >
            {scores?.attachment && (
              <>
                <IntelligenceRow 
                  label="Core_Style"
                  value={scores.attachment.Style.replace('-', ' ')}
                  color="text-blue-400"
                  variant="card"
                  icon={getIcon("attachment", scores.attachment.Style)}
                  description={`Your behavior profile aligns with the ${scores.attachment.Style} protocol.`}
                />
                <IntelligenceRow 
                  label="Trust_Index"
                  value={scores.attachment.Security}
                  color="text-blue-400"
                  variant="card"
                  icon={getIcon("attachment", "Secure")}
                  description="Capacity for authentic, high-security professional bonding."
                />
                <IntelligenceRow 
                  label="Security_Score"
                  value={scores.attachment.Security}
                  color="text-blue-400"
                  variant="card"
                  icon={getIcon("attachment", "Secure")}
                  description="Baseline relational durability metric."
                />
              </>
            )}
          </DossierSection>

          {!isUnlocked && (
            <section className="py-60 text-center relative border-t border-black/5 space-y-16">
                <div className="space-y-8 max-w-3xl mx-auto">
                  <span className="text-[10px] font-mono text-[#6D28D9] tracking-[1.5em] uppercase font-black opacity-40">Section_Restricted</span>
                  <h3 className="text-7xl md:text-9xl font-thin tracking-tighter text-[#0A0A0A] lowercase">
                    Deep<span className="text-[#6D28D9]">_</span>Scan
                  </h3>
                  <p className="text-xl text-black/40 max-w-xl mx-auto font-medium leading-relaxed">
                    The final four dimensions are currently behind encrypted access. 
                    Reclaim your full neural map to exit the blind-spot cycle.
                  </p>
                </div>
                
                <div className="absolute inset-0 z-0 bg-black/[0.01] backdrop-blur-[2px]" />
                
                <button 
                  onClick={() => setIsUnlocked(true)}
                  className="relative z-10 bg-black text-white px-24 py-6 rounded-full font-bold hover:scale-105 transition-all text-[10px] tracking-[0.3em] uppercase mt-12 shadow-2xl"
                >
                  Unlock Complete Dossier
                </button>
            </section>
          )}

          <div className={`space-y-40 transition-all duration-1000 ${!isUnlocked ? "blur-[100px] opacity-[0.05] pointer-events-none select-none max-h-[1000px] overflow-hidden" : ""}`}>
            <DossierSection 
              num={4}
              title="Cognitive Mechanics"
              description="Information processing architecture and decision-making logic gates."
              accentColor="text-amber-400"
              id="dimension-4"
              illustration="/assets/report/Cognitive Functions SVG/Adaptive Observation.svg"
              variant="protocol"
            >
               {scores?.cognitive?.Functions && Object.entries(scores.cognitive.Functions).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  color="text-amber-400"
                  variant="card"
                  icon={getIcon("cognitive", trait)}
                  description={
                    trait === "Adaptive Observation" ? "Propensity for real-time recalibration under changing environmental inputs." :
                    trait === "Empathic Integration" ? "Capacity for absorbing and processing non-verbal social indicators into decisions." :
                    trait === "External Engagement" ? "Velocity of converting neural intent into overt physical or verbal action." :
                    "Depth of recursive internal simulation before commitment to action."
                  }
                />
              ))}
            </DossierSection>

            <DossierSection 
              num={5}
              id="dimension-5"
              title="Core Drivers"
              description="The underlying motivational architecture that fuels your high-stakes performance."
              accentColor="text-orange-500"
              illustration="/assets/report/drivers.png"
              variant="protocol"
            >
              {scores?.drivers && Object.entries(scores.drivers).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  color="text-orange-500"
                  variant="card"
                  icon="/assets/report/drivers.png"
                  description={
                    trait === "Power & Impact" ? "Subconscious drive for environmental control and agency over systemic outcomes." :
                    trait === "Self-Direction" ? "Need for autonomous decision-making loops without external authority interference." :
                    trait === "Achievement" ? "Internal threshold for success measurement and personal legacy metrics." :
                    "Priority placed on systemic stability and the mitigation of existential risks."
                  }
                />
              ))}
            </DossierSection>

            <DossierSection 
              num={6}
              id="dimension-6"
              title="Linguistic Fingerprint"
              description="Neural markers found in your communication patterns that reveal hidden cognitive biases."
              accentColor="text-cyan-400"
              illustration="/assets/report/language.png"
              variant="protocol"
            >
              {scores?.language && Object.entries(scores.language).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  color="text-cyan-400"
                  variant="card"
                  icon="/assets/report/language.png"
                  description={
                    trait === "Analytical" ? "Density of logical connective markers and preference for objective evidence." :
                    trait === "Social" ? "Frequence of relational cues and community-oriented linguistic structures." :
                    trait === "Clout" ? "Communicative indicators of status-awareness and hierarchical positioning." :
                    "Markers of transparency, vulnerability, and baseline communicative honesty."
                  }
                />
              ))}
            </DossierSection>

            <DossierSection 
              num={7}
              id="dimension-7"
              title="Resilience Index"
              description="Your psychological bypass capacity for maintaining focus under extreme pressure."
              accentColor="text-pink-500"
              illustration="/assets/report/resilience.png"
              variant="heroic"
            >
              {scores?.resilience && Object.entries(scores.resilience).map(([trait, val]: any) => (
                <IntelligenceRow 
                  key={trait}
                  label={trait}
                  value={val}
                  color="text-pink-500"
                  variant="card"
                  icon="/assets/report/resilience.png"
                  description={
                    trait === "Durability" ? "Baseline capacity to withstand extended periods of high-stress environmental noise." :
                    trait === "Agility" ? "Speed of psychological recovery after high-impact cognitive friction." :
                    trait === "Focus" ? "Signal-to-noise optimization during peak mental task performance." :
                    "Real-time measurement of current environmental pressure levels."
                  }
                />
              ))}
            </DossierSection>
          </div>
        </div>

        <footer className="pt-40 border-t border-black/5 flex flex-col md:flex-row justify-between items-start gap-16 opacity-30 pb-20">
          <div className="space-y-4">
            <div className="flex gap-10 text-[9px] font-mono uppercase tracking-[0.4em] font-black text-[#0A0A0A]">
              <span className="text-[#6D28D9]">Proprietary</span>
              <span>Ref: PS-SYN-8821</span>
            </div>
            <p className="text-[9px] font-mono leading-relaxed uppercase tracking-[0.2em] font-black max-w-xs text-black/60">
              For authorized target use only. Duplicate at Subject-Level risk.
            </p>
          </div>
          
          <div className="w-full flex justify-center py-10 opacity-60">
             <span className="text-[9px] font-mono tracking-[0.6em] uppercase font-bold text-black/40">
               {SYSTEM_AUTH}
             </span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .report-markdown h1 { font-size: 7rem; color: #0A0A0A; line-height: 0.85; margin-bottom: 5rem; letter-spacing: -0.06em; font-weight: 950; text-transform: uppercase; }
        .report-markdown h2 { font-size: 1.25rem; color: #6D28D9; margin-top: 8rem; margin-bottom: 3rem; font-family: monospace; font-weight: 900; letter-spacing: 0.4em; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 2rem; }
        .report-markdown p { margin-bottom: 3rem; line-height: 1.6; font-weight: 400; font-size: 1.75rem; tracking: -0.02em; color: rgba(0,0,0,0.7); }
        .report-markdown strong { color: #0A0A0A; font-weight: 900; }
        .vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); }
      `}</style>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReportContent />
    </Suspense>
  );
}
