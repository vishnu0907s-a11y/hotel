"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import AmbientCanvas from "@/components/3d/AmbientCanvas";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0B]"
    >
      {/* 3D WebGL Golden Particle Canvas */}
      <AmbientCanvas />

      {/* Cinematic Background Photography with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 scale-105"
      >
        <Image
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2400&q=90"
          alt="Artisanal Fine Dining Gastronomy at Aurélia"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.42] contrast-[1.15]"
        />
        {/* Layered Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pt-24 md:pt-20"
      >
        {/* Sub-badge / Heritage Accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-gold font-sans font-medium">
            Michelin Three Stars • 2026
          </span>
        </motion.div>

        {/* Editorial Headline with Staggered Motion */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ivory font-light leading-[1.08] mb-6 max-w-4xl"
        >
          An Artful Expression <br className="hidden sm:inline" />
          <span className="italic font-normal text-gold-gradient">of Taste.</span>
        </motion.h1>

        {/* Editorial Supporting Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
          className="font-sans text-sm md:text-lg text-ivory-muted max-w-2xl font-light leading-relaxed mb-10 tracking-wide"
        >
          Where exceptional ingredients, culinary craftsmanship, and unforgettable experiences come together.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <a
            href="#reservation"
            data-cursor-text="Book"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold-light hover:shadow-[0_0_35px_rgba(200,169,106,0.5)] transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <span>Reserve a Table</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#menu"
            data-cursor-text="View"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-ivory/20 bg-black/40 backdrop-blur-md text-ivory font-sans text-xs uppercase tracking-[0.22em] font-medium hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center"
          >
            <span>Explore Our Menu</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Elegant Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-ivory/50 font-sans mb-2">
          Scroll to Discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-gold/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}

