import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import Preloader from "@/components/layout/Preloader";
import { RESTAURANT_CONFIG } from "@/lib/data/restaurant";

export const metadata: Metadata = {
  title: `${RESTAURANT_CONFIG.name} | ${RESTAURANT_CONFIG.tagline} — Three Michelin Stars NYC`,
  description:
    "An Artful Expression of Taste. Experience world-class fine dining, artisanal wine pairings, and visionary gastronomy by Chef Julian Vance at Aurélia New York.",
  keywords: [
    "Aurélia",
    "Luxury Restaurant",
    "Fine Dining NYC",
    "Three Michelin Stars",
    "Chef Julian Vance",
    "Haute Gastronomie",
    "Wine Tasting",
    "Private Dining",
  ],
  authors: [{ name: "Aurélia Haute Gastronomie" }],
  openGraph: {
    title: `${RESTAURANT_CONFIG.name} — Haute Gastronomie NYC`,
    description: "An Artful Expression of Taste. Three Michelin Star dining in New York.",
    url: "https://aurelia-dining.com",
    siteName: "Aurélia Restaurant",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Aurélia Fine Dining",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurélia Haute Gastronomie",
    description: "An Artful Expression of Taste. Three Michelin Star dining.",
    images: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Restaurant Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT_CONFIG.name,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    "@id": "https://aurelia-dining.com",
    url: "https://aurelia-dining.com",
    telephone: RESTAURANT_CONFIG.phone,
    email: RESTAURANT_CONFIG.email,
    priceRange: "$$$$",
    servesCuisine: "Modern French, Haute Gastronomie",
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT_CONFIG.address.street,
      addressLocality: RESTAURANT_CONFIG.address.city,
      addressRegion: RESTAURANT_CONFIG.address.state,
      postalCode: RESTAURANT_CONFIG.address.zip,
      addressCountry: RESTAURANT_CONFIG.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "17:30",
        closes: "23:00",
      },
    ],
    starRating: {
      "@type": "Rating",
      ratingValue: "3",
      bestRating: "3",
      ratingExplanation: "Three Michelin Stars",
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0B0B0B] text-ivory antialiased selection:bg-gold selection:text-black min-h-screen">
        <Preloader />
        <CustomCursor />
        <SmoothScroll>
          <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}

