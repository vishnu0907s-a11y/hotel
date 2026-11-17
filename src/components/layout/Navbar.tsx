"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Menu as MenuIcon, X, Calendar, Phone, ArrowUpRight } from "lucide-react";
import { RESTAURANT_CONFIG } from "@/lib/data/restaurant";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Philosophy", href: "#philosophy" },
    { name: "Signature Menu", href: "#menu" },
    { name: "The Chef", href: "#chef" },
    { name: "Experience", href: "#experience" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Location", href: "#location" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0B0B0B]/85 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl"
            : "bg-transparent py-6 md:py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <Link href="/" className="group flex items-center space-x-3 text-ivory">
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:border-gold">
              <span className="font-serif-luxury text-xl text-gold font-light">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl md:text-2xl tracking-[0.25em] uppercase font-semibold text-ivory group-hover:text-gold-light transition-colors">
                {RESTAURANT_CONFIG.name}
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-gold/80 -mt-1 font-sans">
                Haute Gastronomie
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-sans">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-ivory/75 hover:text-gold transition-colors duration-300 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs: Audio + Reserve Button */}
          <div className="hidden sm:flex items-center space-x-5">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              className="p-2 text-ivory/60 hover:text-gold border border-white/10 hover:border-gold/40 rounded-full transition-all duration-300 relative group"
              title={isAudioPlaying ? "Mute Lounge Atmosphere" : "Play Ambient Atmosphere"}
              aria-label="Toggle ambient atmosphere"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-gold animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Admin Link (Discrete & Elegant) */}
            <Link
              href="/admin"
              className="text-[11px] uppercase tracking-widest text-ivory/40 hover:text-ivory/80 transition-colors"
            >
              Portal
            </Link>

            {/* Primary Reserve CTA */}
            <a
              href="#reservation"
              data-cursor-text="Reserve"
              className="relative inline-flex items-center space-x-2 px-6 py-2.5 rounded-full border border-gold/60 bg-gold/10 hover:bg-gold hover:text-black transition-all duration-500 text-xs uppercase tracking-[0.2em] font-sans font-medium text-gold hover:shadow-[0_0_25px_rgba(200,169,106,0.4)]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve a Table</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <a
              href="#reservation"
              className="px-3.5 py-1.5 rounded-full border border-gold/60 bg-gold/10 text-gold text-[10px] tracking-widest uppercase font-medium"
            >
              Reserve
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory border border-white/10 rounded-full hover:border-gold/40"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gold" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0B0B0B]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 lg:hidden"
          >
            <div className="flex flex-col space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold/70">Navigation</span>
              <nav className="flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif-luxury text-3xl text-ivory hover:text-gold transition-colors flex items-center justify-between border-b border-white/5 pb-3"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-gold/40" />
                  </a>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif-luxury text-2xl text-ivory/60 hover:text-gold transition-colors flex items-center justify-between pt-2"
                >
                  <span>Admin & Operations Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-gold/40" />
                </Link>
              </nav>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col space-y-4">
              <a
                href={`tel:${RESTAURANT_CONFIG.phone}`}
                className="flex items-center space-x-3 text-xs tracking-wider text-ivory/70 hover:text-gold"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>{RESTAURANT_CONFIG.phone}</span>
              </a>
              <p className="text-xs text-ivory/50">
                {RESTAURANT_CONFIG.address.street}, {RESTAURANT_CONFIG.address.city}
              </p>
              <a
                href="#reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 text-center bg-gold text-black font-sans uppercase tracking-[0.2em] text-xs font-semibold rounded-full shadow-lg"
              >
                Reserve Your Experience
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

