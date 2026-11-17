"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/lib/data/testimonials";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section id="testimonials" className="relative py-28 md:py-36 bg-[#141414] overflow-hidden">
      {/* Subtle Radial Atmosphere */}
      <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
        {/* Header Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-gold font-sans font-medium">
            Section 07 — Critical Acclaim
          </span>
        </div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-ivory font-light mb-16">
          Praise from the <span className="italic text-gold-gradient font-normal">Connoisseurs</span>
        </h2>

        {/* Carousel Content Box */}
        <div className="relative min-h-[340px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center max-w-3xl mx-auto"
            >
              {/* Star Rating */}
              <div className="flex items-center space-x-1.5 text-gold mb-8">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote Mark Icon */}
              <Quote className="w-10 h-10 text-gold/30 mb-6 rotate-180" />

              {/* Quote Text */}
              <p className="font-serif-luxury text-xl sm:text-2xl md:text-3xl text-ivory/95 font-light italic leading-relaxed mb-10">
                “{current.quote}”
              </p>

              {/* Author Info & Avatar */}
              <div className="flex items-center space-x-4">
                {current.avatar_url && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/40">
                    <Image
                      src={current.avatar_url}
                      alt={current.author_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-serif-luxury text-lg text-ivory font-medium">
                    {current.author_name}
                  </h4>
                  <p className="text-xs uppercase tracking-widest text-gold font-sans">
                    {current.author_title} {current.publication ? `• ${current.publication}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-6 mt-12">
            <button
              onClick={prevReview}
              className="w-12 h-12 rounded-full border border-white/10 hover:border-gold text-ivory/70 hover:text-gold flex items-center justify-center transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Indicator dots */}
            <div className="flex items-center space-x-2">
              {TESTIMONIALS_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-12 h-12 rounded-full border border-white/10 hover:border-gold text-ivory/70 hover:text-gold flex items-center justify-center transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

