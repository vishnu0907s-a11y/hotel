import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import MenuSection from "@/components/sections/MenuSection";
import ChefSection from "@/components/sections/ChefSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ReservationSection from "@/components/sections/ReservationSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      {/* SECTION 01 — CINEMATIC HERO */}
      <HeroSection />

      {/* SECTION 02 — OUR PHILOSOPHY */}
      <PhilosophySection />

      {/* SECTION 03 — SIGNATURE COLLECTION */}
      <MenuSection />

      {/* SECTION 04 — THE CHEF'S STORY */}
      <ChefSection />

      {/* SECTION 05 — THE DINING EXPERIENCE */}
      <ExperienceSection />

      {/* SECTION 06 — RESERVATION EXPERIENCE */}
      <ReservationSection />

      {/* SECTION 07 — TESTIMONIALS */}
      <TestimonialsSection />

      {/* SECTION 08 — LOCATION & CONTACT */}
      <ContactSection />
    </>
  );
}

