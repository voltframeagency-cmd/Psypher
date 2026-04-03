"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote: "I thought I was an introvert. Psypher showed me I was avoidant. That one insight saved my marriage.",
    author: "Sarah K.",
    role: "Product Manager"
  },
  {
    quote: "The Dark Triad section made me uncomfortable. That is exactly why I needed it.",
    author: "James R.",
    role: "Executive Coach"
  }
];

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift to Light
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        onEnter: () => {
          gsap.to("body", { backgroundColor: "#FAFAF8", color: "#111111", duration: 0.8 });
        }
      });

      // Staggered reveal
      gsap.from(".testimonial-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out"
      });

      // Counter animation
      gsap.from(".counter-value", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        textContent: 0,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 bg-[#FAFAF8] text-[#111111]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="block text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4">
            What they discovered
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Real people. Real reports. <span className="text-foreground/40 italic block md:inline">Real change.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-item relative p-12 bg-white border border-foreground/5 rounded-sm hover:-translate-y-2 transition-transform duration-500 shadow-sm">
              <Quote className="text-accent/20 absolute top-8 right-8" size={64} />
              <p className="text-2xl font-bold tracking-tight mb-8 relative z-10 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">{t.author}</p>
                <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 pt-20 border-t border-foreground/5 text-center">
            <div className="flex flex-col items-center">
              <span className="counter-value text-7xl md:text-9xl font-black tracking-tighter tabular-nums mb-4">
                12847
              </span>
              <p className="text-xs font-bold tracking-[0.4em] uppercase text-foreground/40">
                Reports generated this month
              </p>
            </div>
        </div>
      </div>
    </section>
  );
}
