import { Testimonial } from "@/lib/supabase/types";

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-01",
    author_name: "Michelin Guide Inspector",
    author_title: "Three Stars Michelin",
    publication: "The Michelin Guide 2026",
    quote: "A culinary cathedral where technique reaches the sublime. Chef Julian Vance commands fire, acid, and texture with an almost operatic precision. Each course is not merely served; it unfolds like a bespoke revelation.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "test-02",
    author_name: "Jonathan Gold Legacy Foundation",
    author_title: "Lead Culinary Critic",
    publication: "Epicurean Review International",
    quote: "Dining at Aurelia is an encounter with genius. The harmony between the sommelier's cellar selections and Vance's Brittany blue lobster redefines modern luxury dining in the 21st century.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "test-03",
    author_name: "Claire Delacroix",
    author_title: "Gastronomy Editor",
    publication: "Le Figaro Dining",
    quote: "The dining room is intoxicating in its dark, gilded composure. The acoustics, the candlelight, the silent choreography of the service team — everything conspires to make time stand perfectly still.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "test-04",
    author_name: "Sir Marcus Sterling",
    author_title: "Private Patron & Connoisseur",
    publication: "Luxury Lifestyle Journal",
    quote: "We reserved the Private Salon for our anniversary. The personalized tasting menu and cellar tour elevated the evening beyond all expectations. Simply peerless hospitality.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

