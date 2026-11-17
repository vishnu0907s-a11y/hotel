"use client";

import { useState } from "react";
import Link from "next/link";
import { RESTAURANT_CONFIG } from "@/lib/data/restaurant";
import { DataService } from "@/lib/storage";
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await DataService.subscribeNewsletter(email.trim());
      setSubscribed(true);
      setEmail("");
    } catch {
      setError("Unable to subscribe at this moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-[#080808] text-ivory border-t border-white/10 pt-20 pb-12 overflow-hidden">
      {/* Background Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Top Newsletter & Brand Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Identity Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold transition-colors">
                <span className="font-serif-luxury text-2xl text-gold font-light">A</span>
              </div>
              <div>
                <span className="font-serif-luxury text-2xl tracking-[0.25em] uppercase text-ivory block font-semibold group-hover:text-gold-light transition-colors">
                  {RESTAURANT_CONFIG.name}
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-gold/80 block font-sans">
                  Three Stars Michelin • NYC
                </span>
              </div>
            </Link>

            <p className="font-sans text-xs sm:text-sm text-ivory-muted leading-relaxed font-light max-w-sm">
              An internationally celebrated culinary sanctuary dedicated to elemental ingredient purity, antique vintages, and high hospitality art.
            </p>

            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-2">
                Dress Code
              </span>
              <p className="text-xs text-ivory/60 leading-relaxed max-w-sm">
                {RESTAURANT_CONFIG.dressCode}
              </p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-gold text-xs uppercase tracking-widest font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Gazette Privée</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-ivory font-light mb-3">
                Receive Seasonal Tasting Previews & Rare Cellar Releases
              </h3>
              <p className="font-sans text-xs sm:text-sm text-ivory-muted mb-6 font-light">
                Subscribe for private invitations to seasonal menu launches and quarterly sommelier tastings.
              </p>

              {subscribed ? (
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Your subscription is confirmed. Welcome to the Aurélia private register.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your confidential email..."
                      className="w-full bg-[#141414] border border-white/15 rounded-full px-6 py-3.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-full bg-gold text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold-light transition-all shrink-0 flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? "Registering..." : "Subscribe"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
              {error && <p className="text-[11px] text-red-400 mt-2">{error}</p>}
            </div>

            {/* Social Links */}
            <div className="pt-8 flex items-center space-x-6 text-xs uppercase tracking-widest text-ivory/50 font-sans">
              <span>Follow Our Atelier:</span>
              {RESTAURANT_CONFIG.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Copyright */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/40 font-sans gap-6">
          <p>© {new Date().getFullYear()} Aurélia Haute Gastronomie. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <a href="#philosophy" className="hover:text-gold transition-colors">
              Philosophy
            </a>
            <a href="#menu" className="hover:text-gold transition-colors">
              Haute Carte
            </a>
            <a href="#reservation" className="hover:text-gold transition-colors">
              Reservations
            </a>
            <Link href="/admin" className="hover:text-gold transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

