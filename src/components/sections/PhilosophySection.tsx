"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Compass, Award, Feather } from "lucide-react";

export default function PhilosophySection() {
  const pillars = [
    {
      icon: Compass,
      title: "Radical Terroir",
      desc: "Every vegetable, rare truffle, and cold-water catch is sourced directly from certified biodynamic foragers across Brittany, Alba, and Hokkaido.",
    },
    {
      icon: Feather,
      title: "Silent Precision",
      desc: "Classical French reduction meets avant-garde temperature mastery. Every plate honors centuries of discipline while challenging contemporary boundaries.",
    },
    {
      icon: Award,
      title: "Bespoke Hospitality",
      desc: "Hospitality is treated as a high emotional craft. We curate personal dining tempo, bespoke cellar selections, and individual sensory preferences.",
    },
  ];

  return (
    <section id="philosophy" className="relative py-28 md:py-36 bg-[#0B0B0B] overflow-hidden">
      {/* Decorative Subtle Background Typography */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[12vw] font-serif-luxury font-bold text-white/[0.015] select-none pointer-events-none whitespace-nowrap">
        GASTRONOMIE • ART • ESSENCE
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Pill Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-medium">
            Section 02 — Philosophy & Lineage
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-baseline mb-16 md:mb-24">
          <div className="lg:col-span-8">
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-ivory font-light leading-[1.15]">
              More Than Dining. <br />
              <span className="italic text-gold-gradient font-normal">An Experience.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-sans text-sm md:text-base text-ivory-muted leading-relaxed font-light">
              At Aurélia, every dinner is conceived as a multi-act culinary symphony where ancient artisanal techniques converge with radical minimalism.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Main Primary Image with Floating Frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 group">
              <Image
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=85"
                alt="Culinary precision at Aurélia"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-gold font-sans">
                    Act I: The Element of Fire
                  </p>
                  <p className="font-serif-luxury text-lg text-ivory">
                    Binchotan coals from Kishu oak
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-black/40 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
              </div>
            </div>

            {/* Overlapping Secondary Editorial Card */}
            <div className="hidden sm:block absolute -bottom-10 -right-8 w-64 p-6 rounded-xl glass-panel-gold shadow-2xl border border-gold/30">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-2">
                Purity Standard
              </span>
              <p className="font-serif-luxury text-sm text-ivory/90 leading-snug">
                “Flavour is not added; it is unmasked through patience and temperature.”
              </p>
            </div>
          </motion.div>

          {/* Core Pillars List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 flex flex-col space-y-8"
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 md:p-8 rounded-2xl bg-[#141414]/70 border border-white/5 hover:border-gold/30 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-colors duration-300">
                      <Icon className="w-4 h-4 text-gold group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gold/60 font-mono">
                        0{idx + 1}
                      </span>
                      <h3 className="font-serif-luxury text-xl text-ivory group-hover:text-gold-light transition-colors">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-ivory-muted leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

