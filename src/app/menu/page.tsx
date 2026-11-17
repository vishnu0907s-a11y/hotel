"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Wine, Search, ArrowLeft, Filter } from "lucide-react";
import { MenuItem, MenuCategory } from "@/lib/supabase/types";
import { DataService } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export default function FullMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const [cats, items] = await Promise.all([
          DataService.getCategories(),
          DataService.getMenuItems(),
        ]);
        setCategories(cats);
        setMenuItems(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const allTags = Array.from(
    new Set(menuItems.flatMap((item) => item.dietary_tags))
  );

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category_id === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "all" || item.dietary_tags.includes(selectedTag);
    return matchesCat && matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-ivory pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Navigation Back */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold hover:text-gold-light mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Atelier Sanctuary</span>
        </Link>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-sans block mb-3">
            Haute Carte & Seasonal Degustation
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl text-ivory font-light mb-4">
            The Complete <span className="italic text-gold-gradient font-normal">Repertoire</span>
          </h1>
          <p className="font-sans text-sm text-ivory-muted font-light leading-relaxed">
            Curated daily according to dawn harvests and biodynamic lunar calendars. Every dish is finished tableside with our sommelier cellar pairings.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, truffles..."
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-3 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === "all"
                  ? "bg-gold text-black font-semibold"
                  : "bg-white/5 text-ivory/70 hover:bg-white/10"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-gold text-black font-semibold"
                    : "bg-white/5 text-ivory/70 hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Dietary Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-gold" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-[#1e1e1e] border border-white/10 rounded-full px-4 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">All Dietary Preferences</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 text-ivory-muted font-sans text-sm">
            No dishes match your specific search criteria. Please adjust filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((dish) => (
              <div
                key={dish.id}
                className="rounded-2xl overflow-hidden bg-[#141414] border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="relative aspect-[16/10] bg-black">
                  <Image
                    src={dish.image_url}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

                  <div className="absolute top-3 left-3">
                    {dish.is_signature && (
                      <span className="px-3 py-1 rounded-full bg-gold text-black text-[9px] uppercase font-bold tracking-widest">
                        Chef Signature
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold/40">
                    <span className="font-serif-luxury text-base text-gold font-semibold">
                      {formatPrice(dish.price)}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-2xl text-ivory group-hover:text-gold-light transition-colors mb-2">
                      {dish.name}
                    </h3>
                    <p className="font-sans text-xs text-ivory-muted leading-relaxed font-light mb-4">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    {dish.wine_pairing && (
                      <div className="flex items-center space-x-2 text-[11px] text-gold italic font-serif-luxury">
                        <Wine className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{dish.wine_pairing}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {dish.dietary_tags.map((tag) => (
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
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA to Reserve */}
        <div className="mt-20 p-12 rounded-3xl bg-gradient-to-r from-gold/10 via-[#141414] to-gold/10 border border-gold/30 text-center">
          <h3 className="font-serif-luxury text-3xl text-ivory mb-3">
            Experience Chef Vance's Vision in Person
          </h3>
          <p className="font-sans text-xs sm:text-sm text-ivory-muted max-w-xl mx-auto mb-8 font-light">
            Tables for our grand degustation are released thirty days in advance.
          </p>
          <Link
            href="/#reservation"
            className="inline-flex px-8 py-3.5 rounded-full bg-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-xl"
          >
            Reserve Your Experience
          </Link>
        </div>
      </div>
    </div>
  );
}

