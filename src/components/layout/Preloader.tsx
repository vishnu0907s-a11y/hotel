"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        const diff = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + diff, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0B0B0B] text-ivory select-none"
        >
          {/* Subtle background radial glow */}
          <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Restaurant Brand Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-16 h-16 mx-auto rounded-full border border-gold/40 flex items-center justify-center relative">
                <div className="absolute inset-1 rounded-full border border-gold/20" />
                <span className="font-serif-luxury text-2xl tracking-widest text-gold font-light">A</span>
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-serif-luxury text-2xl md:text-3xl tracking-[0.3em] uppercase text-ivory mb-2"
            >
              AURÉLIA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[10px] tracking-[0.35em] uppercase text-gold mb-8"
            >
              Haute Gastronomie • Three Stars
            </motion.p>

            {/* Progress line */}
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mb-4">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/50 via-gold to-gold-light"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            {/* Progress counter */}
            <div className="font-mono text-xs tracking-widest text-ivory/60">
              {progress.toString().padStart(3, "0")} %
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

