"use client";
import React from "react";
import { Lock, ShieldAlert, Cpu } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

interface LockedStateGateProps {
  onUnlock: () => void;
}

export default function LockedStateGate({ onUnlock }: LockedStateGateProps) {
  return (
    <div className="w-full py-12 md:py-20 flex items-center justify-center">
      <SpotlightCard
        glowColor="rgba(239, 68, 68, 0.08)"
        className="w-full max-w-2xl bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-2xl"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-950/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-950/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Animation and Scanner Glow */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse" />
          <div className="relative p-6 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-500 flex items-center justify-center">
            <Lock size={32} className="animate-pulse" />
          </div>
        </div>

        {/* High-Tech Terminal Meta */}
        <div className="mb-6 flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-950/20 border border-red-900/30 rounded-full text-red-400 font-mono text-[8px] tracking-[0.25em] uppercase font-black">
            <ShieldAlert size={10} />
            RESTRICTED_ACCESS_AREA // LEVEL_03_CLEARANCE
          </div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            ID: SECURE_DOSSIER_GATE_v1.2
          </span>
        </div>

        {/* Copy */}
        <div className="space-y-4 max-w-md mx-auto mb-10">
          <h3 className="text-3xl font-light tracking-tighter text-white uppercase">
            Data Decryption Required
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            This analytical segment contains high-fidelity behavioral markers, relational matrices, and Shadow Index profiles. Authorization clearance is required to process the raw output.
          </p>
        </div>

        {/* Glowing Button */}
        <button
          onClick={onUnlock}
          className="relative group overflow-hidden bg-red-950/40 hover:bg-red-900/20 text-red-400 hover:text-red-300 font-mono text-xs uppercase tracking-widest font-black py-4 px-12 rounded-full border border-red-900/30 hover:border-red-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          {/* Neon border animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10 flex items-center gap-2">
            <Cpu size={12} className="animate-spin-slow" />
            DECRYPT DOSSIER SEGMENT — $29
          </span>
        </button>

        {/* Footer verification tag */}
        <div className="mt-8 pt-6 border-t border-zinc-900/60 w-full flex items-center justify-center gap-4 text-[7px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>SHA-256 VALIDATED</span>
          <span>•</span>
          <span>COMPLIANCE CERTIFIED</span>
        </div>
      </SpotlightCard>
    </div>
  );
}
