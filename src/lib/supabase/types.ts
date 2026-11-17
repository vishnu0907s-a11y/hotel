export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "rejected";

export interface Database {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          is_available: boolean;
          is_signature: boolean;
          dietary_tags: string[];
          wine_pairing: string | null;
          calories: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          is_available?: boolean;
          is_signature?: boolean;
          dietary_tags?: string[];
          wine_pairing?: string | null;
          calories?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          is_available?: boolean;
          is_signature?: boolean;
          dietary_tags?: string[];
          wine_pairing?: string | null;
          calories?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          reference_code: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          reservation_date: string;
          reservation_time: string;
          guest_count: number;
          seating_preference: string | null;
          special_requests: string | null;
          status: ReservationStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_code: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          reservation_date: string;
          reservation_time: string;
          guest_count: number;
          seating_preference?: string | null;
          special_requests?: string | null;
          status?: ReservationStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_code?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          reservation_date?: string;
          reservation_time?: string;
          guest_count?: number;
          seating_preference?: string | null;
          special_requests?: string | null;
          status?: ReservationStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurant_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_title: string;
          publication: string | null;
          quote: string;
          rating: number;
          avatar_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_title: string;
          publication?: string | null;
          quote: string;
          rating?: number;
          avatar_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_title?: string;
          publication?: string | null;
          quote?: string;
          rating?: number;
          avatar_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed_at?: string;
        };
      };
    };
  };
}

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"] & {
  category_name?: string;
};

export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

