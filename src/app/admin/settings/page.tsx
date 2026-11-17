"use client";

import { useState } from "react";
import { RESTAURANT_CONFIG } from "@/lib/data/restaurant";
import { Sliders, Save, CheckCircle2, Clock, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function SettingsAdminPage() {
  const [dinnerHours, setDinnerHours] = useState(RESTAURANT_CONFIG.hours.dinner.time);
  const [dinnerDays, setDinnerDays] = useState(RESTAURANT_CONFIG.hours.dinner.days);
  const [phone, setPhone] = useState(RESTAURANT_CONFIG.phone);
  const [email, setEmail] = useState(RESTAURANT_CONFIG.email);
  const [conciergeEmail, setConciergeEmail] = useState(RESTAURANT_CONFIG.conciergeEmail);
  const [dressCode, setDressCode] = useState(RESTAURANT_CONFIG.dressCode);
  const [valetInfo, setValetInfo] = useState(RESTAURANT_CONFIG.valet);
  const [street, setStreet] = useState(RESTAURANT_CONFIG.address.street);
  const [city, setCity] = useState(RESTAURANT_CONFIG.address.city);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-semibold">
            Atelier Governance & Configuration
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light mt-1">
            Restaurant Parameters
          </h1>
        </div>

        {saved && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Parameters Updated & Synchronized</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hours of Operation */}
        <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 text-gold mb-2">
            <Clock className="w-5 h-5" />
            <h2 className="font-serif-luxury text-2xl text-ivory">
              Service Schedules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                Dinner Service Days
              </label>
              <input
                type="text"
                value={dinnerDays}
                onChange={(e) => setDinnerDays(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                Dinner Service Operating Hours
              </label>
              <input
                type="text"
                value={dinnerHours}
                onChange={(e) => setDinnerHours(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 text-gold mb-2">
            <Phone className="w-5 h-5" />
            <h2 className="font-serif-luxury text-2xl text-ivory">
              Concierge & Communications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-sans">
            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                Main Telephone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                General Reservations Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                Private Conclave Email
              </label>
              <input
                type="email"
                value={conciergeEmail}
                onChange={(e) => setConciergeEmail(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address & Logistics */}
        <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 text-gold mb-2">
            <MapPin className="w-5 h-5" />
            <h2 className="font-serif-luxury text-2xl text-ivory">
              Sanctuary Address & Logistics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-ivory/70 uppercase tracking-wider mb-2">
                City & Metropolitan Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-ivory/70 uppercase tracking-wider mb-2 text-xs font-sans">
              Valet Parking Logistics
            </label>
            <input
              type="text"
              value={valetInfo}
              onChange={(e) => setValetInfo(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-ivory/70 uppercase tracking-wider mb-2 text-xs font-sans">
              Dress Code & Patron Guidelines
            </label>
            <textarea
              rows={2}
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-xs text-ivory focus:border-gold focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-10 py-4 rounded-full bg-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

