export interface RestaurantDetails {
  name: string;
  tagline: string;
  headline: string;
  subheadline: string;
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  email: string;
  conciergeEmail: string;
  hours: {
    dinner: {
      days: string;
      time: string;
    };
    tastingMenu: {
      days: string;
      seatings: string[];
    };
    cellarBar: {
      days: string;
      time: string;
    };
  };
  dressCode: string;
  valet: string;
  socials: {
    platform: string;
    handle: string;
    url: string;
  }[];
  chef: {
    name: string;
    role: string;
    accolades: string;
    bio: string;
    signatureQuote: string;
    image: string;
  };
}

export const RESTAURANT_CONFIG: RestaurantDetails = {
  name: "AURÉLIA",
  tagline: "HAUTE GASTRONOMIE",
  headline: "An Artful Expression of Taste.",
  subheadline: "Where exceptional ingredients, culinary craftsmanship, and unforgettable experiences come together in timeless harmony.",
  address: {
    street: "450 Avenue Montaigne",
    suite: "Pavillon d'Or",
    city: "New York",
    state: "NY",
    zip: "10021",
    country: "United States",
  },
  phone: "+1 (212) 890-4500",
  email: "reservations@aurelia-dining.com",
  conciergeEmail: "concierge@aurelia-dining.com",
  hours: {
    dinner: {
      days: "Tuesday – Sunday",
      time: "5:30 PM – 11:00 PM",
    },
    tastingMenu: {
      days: "Tuesday – Sunday",
      seatings: ["6:00 PM", "8:45 PM"],
    },
    cellarBar: {
      days: "Tuesday – Sunday",
      time: "5:00 PM – Midnight",
    },
  },
  dressCode: "Elegant Evening Attire Required. Jackets recommended for gentlemen. Athletic wear, shorts, and beachwear are strictly prohibited.",
  valet: "Complimentary private valet parking provided at the main portico entrance.",
  socials: [
    { platform: "Instagram", handle: "@aurelia_dining", url: "https://instagram.com" },
    { platform: "LinkedIn", handle: "Aurelia Hospitality Group", url: "https://linkedin.com" },
    { platform: "X", handle: "@aurelia_dining", url: "https://x.com" },
  ],
  chef: {
    name: "Chef Julian Vance",
    role: "Chef Patron & Culinary Director",
    accolades: "Three Michelin Stars • Grand Chef Relais & Châteaux • Best Chef Worldwide 2024",
    bio: "Trained across the classic Parisian ateliers of Guy Savoy and Alain Ducasse, Chef Julian Vance brings thirty years of mastery to Aurélia. His philosophy converges around radical ingredient purity, seasonal biodynamic sourcing, and modern architectural plating that transforms dining into high art.",
    signatureQuote: "We do not simply cook ingredients; we listen to their terroir and translate their essence into emotion on the palate.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85",
  },
};

