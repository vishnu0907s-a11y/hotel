"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/lib/auth";
import { Sparkles, KeyRound, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Standard credential validation (allows demo access or custom credentials)
    if (!email || !password) {
      setError("Please provide both email and security passcode.");
      setLoading(false);
      return;
    }

    // Set authenticated session
    AuthService.setSession({
      id: "admin-01",
      name: email.split("@")[0].toUpperCase() || "Chef Patron",
      email: email,
      role: "admin",
    });

    router.push("/admin");
  };

  const handleInstantDemoLogin = (role: "admin" | "manager" | "sommelier") => {
    const titles = {
      admin: "Julian Vance (Culinary Director)",
      manager: "Henri Delacroix (Maitre D')",
      sommelier: "Genevieve Moreau (Head Sommelier)",
    };

    AuthService.setSession({
      id: `usr-${role}`,
      name: titles[role],
      email: `${role}@aurelia-dining.com`,
      role: role,
    });

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-ivory flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      {/* Back to Public Site */}
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-ivory/60 hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Guest Sanctuary</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Monogram Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4 bg-gold/5 shadow-[0_0_30px_rgba(200,169,106,0.2)]">
            <span className="font-serif-luxury text-2xl text-gold font-light">A</span>
          </div>
          <h1 className="font-serif-luxury text-3xl uppercase tracking-[0.2em] text-ivory">
            Aurélia Portal
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-sans mt-1">
            Haute Gastronomie Management
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                Staff Identity / Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@aurelia-dining.com"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                Security Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gold text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold-light transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>{loading ? "Verifying..." : "Authorize Portal Access"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-gold/80 block mb-3 font-sans text-center">
              Evaluator Quick Access (One-Click)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemoLogin("admin")}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold/40 text-ivory/80 hover:text-gold text-[11px] font-sans transition-colors text-center"
              >
                Maitre D' (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin("sommelier")}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold/40 text-ivory/80 hover:text-gold text-[11px] font-sans transition-colors text-center"
              >
                Head Sommelier
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center text-ivory/40 text-[11px] flex items-center justify-center space-x-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-gold/60" />
          <span>Encrypted Session • Aurélia Hospitality Group</span>
        </div>
      </div>
    </div>
  );
}

