"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * PSYPHER RESTORE: RECOVERY INTERFACE
 * 
 * Purpose: Allows users to recover their dossier without an account.
 * Stockholm Minimalist UI (Laboratory Aesthetics).
 */

export default function RestorePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus('success');
      setMessage(data.message);

      // MOCK AUTO-REDIRECT FOR DEVELOPMENT
      if (data.debugUrl) {
        setTimeout(() => {
          router.push(data.debugUrl);
        }, 2000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] flex flex-col items-center justify-center p-6 relative">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(0,0,0,1) 0.5px, transparent 0.5px)", backgroundSize: "40px 40px" }} />
      
      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-6 h-6 text-[#6D28D9]" />
          </div>
          <h1 className="text-[12px] tracking-[0.8em] font-black uppercase text-[#6D28D9]">
            Dossier_Restoration
          </h1>
          <p className="text-3xl font-bold tracking-tight text-balance">
            Recover Your Intelligence Report
          </p>
          <p className="text-sm text-black/40 font-mono tracking-tight leading-relaxed max-w-[280px] mx-auto">
            SYSTEM_ID: PS-RECOVERY-884 <br />
            Enter the email associated with your Stripe receipt.
          </p>
        </div>

        <form onSubmit={handleRestore} className="space-y-6">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@intelligence.ai"
              required
              className="w-full h-16 bg-black/[0.02] border-b border-black/10 px-6 font-mono text-sm placeholder:text-black/20 focus:outline-none focus:border-[#6D28D9] transition-all group-hover:bg-black/[0.04]"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-6">
              <Search className="w-4 h-4 text-black/20 group-focus-within:text-[#6D28D9] transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-16 bg-[#0A0A0A] text-[#FDFDFD] text-[10px] tracking-[0.4em] font-black uppercase flex items-center justify-center gap-4 hover:bg-[#6D28D9] transition-all disabled:bg-black/20"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing_Search
              </>
            ) : (
              <>
                Restore_Dossier
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status === 'success' && (
          <div className="p-6 bg-[#6D28D9]/5 border border-[#6D28D9]/10 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-xs font-mono text-[#6D28D9] font-bold text-center leading-relaxed">
              {message}
            </p>
            <p className="text-[9px] text-black/30 font-mono text-center uppercase tracking-widest pt-2">
              Redirecting...
            </p>
          </div>
        )}

        {status === 'error' && (
          <p className="text-[10px] font-mono text-red-500 text-center uppercase tracking-widest font-bold">
            {message}
          </p>
        )}
      </div>

      <div className="absolute bottom-12 text-[8px] tracking-[0.4em] text-black/10 uppercase font-mono">
        Psypher Intelligence Protocol // V1.2.4
      </div>
    </main>
  );
}
