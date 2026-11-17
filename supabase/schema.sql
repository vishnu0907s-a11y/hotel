-- ==============================================================================
-- AURÉLIA LUXURY FINE DINING - DATABASE SCHEMA & MIGRATIONS
-- ==============================================================================
-- Target Engine: PostgreSQL 15+ (Supabase)
-- Includes:
--   - Row Level Security (RLS) on all tables
--   - Custom types & Enums
--   - Automatic timestamp updating trigger
--   - Role-Based Access Control (RBAC) via user_roles & profiles
--   - Complete luxury fine-dining seed dataset
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerations
CREATE TYPE reservation_status AS ENUM (
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'rejected'
);

CREATE TYPE user_role_type AS ENUM (
  'admin',
  'manager',
  'sommelier',
  'staff',
  'customer'
);

-- 3. Profiles & Roles Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role_type DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, role)
);

-- 4. Menu Categories
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.menu_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  is_signature BOOLEAN DEFAULT FALSE NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}' NOT NULL,
  wine_pairing TEXT,
  calories INT CHECK (calories >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  reference_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count INT NOT NULL CHECK (guest_count >= 1 AND guest_count <= 20),
  seating_preference TEXT DEFAULT 'main-dining',
  special_requests TEXT,
  status reservation_status DEFAULT 'pending' NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Restaurant Settings
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_title TEXT NOT NULL,
  publication TEXT,
  quote TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_reference ON public.reservations(reference_code);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations(customer_email);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current authenticated user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view their own profile; Admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories & Menu Items: Publicly readable; Only Admins can modify
CREATE POLICY "Public can view active menu categories" ON public.menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage menu categories" ON public.menu_categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view menu items" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage menu items" ON public.menu_items
  FOR ALL USING (public.is_admin());

-- Testimonials & Settings: Publicly readable; Admin writable
CREATE POLICY "Public can view testimonials" ON public.testimonials
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view settings" ON public.restaurant_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.restaurant_settings
  FOR ALL USING (public.is_admin());

-- Newsletter: Anyone can subscribe; Admins can view list
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());

-- Reservations:
-- 1. Public can create new reservations (INSERT)
CREATE POLICY "Public can submit reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

-- 2. Public can look up ONLY their own reservation by exact reference_code matching
CREATE POLICY "Guests can lookup own reservation by reference" ON public.reservations
  FOR SELECT USING (
    reference_code = current_setting('request.headers', true)::json->>'x-reference-code'
    OR public.is_admin()
  );

-- 3. Only Admins can update/delete/view all reservations
CREATE POLICY "Admins have full access to reservations" ON public.reservations
  FOR ALL USING (public.is_admin());

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_menu_items
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_update_reservations
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- SEED DATA
-- ==============================================================================
INSERT INTO public.menu_categories (id, name, slug, description, display_order)
VALUES
  ('cat-starters', 'Starters', 'starters', 'Delicate beginnings curated to awaken the palate with precision and purity.', 1),
  ('cat-mains', 'Main Course', 'main-course', 'The pinnacle of land and sea, transformed through artisanal fire and classic reduction.', 2),
  ('cat-specials', 'Chef''s Specials', 'chefs-specials', 'Rare and seasonal masterworks crafted exclusively by Chef Julian Vance.', 3),
  ('cat-desserts', 'Desserts', 'desserts', 'Sensory finales that balance temperature, architectural pastry, and pure cocoa terroir.', 4),
  ('cat-beverages', 'Beverages & Cellar', 'beverages', 'Grand cru vintages, rare artisanal spirits, and non-alcoholic botanical infusions.', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.menu_items (id, category_id, name, description, price, image_url, is_available, is_signature, dietary_tags, wine_pairing, calories)
VALUES
  ('dish-01', 'cat-starters', 'Imperial Osciètre Caviar & Brioche', 'Royal Caspian caviar served over warm golden buttered brioche, crème fraîche infused with Meyer lemon, and chive emulsion.', 145, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Gluten-Free Option', 'Pescatarian'], 'Dom Pérignon Brut Vintage 2013', 280),
  ('dish-02', 'cat-starters', 'Hokkaido Scallop Crudo', 'Thinly sliced raw diver scallops, compressed green apple, finger lime caviar, sea buckthorn vinaigrette, and crystalline sea salt.', 68, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Gluten-Free', 'Pescatarian', 'Dairy-Free'], 'Chablis Grand Cru ''Les Clos'' 2020', 195),
  ('dish-03', 'cat-starters', 'Perigord Black Truffle Tartare', 'Hand-cut Prime beef tenderloin, cured duck egg yolk, shaved winter black truffles, pickled shallots, and house-made squid ink crisps.', 78, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Contains Egg', 'Raw Specialist'], 'Barolo Monfortino Riserva 2015', 340),
  ('dish-04', 'cat-starters', 'Roasted Heirloom Beet Velvet', 'Smoked golden beet purée, whipped goat curd from Loire Valley, pistachio crumble, and twenty-five-year aged Modena balsamic glaze.', 52, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Vegetarian', 'Gluten-Free'], 'Sancerre Domaine Vacheron 2022', 220),
  ('dish-05', 'cat-mains', 'A5 Miyazaki Wagyu Tenderloin', 'Seared over binchotan charcoal, bone marrow glaze, charred maitake mushroom, smoked parsnip mousseline, and natural jus.', 195, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Gluten-Free'], 'Château Latour Grand Vin Pauillac 2012', 620),
  ('dish-06', 'cat-mains', 'Glacier 51 Patagonian Toothfish', 'Wild toothfish caramelized with white saikyo miso, dashi beurre blanc, sea succulents, and braised baby daikon.', 125, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Pescatarian', 'Gluten-Free'], 'Meursault Premier Cru Genevrières 2021', 480),
  ('dish-07', 'cat-mains', 'Handmade Agnolotti al Tartufo', 'Silk pasta parcels filled with fontina val d''Aosta and caramelized leeks, emulsified butter, and freshly shaved white Alba truffles.', 88, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Vegetarian'], 'Barbaresco Gaja 2018', 510),
  ('dish-08', 'cat-mains', 'Racan Pigeon en Croûte', 'Breton pigeon breast wrapped in savoy cabbage and puff pastry, duck foie gras core, and rich berry-peppercorn reduction.', 110, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Classic French'], 'Hermitage Jean-Louis Chave 2016', 590),
  ('dish-09', 'cat-specials', 'Brittany Blue Lobster ''Homard Royal''', 'Poached gently in coral butter, roasted cauliflower velvet, Romanesco florets, and gold-leaf infused saffron cognac reduction.', 175, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Pescatarian', 'Signature Selection'], 'Corton-Charlemagne Grand Cru 2019', 450),
  ('dish-10', 'cat-specials', 'Dry-Aged Challans Duck with Lavender Honey', '28-day aged duck breast, spiced lavender honey lacquer, heirloom caramelized chicory, and sour cherry gastrique.', 135, 'https://images.unsplash.com/photo-1514944298352-73ec8b5c93c4?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Gluten-Free Option'], 'Vosne-Romanée Premier Cru 2017', 540),
  ('dish-11', 'cat-desserts', 'Valrhona Guanaja Gold Sphère', '70% single-origin chocolate sphere, smoked caramel heart, roasted hazelnut crunch, melted tableside with warm Madagascar vanilla ganache.', 42, 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Vegetarian'], 'Château d''Yquem Sauternes 2011', 390),
  ('dish-12', 'cat-desserts', 'Yuzu & Kaffir Lime Blossom', 'Delicate Japanese yuzu curd, matcha green tea sponge, meringue shards, and crystalline shiso sorbet.', 36, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Vegetarian', 'Refreshing'], 'Moscato d''Asti Vietti 2023', 240),
  ('dish-13', 'cat-beverages', 'The Golden Ambrosia (Bespoke Elixir)', 'Non-alcoholic infusion of distilled white pine, clarified golden pear nectar, saffron honey, and 24-karat edible gold flake effervescence.', 28, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85', true, true, ARRAY['Non-Alcoholic', 'Gluten-Free', 'Artisanal'], 'Pairs with all dessert offerings', 95),
  ('dish-14', 'cat-beverages', 'Krug Clos d''Ambonnay Champagne 2002', 'Extremely rare 100% Pinot Noir from the legendary 0.68-hectare walled vineyard. Notes of brioche, candied citrus, and toasted hazelnut.', 3200, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85', true, false, ARRAY['Cellar Reserve'], 'Pairs exquisitely with Caviar & Seafood', 140)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.testimonials (id, author_name, author_title, publication, quote, rating, is_featured)
VALUES
  ('test-01', 'Michelin Guide Inspector', 'Three Stars Michelin', 'The Michelin Guide 2026', 'A culinary cathedral where technique reaches the sublime. Chef Julian Vance commands fire, acid, and texture with an almost operatic precision. Each course is not merely served; it unfolds like a bespoke revelation.', 5, true),
  ('test-02', 'Jonathan Gold Legacy Foundation', 'Lead Culinary Critic', 'Epicurean Review International', 'Dining at Aurelia is an encounter with genius. The harmony between the sommelier''s cellar selections and Vance''s Brittany blue lobster redefines modern luxury dining in the 21st century.', 5, true),
  ('test-03', 'Claire Delacroix', 'Gastronomy Editor', 'Le Figaro Dining', 'The dining room is intoxicating in its dark, gilded composure. The acoustics, the candlelight, the silent choreography of the service team — everything conspires to make time stand perfectly still.', 5, true)
ON CONFLICT (id) DO NOTHING;

