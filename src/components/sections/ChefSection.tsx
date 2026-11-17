"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RESTAURANT_CONFIG } from "@/lib/data/restaurant";
import { Sparkles, Award } from "lucide-react";

export default function ChefSection() {
  const { chef } = RESTAURANT_CONFIG;

  return (
    <section id="chef" className="relative py-28 md:py-36 bg-[#0B0B0B] overflow-hidden">
      {/* Editorial Decorative Background Texture */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-medium">
            Section 04 — The Culinary Atelier
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Chef Image with Dual-Layer Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl group">
              <Image
                src={chef.image}
                alt={chef.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-[1.1] hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              {/* Chef Accolade Bottom Banner */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel-gold border border-gold/40">
                <div className="flex items-center space-x-2 text-gold text-xs mb-1 font-mono">
                  <Award className="w-4 h-4" />
                  <span className="uppercase tracking-widest text-[10px]">Recognized Master</span>
                </div>
                <p className="font-serif-luxury text-sm text-ivory">
                  {chef.accolades}
                </p>
              </div>
            </div>

            {/* Subtle Offset Golden Border Behind */}
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border border-gold/20 -z-10 hidden sm:block" />
          </motion.div>

          {/* Story & Biography Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-semibold">
                Culinary Director & Visionary
              </span>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-ivory font-light mt-1">
                {chef.name}
              </h2>
              <p className="text-xs uppercase tracking-widest text-ivory/50 mt-1 font-sans">
                {chef.role}
              </p>
            </div>

            {/* Signature Quote in Large Editorial Serif */}
            <blockquote className="my-8 pl-6 border-l-2 border-gold/60">
              <p className="font-serif-luxury text-xl sm:text-2xl md:text-3xl text-ivory/95 italic font-light leading-snug">
                “{chef.signatureQuote}”
              </p>
            </blockquote>

            {/* Biography Paragraphs */}
            <div className="space-y-4 font-sans text-sm md:text-base text-ivory-muted font-light leading-relaxed mb-8">
              <p>{chef.bio}</p>
              <p>
                Each creation at Aurélia is anchored in four elemental pillars: pristine cold-water marine harvests, wild alpine flora, thirty-year cellar reductions, and the theatrical discipline of Japanese binchotan fire.
              </p>
            </div>

            {/* Metrics & Signature Reveal */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 items-center">
              <div>
                <span className="font-serif-luxury text-3xl sm:text-4xl text-gold font-light block">
                  30+
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ivory/50 font-sans">
                  Years of Lineage
                </span>
              </div>
              <div>
                <span className="font-serif-luxury text-3xl sm:text-4xl text-gold font-light block">
                  3★
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ivory/50 font-sans">
                  Michelin Stars
                </span>
              </div>
              <div>
                <span className="font-serif-luxury text-3xl sm:text-4xl text-gold font-light block">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ivory/50 font-sans">
                  Biodynamic Terroir
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

