# AURÉLIA — Haute Gastronomie & Fine Dining Experience

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

An internationally recognized luxury restaurant web application created with cinematic visual direction, dark gold aesthetics, high-performance interactions, and a fully functional database and administrative architecture.

---

## ✦ Live Experience Highlights

1. **Cinematic Hero Landing**: Full-screen atmospheric photography, 3D WebGL golden particle canvas, parallax depth, editorial typography, audio atmosphere toggle, and fluid entrance reveals.
2. **Editorial Philosophy**: Multi-act storytelling of Chef Julian Vance’s culinary lineage, biodynamic sourcing, and Kishu binchotan fire discipline.
3. **Haute Carte & Signature Dishes**: Dynamic menu loaded from PostgreSQL/Supabase with category filtering, dietary tags, sommelier pairings, and modal detail views.
4. **The Chef's Atelier**: Three-Michelin-star heritage profile, signature quotes, and culinary accolades.
5. **Atmosphere & Dining Space**: Smooth horizontal gallery showcasing the Main Dining Salon, The Sommelier's Vault, Private Salon d'Or, and Chef's Counter.
6. **Live Reservation Engine**:
   - Zod-validated multi-step reservation booking.
   - Slot capacity checking & validation.
   - Unique reference code generator (e.g., `AUR-2026-X8K2`).
   - Confirmation card with golden confetti.
   - Interactive patron reservation lookup & status tracker.
7. **Critical Acclaim**: Refined testimonials carousel from Michelin Guide inspectors and renowned culinary critics.
8. **Enclave & Directions**: Clickable concierge telephone and email, dark interactive Google Maps view, and valet portico information.
9. **Private Gazette**: Newsletter subscription with instant database registration.
10. **Executive Admin Dashboard (`/admin`)**:
    - **Overview**: Real-time service status, booking KPIs, and degustation revenue projections.
    - **Reservations**: Filter by status and date, search by reference code, approve/reject/seat/cancel bookings, and add Maitre D' notes.
    - **Menu & Cellar**: Full CRUD dish management, price editing, season availability switches, and signature badges.
    - **Patron Register**: Lifetime guest history, VIP status markers, and allergy tracking.
    - **Settings**: Operating hours, contact coordinates, valet policies, and dress code.

---

## ✦ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Variables, Custom Luxury Design System
- **3D & Canvas**: Three.js (WebGL ambient particles)
- **Animations**: Framer Motion, Lenis Smooth Scroll, GSAP
- **Database & Auth**: Supabase, PostgreSQL, Row Level Security (RLS)
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## ✦ Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
> **Seamless Local Fallback:** Even without Supabase keys configured, the application functions 100% out-of-the-box using the built-in resilient data layer with realistic fine-dining seed data and full browser persistence!

### 4. Database Setup (Supabase)
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Open `supabase/schema.sql` from this repository.
4. Run the SQL script to create all tables (`menu_categories`, `menu_items`, `reservations`, `restaurant_settings`, `testimonials`, `newsletter_subscribers`), indexes, RLS security policies, and seed data.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## ✦ Admin Dashboard Access

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).

For quick evaluation, click the **Maitre D' (Admin)** or **Head Sommelier** one-click sign-in button on the login screen, or sign in with:
- **Email**: `director@aurelia-dining.com`
- **Password**: Any secure password (e.g., `aurelia2026`)

---

## ✦ Project Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout with fonts, Lenis, CustomCursor, Preloader, Navbar & Footer
│   ├── page.tsx               # Main landing page (Sections 01 through 08)
│   ├── globals.css            # Luxury tokens, typography classes, Lenis CSS
│   ├── menu/page.tsx          # Dedicated comprehensive menu & cellar catalog
│   ├── sitemap.ts             # SEO sitemap
│   ├── robots.ts              # SEO robots configuration
│   ├── api/                   # RFC 7807 REST API routes
│   │   ├── reservations/      # GET / POST reservations
│   │   ├── reservations/[id]/ # PATCH update status
│   │   ├── menu/              # GET / POST menu dishes
│   │   └── newsletter/        # POST subscribe
│   └── admin/                 # Protected Executive Operations Portal
│       ├── layout.tsx         # Sidebar, session provider, service clock
│       ├── page.tsx           # Operations briefing, revenue analytics, pending queue
│       ├── login/page.tsx     # Admin authentication with one-click demo access
│       ├── reservations/      # Maitre D' table allocation & booking manager
│       ├── menu/              # Haute Carte & Cellar CRUD manager
│       ├── customers/         # Patron register & VIP profile dossier
│       └── settings/          # Service hours, coordinates & policies
├── components/
│   ├── 3d/
│   │   └── AmbientCanvas.tsx  # Three.js golden WebGL particle constellation
│   ├── layout/
│   │   ├── Navbar.tsx         # Transparent over hero, glass on scroll, soundscape toggle
│   │   ├── Footer.tsx         # Haute editorial footer with newsletter registration
│   │   ├── CustomCursor.tsx   # Desktop golden ring cursor with magnetic hover
│   │   ├── Preloader.tsx      # Cinematic brand entrance preloader
│   │   └── SmoothScroll.tsx   # Lenis physics-based smooth scrolling
│   └── sections/
│       ├── HeroSection.tsx    # Section 01: Cinematic Hero
│       ├── PhilosophySection.tsx # Section 02: Our Philosophy
│       ├── MenuSection.tsx    # Section 03: Signature Collection
│       ├── ChefSection.tsx    # Section 04: The Chef's Story
│       ├── ExperienceSection.tsx # Section 05: The Dining Experience
│       ├── ReservationSection.tsx# Section 06: Reservation Experience
│       ├── TestimonialsSection.tsx # Section 07: Critical Acclaim
│       └── ContactSection.tsx # Section 08: Enclave & Directions
├── lib/
│   ├── auth.ts                # Admin session & authentication manager
│   ├── storage.ts             # Unified data service (Supabase + local store fallback)
│   ├── utils.ts               # Currency formatting, date helpers, reference codes
│   ├── validations/           # Zod schemas for reservations, menu, newsletter
│   ├── data/                  # Realistic fine-dining seed datasets
│   └── supabase/              # Client, server, and TypeScript types
└── supabase/
    └── schema.sql             # Complete PostgreSQL migrations & seed SQL
```

---

## ✦ Deployment to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**. Vercel will automatically build the Next.js application with zero configuration needed.

---

## ✦ License & Royal Patronage
Crafted for **Aurélia Haute Gastronomie** — An Artful Expression of Taste.

