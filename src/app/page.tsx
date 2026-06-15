'use client';

import React from 'react';
import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import HowItWorks from '@/components/HowItWorks';
import ReportPreview from '@/components/ReportPreview';
import SocialProof from '@/components/SocialProof';
import PricingSection from '@/components/PricingSection';
import FinalCTA from '@/components/FinalCTA';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#111111] overflow-hidden">
      {/* 1. Stunning Hero with WebGL LiquidChrome & Magnets */}
      <Hero />

      {/* 2. Problem / Legacy Test Limitations */}
      <ProblemSection />

      {/* 3. Three Frameworks & The Agitation (Dark Mode Shift) */}
      <HowItWorks />

      {/* 4. Deep Report Preview (Lock Overlay & Interactive Parallax) */}
      <ReportPreview />

      {/* 5. Testimonial Social Proof & Staggered Counter */}
      <SocialProof />

      {/* 6. Spotlight Premium Pricing Grid */}
      <PricingSection />

      {/* 7. Final High-Status CTA & Stockholm Minimalist Footer */}
      <FinalCTA />
    </main>
  );
}
