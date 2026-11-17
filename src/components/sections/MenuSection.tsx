"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wine, Flame, ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { MenuItem, MenuCategory } from "@/lib/supabase/types";
import { DataService } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export default function MenuSection() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const [cats, items] = await Promise.all([
          DataService.getCategories(),
          DataService.getMenuItems(),
        ]);
        setCategories(cats);
        setMenuItems(items);
      } catch (err) {
        console.error("Failed to load menu data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  const filteredItems = selectedCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category_id === selectedCategory);

  return (
    <section id="menu" className="relative py-28 md:py-36 bg-[#141414] overflow-hidden">
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-[1px] bg-gold" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-medium">
                Section 03 — Haute Carte
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-ivory font-light leading-tight">
              Signature <span className="italic text-gold-gradient font-normal">Collection</span>
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/menu"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-gold hover:text-gold-light border-b border-gold/40 hover:border-gold pb-1 transition-all"
            >
              <span>View Comprehensive Tasting Menu</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category Filters Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-12 border-b border-white/10">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300 whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-gold text-[#0B0B0B] font-semibold shadow-[0_0_20px_rgba(200,169,106,0.3)]"
                : "text-ivory/60 hover:text-ivory bg-white/5 hover:bg-white/10"
            }`}
          >
            All Creations ({menuItems.length})
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-gold text-[#0B0B0B] font-semibold shadow-[0_0_20px_rgba(200,169,106,0.3)]"
                    : "text-ivory/60 hover:text-ivory bg-white/5 hover:bg-white/10"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Dish Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedDish(dish)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-[#181818] border border-white/5 hover:border-gold/40 transition-all duration-500 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8)] flex flex-col justify-between"
                >
                  {/* Dish Image Box with Hover Zoom */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-black/40">
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.88] group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {dish.is_signature ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/90 text-[#0B0B0B] text-[10px] uppercase font-sans font-bold tracking-widest backdrop-blur-md">
                          <Sparkles className="w-3 h-3" />
                          <span>Signature</span>
                        </span>
                      ) : (
                        <span />
                      )}

                      <span
                        className={`text-[10px] uppercase font-sans px-2.5 py-1 rounded-full tracking-wider backdrop-blur-md ${
                          dish.is_available
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-950/80 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {dish.is_available ? "In Season" : "Sold Out"}
                      </span>
                    </div>

                    {/* Bottom Floating Price Tag */}
                    <div className="absolute bottom-4 right-4 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold/30">
                      <span className="font-serif-luxury text-base text-gold font-semibold">
                        {formatPrice(dish.price)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-xl sm:text-2xl text-ivory group-hover:text-gold-light transition-colors duration-300 mb-2 line-clamp-1">
                        {dish.name}
                      </h3>
                      <p className="font-sans text-xs text-ivory-muted line-clamp-2 leading-relaxed mb-4 font-light">
                        {dish.description}
                      </p>
                    </div>

                    {/* Wine Pairing & Dietary Tags */}
                    <div className="pt-4 border-t border-white/5 flex flex-col space-y-2">
                      {dish.wine_pairing && (
                        <div className="flex items-center space-x-2 text-[11px] text-gold/80 italic font-serif-luxury line-clamp-1">
                          <Wine className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>Pairing: {dish.wine_pairing}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dish.dietary_tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] uppercase tracking-wider text-ivory/50 bg-white/5 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Dish Detailed Modal */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl rounded-2xl bg-[#141414] border border-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-ivory hover:text-gold flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[16/9] w-full shrink-0">
                <Image
                  src={selectedDish.image_url}
                  alt={selectedDish.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans font-medium">
                    {selectedDish.category_name || "Haute Carte"}
                  </span>
                  <span className="font-serif-luxury text-2xl text-gold font-semibold">
                    {formatPrice(selectedDish.price)}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-ivory mb-4">
                  {selectedDish.name}
                </h3>

                <p className="font-sans text-sm text-ivory-muted leading-relaxed mb-6 font-light">
                  {selectedDish.description}
                </p>

                {/* Sommelier & Dietary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/5 mb-6 text-xs">
                  <div>
                    <span className="text-gold uppercase tracking-wider block mb-1 font-mono text-[10px]">
                      Sommelier Pairing
                    </span>
                    <p className="font-serif-luxury text-sm text-ivory italic">
                      {selectedDish.wine_pairing || "Ask sommelier for private cellar pairing"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gold uppercase tracking-wider block mb-1 font-mono text-[10px]">
                      Terroir & Dietary
                    </span>
                    <p className="font-sans text-xs text-ivory/80">
                      {selectedDish.dietary_tags.join(" • ") || "Artisanal preparation"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedDish(null)}
                    className="px-6 py-2.5 rounded-full border border-white/20 text-xs uppercase tracking-widest text-ivory/80 hover:text-ivory hover:border-white/50 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href="#reservation"
                    onClick={() => setSelectedDish(null)}
                    className="px-6 py-2.5 rounded-full bg-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-colors"
                  >
                    Reserve Table For This Experience
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

