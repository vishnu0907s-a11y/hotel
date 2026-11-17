"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Wine,
  CheckCircle2,
  XCircle,
  X,
  Search,
  Check,
  AlertTriangle,
} from "lucide-react";
import { DataService } from "@/lib/storage";
import { MenuItem, MenuCategory } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/utils";

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formImage, setFormImage] = useState("");
  const [formAvailable, setFormAvailable] = useState(true);
  const [formSignature, setFormSignature] = useState(false);
  const [formWine, setFormWine] = useState("");
  const [formTags, setFormTags] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, items] = await Promise.all([
        DataService.getCategories(),
        DataService.getMenuItems(),
      ]);
      setCategories(cats);
      setMenuItems(items);
      if (cats.length > 0 && !formCategory) {
        setFormCategory(cats[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingDish(null);
    setFormName("");
    setFormCategory(categories[0]?.id || "cat-mains");
    setFormDescription("");
    setFormPrice(95);
    setFormImage("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85");
    setFormAvailable(true);
    setFormSignature(false);
    setFormWine("");
    setFormTags("Gluten-Free, Seasonal");
    setModalOpen(true);
  };

  const openEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category_id);
    setFormDescription(dish.description);
    setFormPrice(dish.price);
    setFormImage(dish.image_url);
    setFormAvailable(dish.is_available);
    setFormSignature(dish.is_signature);
    setFormWine(dish.wine_pairing || "");
    setFormTags(dish.dietary_tags.join(", "));
    setModalOpen(true);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDescription || formPrice <= 0) return;

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const targetCategory = categories.find((c) => c.id === formCategory);

    if (editingDish) {
      // Update existing
      await DataService.updateMenuItem(editingDish.id, {
        name: formName,
        category_id: formCategory,
        category_name: targetCategory?.name || "General",
        description: formDescription,
        price: formPrice,
        image_url: formImage,
        is_available: formAvailable,
        is_signature: formSignature,
        wine_pairing: formWine || null,
        dietary_tags: tagsArray,
      });
    } else {
      // Create new
      await DataService.addMenuItem({
        category_id: formCategory,
        category_name: targetCategory?.name || "General",
        name: formName,
        description: formDescription,
        price: formPrice,
        image_url: formImage,
        is_available: formAvailable,
        is_signature: formSignature,
        wine_pairing: formWine || null,
        dietary_tags: tagsArray,
        calories: 450,
      });
    }

    setModalOpen(false);
    await loadData();
  };

  const handleDeleteDish = async (id: string) => {
    if (confirm("Are you sure you wish to retire this dish from the active Haute Carte?")) {
      await DataService.deleteMenuItem(id);
      await loadData();
    }
  };

  const toggleAvailability = async (dish: MenuItem) => {
    await DataService.updateMenuItem(dish.id, {
      is_available: !dish.is_available,
    });
    await loadData();
  };

  const filtered = menuItems.filter((dish) => {
    const matchesCategory = selectedCategory === "all" || dish.category_id === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-semibold">
            Haute Carte & Cellar Management
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light mt-1">
            Culinary Repertoire
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Craft New Dish</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creations or ingredients..."
            className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-2.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none"
          />
          <Search className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-gold text-black font-semibold"
                : "bg-white/5 text-ivory/70 hover:bg-white/10"
            }`}
          >
            All Courses
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? "bg-gold text-black font-semibold"
                  : "bg-white/5 text-ivory/70 hover:bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dish List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ivory/50 text-xs">
            No dishes found matching your query.
          </div>
        ) : (
          filtered.map((dish) => (
            <div
              key={dish.id}
              className="rounded-2xl overflow-hidden bg-[#141414] border border-white/10 hover:border-gold/30 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-black">
                <Image
                  src={dish.image_url}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  {dish.is_signature && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gold text-black text-[9px] uppercase font-bold tracking-widest">
                      Signature
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleAvailability(dish)}
                    className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider backdrop-blur-md border ${
                      dish.is_available
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                        : "bg-red-950/80 text-red-300 border-red-500/40"
                    }`}
                  >
                    {dish.is_available ? "In Season" : "Unavailable"}
                  </button>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-gold/40">
                  <span className="font-serif-luxury text-sm text-gold font-semibold">
                    {formatPrice(dish.price)}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl text-ivory mb-1">
                    {dish.name}
                  </h3>
                  <p className="font-sans text-xs text-ivory/60 line-clamp-2 leading-relaxed mb-4">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-gold/80 font-mono">
                    {dish.category_name || "Haute Carte"}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(dish)}
                      className="p-2 text-ivory/60 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit Creation"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="p-2 text-ivory/60 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                      title="Retire Dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dish Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#141414] border border-gold/40 rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-ivory/60 hover:text-gold rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-ivory mb-6">
              {editingDish ? "Refine Haute Carte Dish" : "Introduce New Culinary Creation"}
            </h2>

            <form onSubmit={handleSaveDish} className="space-y-6 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                    Dish Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Hokkaido Diver Scallop Crudo"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                    Course Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                  Culinary Description & Provenance
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail ingredients, reductions, and terroir..."
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-ivory focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                    Photography URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                    Sommelier Wine Pairing
                  </label>
                  <input
                    type="text"
                    value={formWine}
                    onChange={(e) => setFormWine(e.target.value)}
                    placeholder="e.g. Corton-Charlemagne Grand Cru 2019"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                    Dietary Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Gluten-Free, Pescatarian, Biodynamic"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-8 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                    className="rounded bg-[#1e1e1e] border-white/20 text-gold focus:ring-gold"
                  />
                  <span>Currently Available / In Season</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSignature}
                    onChange={(e) => setFormSignature(e.target.checked)}
                    className="rounded bg-[#1e1e1e] border-white/20 text-gold focus:ring-gold"
                  />
                  <span>Chef Julian Vance Signature Dish</span>
                </label>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-full border border-white/20 text-ivory/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-gold text-black font-semibold hover:bg-gold-light transition-all shadow-lg"
                >
                  {editingDish ? "Save Refinements" : "Add to Haute Carte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

