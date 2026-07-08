"use client";

import React, { useRef } from "react";
import { Copy, Share2, Download, ExternalLink } from "lucide-react";
import html2canvas from "html2canvas";

interface ShareableSnippetProps {
  clearanceCode: string;
  summary: string;
  traits: { label: string; value: number }[];
}

export default function ShareableSnippet({ clearanceCode, summary, traits }: ShareableSnippetProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0A0A0A",
    });
    const link = document.createElement("a");
    link.download = `psypher-dossier-${clearanceCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareX = () => {
    const text = `Dossier Decrypted. My psychological shadow has been mapped by Psypher Intelligence.\n\nClearance: ${clearanceCode}\n\n#Psypher #IntelligenceEngine`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const XIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      {/* The Visual Card */}
      <div 
        ref={cardRef}
        className="aspect-[4/5] bg-[#0A0A0A] text-white p-8 relative overflow-hidden flex flex-col justify-between border border-white/10"
        style={{
           backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
           backgroundSize: "20px 20px"
        }}
      >
        {/* Branding */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-[10px] font-mono tracking-[0.4em] uppercase font-black text-white/40">Psypher_Engine</h3>
            <p className="text-[8px] font-mono uppercase text-[#6D28D9] font-black">Shadow_Protocol.v2</p>
          </div>
          <div className="text-[8px] font-mono border border-white/20 px-2 py-1 opacity-40">
            REF: {clearanceCode}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 relative z-10">
          <div className="h-1 w-12 bg-[#6D28D9]" />
          <p className="text-xl font-bold leading-tight tracking-tight uppercase">
            {summary.length > 120 ? summary.substring(0, 117) + "..." : summary}
          </p>
          
          <div className="space-y-3">
             {traits.slice(0, 3).map((t, i) => (
               <div key={i} className="flex justify-between items-center group">
                 <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">{t.label}</span>
                 <div className="flex items-center gap-2">
                    <div className="w-16 h-[2px] bg-white/5 overflow-hidden">
                       <div className="h-full bg-white/40" style={{ width: `${t.value}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-black italic">{t.value}%</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end border-t border-white/5 pt-6">
          <div className="space-y-1">
            <span className="text-[8px] font-mono uppercase tracking-tighter opacity-30">Status</span>
            <p className="text-[10px] font-mono uppercase font-black text-green-500/80">AUTHENTICATED</p>
          </div>
          <img src="/logo.svg" alt="Psypher" className="h-4 w-auto invert opacity-40" />
        </div>

        {/* Decorative scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 py-4 bg-white border border-black/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <Download size={14} />
          Save Card
        </button>
        <button 
          onClick={handleShareX}
          className="flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
        >
          <XIcon />
          Share to X
        </button>
      </div>
    </div>
  );
}
