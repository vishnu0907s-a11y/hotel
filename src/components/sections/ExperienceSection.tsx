"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Wine, Users, Music } from "lucide-react";

interface AtmosphereItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  features: string[];
}

const EXPERIENCES: AtmosphereItem[] = [
  {
    id: "exp-01",
    title: "The Main Dining Salon",
    subtitle: "Architectural Grandeur & Intimate Lighting",
    description: "Designed with hand-carved ebonized oak, raw brushed brass, and acoustic felt baffles that absorb extraneous noise, creating an atmosphere of whispering serenity.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85",
    tag: "Main Room",
    features: ["Acoustic intimacy", "Hand-blown Murano pendants", "Spacious 2.5m table spacing"],
  },
  {
    id: "exp-02",
    title: "The Sommelier's Vault",
    subtitle: "4,000 Rare Vintages & Subterranean Tastings",
    description: "A temperature-controlled subterranean sanctuary holding rare Burgundy, Bordeaux first growths, and biodynamic biodivergent bottles dating to 1898.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=85",
    tag: "Wine Cellar",
    features: ["Head Sommelier consultation", "Vintage vertical pairings", "Bespoke temperature glass"],
  },
  {
    id: "exp-03",
    title: "The Private Salon d'Or",
    subtitle: "Discreet Galas & Executive Conclaves",
    description: "An exclusive private dining haven with dedicated butler service, private kitchen access, custom floral arrangements, and personalized menu calligraphy.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85",
    tag: "Private Dining",
    features: ["Private security entrance", "Up to 14 guests", "Dedicated private chef team"],
  },
  {
    id: "exp-04",
    title: "The Chef's Counter",
    subtitle: "Front-Row Theatrical Gastronomy",
    description: "An eight-seat live counter directly overlooking the binchotan embers and plating stations. Guests witness each course orchestrated in real time.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85",
    tag: "Culinary Stage",
    features: ["Interactive chef dialogue", "Exclusive 12-course preview", "Direct plating view"],
  },
];

export default function ExperienceSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section id="experience" className="relative py-28 md:py-36 bg-[#141414] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-[1px] bg-gold" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-medium">
                Section 05 — Space & Atmosphere
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-ivory font-light leading-tight">
              The Dining <span className="italic text-gold-gradient font-normal">Atmosphere</span>
            </h2>
          </div>

          {/* Navigation Scroll Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "border-gold text-gold hover:bg-gold hover:text-black"
                  : "border-white/10 text-white/20 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight
                  ? "border-gold text-gold hover:bg-gold hover:text-black"
                  : "border-white/10 text-white/20 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Smooth Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-8 overflow-x-auto no-scrollbar px-6 md:px-12 pb-6 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
      >
        {EXPERIENCES.map((exp, idx) => (
          <div
            key={exp.id}
            className="flex-shrink-0 w-[85vw] sm:w-[540px] md:w-[620px] snap-center rounded-2xl overflow-hidden bg-[#181818] border border-white/10 hover:border-gold/40 transition-all duration-500 flex flex-col group shadow-2xl"
          >
            {/* Image Frame */}
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                sizes="(max-width: 768px) 85vw, 620px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />

              {/* Tag Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-sans font-semibold bg-black/70 backdrop-blur-md text-gold border border-gold/30">
                  {exp.tag}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-8 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50 font-sans block mb-1">
                  Ambience 0{idx + 1}
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-ivory group-hover:text-gold-light transition-colors mb-2">
                  {exp.title}
                </h3>
                <p className="font-serif-luxury text-sm text-gold italic mb-4">
                  {exp.subtitle}
                </p>
                <p className="font-sans text-xs sm:text-sm text-ivory-muted leading-relaxed font-light mb-6">
                  {exp.description}
                </p>
              </div>

              {/* Key Features List */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                {exp.features.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center space-x-1.5 text-[11px] font-sans text-ivory/70 bg-white/5 px-3 py-1 rounded-full border border-white/5"
                  >
                    <Sparkles className="w-3 h-3 text-gold/60" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

