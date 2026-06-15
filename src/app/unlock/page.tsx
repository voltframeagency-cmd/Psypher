"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Command, Loader2, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PSYPHER UNLOCK: TERMINAL ACCESS PORTAL
 * Dual-Mode entry for Clearance Codes and Stripe IDs.
 * Stockholm Minimalist (Clinical/High-Status Logic).
 */
function UnlockPortalContent() {
  const [inputCode, setInputCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Auto-fill from localStorage on load
  useEffect(() => {
    const savedCode = localStorage.getItem("psypher_clearance_code");
    if (savedCode && !inputCode) {
      setInputCode(savedCode);
    }

    // Handle session_id from checkout redirect (if redirect logic set it)
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // In production, we'd fetch the session details to get the intent ID
      // For now, we'll wait for the user to enter their receipt ID or code.
    }
  }, [searchParams]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: inputCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Clearance Denied.");
        return;
      }

      // Success Logic
      setStatus("success");
      // Persist the code for "Invisible Discovery"
      if (data.clearanceCode) {
        localStorage.setItem("psypher_clearance_code", data.clearanceCode);
      }

      setTimeout(() => {
        router.push(data.url);
      }, 1500);

    } catch (err) {
      setStatus("error");
      setMessage("System Failure. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] flex flex-col items-center justify-center p-6 relative">
      {/* Precision Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(0,0,0,1) 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
      
      <div className="w-full max-w-sm space-y-12 relative z-10">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-black/5">
            <Lock className="w-6 h-6 text-[#6D28D9]" />
          </div>
          
          <h1 className="text-[10px] tracking-[0.6em] font-black uppercase text-[#6D28D9] mb-4">
            Intelligence_Vault
          </h1>
          
          <p className="text-3xl font-black tracking-tight text-balance leading-none mb-2">
            Enter Clearance Key
          </p>
          
          <p className="text-[10px] text-black/40 font-mono tracking-tight leading-relaxed max-w-[280px] mx-auto uppercase py-2 border-y border-black/5">
            MODE: [ CLEARANCE CODE ] || [ STRIPE RECEIPT ] <br />
            STATUS: SECURE ENCRYPTED ACCESS
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="VRTX-88 OR pi_..."
              required
              className="w-full h-16 bg-black/[0.02] border-b-2 border-black/10 px-6 font-mono text-sm placeholder:text-black/10 focus:outline-none focus:border-[#6D28D9] transition-all group-hover:bg-black/[0.04] text-center tracking-[0.2em]"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-6">
              <Command className="w-4 h-4 text-black/10 group-focus-within:text-[#6D28D9] transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={cn(
              "w-full h-16 flex items-center justify-center gap-4 transition-all duration-500 rounded-full text-[10px] tracking-[0.3em] font-black uppercase",
              status === "success" 
                ? "bg-[#6D28D9] text-white" 
                : "bg-[#0A0A0A] text-white hover:bg-[#6D28D9] shadow-xl hover:shadow-[#6D28D9]/20"
            )}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                VERIFYING_ACCESS...
              </>
            ) : status === "success" ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                CLEARANCE_GRANTED
              </>
            ) : (
              <>
                INITIATE_DECRYPTION
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status === "error" && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-1">
            <p className="text-[10px] font-mono text-red-500 text-center uppercase tracking-widest font-black">
              {message}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center px-4">
          <div className="text-[8px] tracking-[0.2em] text-black/20 uppercase font-mono">
            ENC: AES-256-GCM
          </div>
          <div className="text-[8px] tracking-[0.2em] text-black/20 uppercase font-mono">
            V-REF: {Math.floor(1000 + Math.random() * 9000)}-ALPHA
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[8px] tracking-[0.4em] text-black/10 uppercase font-mono">
        Psypher Intelligence Protocol // V1.4.0
      </div>
    </main>
  );
}
export default function UnlockPortal() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] flex flex-col items-center justify-center p-6 relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(0,0,0,1) 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
        <Loader2 className="w-6 h-6 text-[#6D28D9] animate-spin" />
      </main>
    }>
      <UnlockPortalContent />
    </Suspense>
  );
}
