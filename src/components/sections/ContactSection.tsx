"use client";

import { RESTAURANT_CONFIG } from "@/lib/data/restaurant";
import { MapPin, Phone, Mail, Clock, Car, Navigation, ArrowUpRight } from "lucide-react";

export default function ContactSection() {
  const { address, phone, email, conciergeEmail, hours, valet } = RESTAURANT_CONFIG;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  )}`;

  return (
    <section id="location" className="relative py-28 md:py-36 bg-[#0B0B0B] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-medium">
            Section 08 — Enclave & Directions
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl text-ivory font-light leading-tight mb-4">
                Location & <br />
                <span className="italic text-gold-gradient font-normal">Private Inquiries</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ivory-muted font-light leading-relaxed">
                Situated in the heart of the historic district, Aurélia welcomes patrons with discrete valet portico entry and secluded private salon access.
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-sans mb-1">Sanctuary Address</h4>
                  <p className="font-serif-luxury text-lg text-ivory leading-snug">
                    {address.street}, {address.suite}
                  </p>
                  <p className="font-sans text-xs text-ivory/60">
                    {address.city}, {address.state} {address.zip}, {address.country}
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                  <Phone className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-sans mb-1">Direct Line & Reservations</h4>
                  <a
                    href={`tel:${phone}`}
                    className="font-serif-luxury text-xl text-ivory hover:text-gold transition-colors block"
                  >
                    {phone}
                  </a>
                  <span className="text-[11px] text-ivory/50 font-sans">
                    Concierge available daily from 11:00 AM
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-sans mb-1">Electronic Dispatch</h4>
                  <a
                    href={`mailto:${email}`}
                    className="font-sans text-sm text-ivory hover:text-gold transition-colors block"
                  >
                    {email}
                  </a>
                  <a
                    href={`mailto:${conciergeEmail}`}
                    className="font-sans text-xs text-ivory/50 hover:text-gold transition-colors block mt-0.5"
                  >
                    Private Conclaves: {conciergeEmail}
                  </a>
                </div>
              </div>

              {/* Valet */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                  <Car className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-sans mb-1">Valet Services</h4>
                  <p className="font-sans text-xs text-ivory-muted leading-relaxed">
                    {valet}
                  </p>
                </div>
              </div>
            </div>

            {/* Directions CTA Button */}
            <div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-full border border-gold bg-gold/10 text-gold hover:bg-gold hover:text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(200,169,106,0.2)]"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Interactive Directions</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Map Preview & Hours Box */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            {/* Opening Hours Schedule Card */}
            <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-5 h-5 text-gold" />
                <h3 className="font-serif-luxury text-2xl text-ivory">
                  Hours of Gastronomy
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="border-l border-gold/30 pl-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-mono block mb-1">
                    Grand Degustation
                  </span>
                  <p className="font-serif-luxury text-lg text-ivory">{hours.dinner.days}</p>
                  <p className="font-sans text-xs text-ivory/60">{hours.dinner.time}</p>
                </div>

                <div className="border-l border-gold/30 pl-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-mono block mb-1">
                    Tasting Seatings
                  </span>
                  <p className="font-serif-luxury text-lg text-ivory">{hours.tastingMenu.days}</p>
                  <p className="font-sans text-xs text-ivory/60">
                    {hours.tastingMenu.seatings.join(" & ")}
                  </p>
                </div>

                <div className="border-l border-gold/30 pl-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-mono block mb-1">
                    Cellar Lounge
                  </span>
                  <p className="font-serif-luxury text-lg text-ivory">{hours.cellarBar.days}</p>
                  <p className="font-sans text-xs text-ivory/60">{hours.cellarBar.time}</p>
                </div>
              </div>
            </div>

            {/* Dark Styled Map Card */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <iframe
                title="Aurélia Restaurant Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.989254848039!2d-73.968285!3d40.767426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258eb854589ff%3A0xa6ebbb2a9d9e4a87!2sMadison%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full filter invert-[0.92] hue-rotate-180 contrast-125 border-0"
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none border border-gold/30 rounded-3xl" />

              {/* Floating Address Badge on Map */}
              <div className="absolute top-4 left-4 p-4 rounded-xl glass-panel-gold border border-gold/40 max-w-xs shadow-2xl pointer-events-none">
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-sans block mb-1 font-semibold">
                  Aurélia Pavillon d'Or
                </span>
                <p className="font-serif-luxury text-sm text-ivory leading-snug">
                  Avenue Montaigne & Madison Concourse
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

