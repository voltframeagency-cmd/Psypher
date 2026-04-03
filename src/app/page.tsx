'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const lightSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Color shifts
      ScrollTrigger.create({
        trigger: darkSectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => gsap.to(containerRef.current, { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 0.8 }),
        onLeaveBack: () => gsap.to(containerRef.current, { backgroundColor: "#FAFAF8", color: "#111111", duration: 0.8 }),
      });
      ScrollTrigger.create({
        trigger: lightSectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => gsap.to(containerRef.current, { backgroundColor: "#FAFAF8", color: "#111111", duration: 0.8 }),
        onLeaveBack: () => gsap.to(containerRef.current, { backgroundColor: "#0F0F0F", color: "#F5F0EB", duration: 0.8 }),
      });

      // Hero
      gsap.fromTo('.hero-title span', 
        { y: 100, opacity: 0, rotationX: -80, transformOrigin: "0% 50% -50" }, 
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 }
      );
      gsap.fromTo('.hero-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      
      // Vignettes
      gsap.utils.toArray('.vignette-float').forEach((el: any) => {
        gsap.to(el, {
          y: 'random(-30, 30)', x: 'random(-30, 30)', rotation: 'random(-20, 20)',
          duration: 'random(4, 7)', repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
      });

      // How It Works
      gsap.fromTo('.hiw-header', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: '#how-it-works', start: 'top 80%' } });
      gsap.fromTo('.hiw-card', 
        { y: 100, opacity: 0, rotationY: 25, transformOrigin: "left center" }, 
        { y: 0, opacity: 1, rotationY: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.hiw-card', start: 'top 85%' } }
      );

      // Agitation
      gsap.fromTo('.agitation-text', 
        { opacity: 0, filter: 'blur(15px)', y: 40 }, 
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.5, stagger: 0.3, ease: 'power2.out', scrollTrigger: { trigger: darkSectionRef.current, start: 'top 70%' } }
      );

      // Report Preview
      gsap.fromTo('.report-text', { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.report-text', start: 'top 75%' } });
      gsap.fromTo('.report-card', { x: 100, opacity: 0, rotationZ: 10 }, { x: 0, opacity: 1, rotationZ: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.report-card', start: 'top 75%' } });
      gsap.fromTo('.progress-bar-fill', { width: '0%' }, { width: (i, el) => el.getAttribute('data-width'), duration: 1.5, ease: 'power4.out', scrollTrigger: { trigger: '.report-card', start: 'top 60%' } });

      // Generic Reveals
      gsap.utils.toArray('.reveal-text').forEach((el: any) => {
        gsap.fromTo(el, 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });

      gsap.utils.toArray('.parallax-card').forEach((el: any) => {
        gsap.fromTo(el,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });

      // Number Ticker
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 12847, 
        duration: 2.5, 
        ease: 'power2.out', 
        scrollTrigger: { trigger: '.counter-text', start: 'top 85%' },
        onUpdate: () => {
          const el = document.querySelector('.counter-text');
          if (el) el.innerHTML = Math.floor(counterObj.val).toLocaleString();
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen transition-colors duration-700 bg-[#FAFAF8] text-[#111111]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between mix-blend-difference text-[#F5F0EB]">
        <div className="flex items-center gap-3 font-bold text-xl md:text-2xl">
          <span className="text-3xl md:text-4xl font-serif">Ψ</span>
          <span className="tracking-[0.15em] mt-1">PSYPHER<span className="text-[#7C3AED]">.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#how-it-works" className="hover:opacity-70 transition-opacity">How It Works</a>
          <a href="#pricing" className="hover:opacity-70 transition-opacity">Pricing</a>
          <Link 
            href="/assessment" 
            className="px-5 py-2 bg-[#7C3AED] text-white rounded-full hover:bg-[#6D28D9] transition-all"
          >
            Start Assessment
          </Link>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ opacity: 0.6, mixBlendMode: 'multiply' }}
          src="https://cdn.midjourney.com/video/566125f4-4a32-4676-9bb6-34ae4b723d70/0.mp4"
        />
        {/* Animated Vignette */}
        <svg className="vignette-float absolute top-1/4 right-1/4 w-64 h-64 text-[#7C3AED] opacity-20 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.4,-2.5C98,13.1,93.2,28.9,84.1,42.3C75,55.7,61.6,66.7,46.7,74.4C31.8,82.1,15.9,86.5,0.2,86.2C-15.5,85.9,-31,80.9,-44.6,72.6C-58.2,64.3,-69.9,52.7,-78.3,39.1C-86.7,25.5,-91.8,9.9,-91.3,-5.4C-90.8,-20.7,-84.7,-35.7,-75.2,-48.2C-65.7,-60.7,-52.8,-70.7,-38.8,-77.9C-24.8,-85.1,-9.7,-89.5,3.1,-94.1C15.9,-98.7,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>

        <div className="px-8 md:px-24 pt-24 pb-12 max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-4xl">
            <h1 className="hero-title text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-8 flex flex-wrap gap-x-4">
              {["What", "is", "your", "personality", "costing", "you?"].map((word, i) => (
                <span key={i} className="inline-block">{word}</span>
              ))}
            </h1>
          <p className="hero-desc text-xl md:text-2xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            Traditional personality tests put you in a box. We give you the keys to break out of it. Decode your psychological blueprint in 10 minutes.
          </p>
          <div className="hero-cta flex flex-col items-start gap-4">
            <Link 
              href="/assessment" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#7C3AED] text-white font-medium rounded-full hover:bg-[#6D28D9] transition-colors group"
            >
              Get my free mini-report
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 font-medium">
              No credit card required. Discover your dominant trait instantly.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-32 px-8 md:px-24 max-w-7xl mx-auto relative">
        {/* Animated Vignette */}
        <svg className="vignette-float absolute bottom-0 left-10 w-48 h-48 text-gray-200 opacity-50 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.9,-65.7C54.1,-60.5,69.6,-53.8,79.5,-41.8C89.4,-29.8,93.7,-12.5,91.3,4.1C88.9,20.7,79.8,36.6,67.6,48.8C55.4,61,40.1,69.5,23.9,75.1C7.7,80.7,-9.4,83.4,-25.2,79.5C-41,75.6,-55.5,65.1,-66.1,51.6C-76.7,38.1,-83.4,21.6,-84.9,4.7C-86.4,-12.2,-82.7,-29.5,-73.2,-43.6C-63.7,-57.7,-48.4,-68.6,-33.4,-73.3C-18.4,-78,-3.7,-76.5,10.2,-73.7C24.1,-70.9,37.3,-66.8,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>

        <div className="hiw-header mb-20 relative z-10">
          <span className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block">How It Works</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Three frameworks. One truth.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              num: "01",
              title: "The Big Five",
              desc: "Your core personality architecture. Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism."
            },
            {
              num: "02",
              title: "The Dark Triad",
              desc: "Your shadow side. Machiavellianism, Narcissism, Psychopathy — decoded as strategic assets, not diagnoses."
            },
            {
              num: "03",
              title: "Attachment Style",
              desc: "How you connect. Anxious, Avoidant, or Secure — and why your relationships follow the same pattern."
            }
          ].map((card, i) => (
            <div key={i} className="hiw-card p-8 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
              <span className="text-4xl font-light text-gray-300 mb-6 block">{card.num}</span>
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: The Agitation (Dark Mode Trigger) */}
      <section ref={darkSectionRef} className="py-32 px-8 md:px-24 min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Animated Vignette */}
        <svg className="vignette-float absolute top-1/3 right-10 w-96 h-96 text-[#7C3AED] opacity-10 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M51.8,-72.5C65.5,-61.5,73.8,-43.3,79.3,-24.1C84.8,-4.9,87.5,15.3,79.9,31.8C72.3,48.3,54.4,61.1,35.6,69.5C16.8,77.9,-2.9,81.9,-21.5,78.2C-40.1,74.5,-57.6,63.1,-69.5,47.4C-81.4,31.7,-87.7,11.7,-84.8,-7.1C-81.9,-25.9,-69.8,-43.5,-54.1,-55.1C-38.4,-66.7,-19.2,-72.3,0.8,-73.4C20.8,-74.5,41.6,-71.1,51.8,-72.5Z" transform="translate(100 100)" />
        </svg>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="agitation-text text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block">The Hidden Tax</span>
          <h2 className="agitation-text text-5xl md:text-7xl font-bold tracking-tighter mb-12">You are flying blind.</h2>
          
          <div className="space-y-8 text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
            <p className="agitation-text">
              You are working hard. You are putting in the hours. You are trying to say the right things in the right meetings.
            </p>
            <p className="agitation-text">
              But you keep hitting a ceiling. You watch people with half your talent get the promotions, the funding, and the relationships you want. You do not understand your own psychological wiring, which means you cannot control how others perceive you.
            </p>
            <p className="agitation-text text-[#F5F0EB] font-medium">
              This is the hidden tax of low self-awareness. It costs you money. It costs you influence. It costs you peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Report Preview */}
      <section className="py-32 px-8 md:px-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 report-text">
            <span className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block">Your Deep Report</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">The uncomfortable truth about how you operate.</h2>
            <Link 
              href="/assessment" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#7C3AED] text-white font-medium rounded-full hover:bg-[#6D28D9] transition-colors"
            >
              Unlock your report
            </Link>
          </div>
          <div className="flex-1 w-full report-card">
            <div className="relative w-full aspect-[4/5] bg-[#1A1A1A] rounded-2xl border border-gray-800 p-8 shadow-2xl overflow-hidden flex flex-col">
              <div className="h-4 w-1/3 bg-gray-800 rounded mb-8"></div>
              <div className="space-y-4 mb-12">
                {[85, 42, 91, 30, 65].map((val, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 text-xs text-gray-500">T{i+1}</div>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="progress-bar-fill h-full bg-[#7C3AED]" data-width={`${val}%`}></div>
                    </div>
                    <div className="w-8 text-xs text-gray-400 text-right">{val}%</div>
                  </div>
                ))}
              </div>
              <div className="flex-1 blur-sm space-y-4 opacity-50">
                <div className="h-4 w-full bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
                <div className="h-4 w-full bg-gray-700 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent flex items-end justify-center pb-12">
                <span className="px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-full text-sm font-medium text-[#7C3AED]">
                  Confidential Analysis
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Social Proof (Light Mode Trigger) */}
      <section ref={lightSectionRef} className="py-32 px-8 md:px-24 bg-[#FAFAF8] text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] mb-4 block reveal-text">What They Discovered</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter reveal-text">Real people. Real reports. Real change.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="parallax-card p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "I thought I was an introvert. Psypher showed me I was avoidant. That one insight saved my marriage."
              </p>
              <div className="font-medium">Sarah K.</div>
              <div className="text-sm text-gray-500">Product Manager</div>
            </div>
            <div className="parallax-card p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "The Dark Triad section made me uncomfortable. That is exactly why I needed it."
              </p>
              <div className="font-medium">James R.</div>
              <div className="text-sm text-gray-500">Executive Coach</div>
            </div>
          </div>
          
          <div className="text-center reveal-text">
            <div className="counter-text text-5xl font-bold tracking-tighter mb-2">12,847</div>
            <div className="text-gray-500 font-medium">reports generated this month.</div>
          </div>
        </div>
      </section>

      {/* Section 6: Pricing */}
      <section id="pricing" className="py-32 px-8 md:px-24 bg-[#FAFAF8] text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter reveal-text">Choose the depth you are ready for.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="parallax-card p-8 bg-white rounded-2xl border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Basic Summary</h3>
              <div className="text-4xl font-bold mb-6">$15.00</div>
              <p className="text-gray-600 mb-8 flex-1">A high-level overview of your Big Five traits.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Big Five Percentiles</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Basic Trait Descriptions</li>
              </ul>
              <Link href="/assessment" className="w-full py-3 text-center border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Select Basic
              </Link>
            </div>
            
            {/* Tier 2 (Highlighted) */}
            <div className="parallax-card p-8 bg-[#0F0F0F] text-[#F5F0EB] rounded-2xl border border-gray-800 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">The Deep Report</h3>
              <div className="text-4xl font-bold mb-6">$18.99</div>
              <p className="text-gray-400 mb-8 flex-1">The uncomfortable truth about how you operate.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Everything in Basic</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Dark Triad Analysis</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Attachment Style Breakdown</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Career Optimization</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Conflict Strategy</li>
              </ul>
              <Link href="/assessment?tier=deep" className="w-full py-3 text-center bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors">
                Get The Deep Report
              </Link>
            </div>
            
            {/* Tier 3 */}
            <div className="parallax-card p-8 bg-white rounded-2xl border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Compatibility</h3>
              <div className="text-4xl font-bold mb-6">$28.99</div>
              <p className="text-gray-600 mb-8 flex-1">Stop fighting. Start connecting.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Everything in Deep</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Joint Analysis (2 profiles)</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Friction Points</li>
                <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-[#7C3AED]" /> Power Dynamics</li>
              </ul>
              <Link href="/assessment?tier=compatibility" className="w-full py-3 text-center border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Select Compatibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA & Footer */}
      <section className="py-32 px-8 md:px-24 bg-[#0F0F0F] text-[#F5F0EB] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 reveal-text">Ready to decode your psychology?</h2>
          <p className="text-xl text-gray-400 mb-12 reveal-text">The cost of staying stuck is far greater than $18.99.</p>
          <Link 
            href="/assessment" 
            className="inline-flex items-center justify-center px-10 py-5 bg-[#7C3AED] text-white font-medium rounded-full hover:bg-[#6D28D9] transition-colors text-lg reveal-text"
          >
            Start my free assessment
          </Link>
        </div>
        
        <footer className="mt-32 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2 font-bold text-gray-300 mb-4 md:mb-0">
            <span className="text-2xl font-serif">Ψ</span>
            <span className="tracking-[0.15em] mt-1">PSYPHER<span className="text-[#7C3AED]">.</span></span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </footer>
      </section>
    </div>
  );
}
