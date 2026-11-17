import { createClient, isSupabaseConfigured } from "./supabase/client";
import { MenuItem, MenuCategory, Reservation, ReservationStatus, Testimonial } from "./supabase/types";
import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from "./data/menu";
import { TESTIMONIALS_DATA } from "./data/testimonials";
import { generateBookingReference } from "./utils";
import { ReservationFormValues } from "./validations/reservation";

// Safe wrapper for Supabase client to prevent strict generic mismatch in builds
function getSupabase(): any {
  return createClient();
}

// Local storage key constants for seamless client persistence fallback
const STORAGE_KEYS = {
  MENU_ITEMS: "aurelia_menu_items",
  RESERVATIONS: "aurelia_reservations",
  NEWSLETTER: "aurelia_newsletter",
  SETTINGS: "aurelia_settings",
};

// Initial demo reservations so admin dashboard has rich, realistic operational data
const SEED_RESERVATIONS: Reservation[] = [
  {
    id: "res-01",
    reference_code: "AUR-2026-X8K2",
    customer_name: "Eleanor Roosevelt-Vane",
    customer_email: "eleanor.vane@chambers.co.uk",
    customer_phone: "+1 917 555 0192",
    reservation_date: new Date().toISOString().split("T")[0],
    reservation_time: "19:30",
    guest_count: 2,
    seating_preference: "chef-counter",
    special_requests: "Anniversary celebration. Husband has a mild hazelnut allergy.",
    status: "confirmed",
    admin_notes: "VIP table. Complimentary vintage Krug pairing poured by head sommelier.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "res-02",
    reference_code: "AUR-2026-M4P9",
    customer_name: "Arthur Pendelton III",
    customer_email: "arthur@pendelton-holdings.com",
    customer_phone: "+1 646 555 8310",
    reservation_date: new Date().toISOString().split("T")[0],
    reservation_time: "20:00",
    guest_count: 4,
    seating_preference: "private-salon",
    special_requests: "Private business closing dinner. Requesting discrete service.",
    status: "confirmed",
    admin_notes: "Cellar tour pre-arranged for 19:45.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "res-03",
    reference_code: "AUR-2026-T9B5",
    customer_name: "Dr. Evelyn Chen",
    customer_email: "evelyn.chen@biogenics.org",
    customer_phone: "+1 212 555 4489",
    reservation_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    reservation_time: "18:00",
    guest_count: 2,
    seating_preference: "main-dining",
    special_requests: "Pescatarian menu for both guests.",
    status: "pending",
    admin_notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "res-04",
    reference_code: "AUR-2026-L2Q7",
    customer_name: "Massimo Botticelli",
    customer_email: "massimo@atelier-firenze.it",
    customer_phone: "+39 055 234 5678",
    reservation_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    reservation_time: "20:30",
    guest_count: 6,
    seating_preference: "terrace",
    special_requests: "Visiting from Florence. Delighted to taste Chef Vance's cuisine.",
    status: "pending",
    admin_notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to get from window.localStorage safely (SSR safe)
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

export type MenuItemInput = {
  name: string;
  description: string;
  price: number;
  category_id: string;
  category_name?: string;
  image_url: string;
  is_available?: boolean;
  is_signature?: boolean;
  dietary_tags?: string[];
  wine_pairing?: string | null;
  calories?: number | null;
};

export const DataService = {
  // ================= MENU =================
  async getCategories(): Promise<MenuCategory[]> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("menu_categories")
          .select("*")
          .order("display_order", { ascending: true });
        if (!error && data && data.length > 0) return data;
      }
    }
    return MENU_CATEGORIES;
  },

  async getMenuItems(): Promise<MenuItem[]> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*, menu_categories(name)")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            ...item,
            category_name: item.menu_categories?.name || "General",
          }));
        }
      }
    }

    return getLocalItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
  },

  async addMenuItem(item: MenuItemInput): Promise<MenuItem> {
    const newItem: MenuItem = {
      id: `dish-${Date.now()}`,
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      category_name: item.category_name || "General",
      image_url: item.image_url,
      is_available: item.is_available ?? true,
      is_signature: item.is_signature ?? false,
      dietary_tags: item.dietary_tags ?? [],
      wine_pairing: item.wine_pairing ?? null,
      calories: item.calories ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from("menu_items").insert(item as any).select().single();
        if (!error && data) return data as MenuItem;
      }
    }

    const items = await this.getMenuItems();
    const updated = [newItem, ...items];
    setLocalItem(STORAGE_KEYS.MENU_ITEMS, updated);
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("menu_items")
          .update(updates as any)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) return data as MenuItem;
      }
    }

    const items = await this.getMenuItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    items[index] = updatedItem;
    setLocalItem(STORAGE_KEYS.MENU_ITEMS, items);
    return updatedItem;
  },

  async deleteMenuItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.from("menu_items").delete().eq("id", id);
        if (!error) return true;
      }
    }

    const items = await this.getMenuItems();
    const filtered = items.filter((i) => i.id !== id);
    setLocalItem(STORAGE_KEYS.MENU_ITEMS, filtered);
    return true;
  },

  // ================= RESERVATIONS =================
  async getReservations(): Promise<Reservation[]> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .order("reservation_date", { ascending: false });
        if (!error && data && data.length > 0) return data;
      }
    }

    return getLocalItem<Reservation[]>(STORAGE_KEYS.RESERVATIONS, SEED_RESERVATIONS);
  },

  async createReservation(form: ReservationFormValues): Promise<Reservation> {
    const reference = generateBookingReference();
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reference_code: reference,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      guest_count: form.guest_count,
      seating_preference: form.seating_preference || "main-dining",
      special_requests: form.special_requests || null,
      status: "pending",
      admin_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("reservations")
          .insert(newReservation as any)
          .select()
          .single();
        if (!error && data) return data as Reservation;
      }
    }

    const existing = await this.getReservations();
    const updated = [newReservation, ...existing];
    setLocalItem(STORAGE_KEYS.RESERVATIONS, updated);
    return newReservation;
  },

  async getReservationByReference(referenceCode: string): Promise<Reservation | null> {
    const cleanRef = referenceCode.trim().toUpperCase();
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .eq("reference_code", cleanRef)
          .maybeSingle();
        if (!error && data) return data;
      }
    }

    const reservations = await this.getReservations();
    return reservations.find((r) => r.reference_code.toUpperCase() === cleanRef) || null;
  },

  async updateReservationStatus(
    id: string,
    status: ReservationStatus,
    admin_notes?: string
  ): Promise<Reservation | null> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const updates: any = { status, updated_at: new Date().toISOString() };
        if (admin_notes !== undefined) updates.admin_notes = admin_notes;
        const { data, error } = await supabase
          .from("reservations")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) return data;
      }
    }

    const reservations = await this.getReservations();
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) return null;

    reservations[index] = {
      ...reservations[index],
      status,
      admin_notes: admin_notes !== undefined ? admin_notes : reservations[index].admin_notes,
      updated_at: new Date().toISOString(),
    };
    setLocalItem(STORAGE_KEYS.RESERVATIONS, reservations);
    return reservations[index];
  },

  // ================= TESTIMONIALS =================
  async getTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && data && data.length > 0) return data;
      }
    }
    return TESTIMONIALS_DATA;
  },

  // ================= NEWSLETTER =================
  async subscribeNewsletter(email: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email } as any);
        if (!error) return true;
      }
    }

    const subscribers = getLocalItem<string[]>(STORAGE_KEYS.NEWSLETTER, []);
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      setLocalItem(STORAGE_KEYS.NEWSLETTER, subscribers);
    }
    return true;
  },
};

