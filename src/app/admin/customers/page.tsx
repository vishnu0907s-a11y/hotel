"use client";

import { useEffect, useState } from "react";
import { Users2, Search, Award, Star, Mail, Phone, Calendar, Sparkles } from "lucide-react";
import { DataService } from "@/lib/storage";
import { Reservation } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";

interface PatronProfile {
  email: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalGuests: number;
  lastVisit: string;
  allergies: string[];
  isVIP: boolean;
  reservations: Reservation[];
}

export default function CustomersAdminPage() {
  const [patrons, setPatrons] = useState<PatronProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatron, setSelectedPatron] = useState<PatronProfile | null>(null);

  useEffect(() => {
    async function loadPatrons() {
      try {
        setLoading(true);
        const resList = await DataService.getReservations();

        // Group reservations by customer_email
        const grouped: { [email: string]: PatronProfile } = {};

        resList.forEach((r) => {
          const email = r.customer_email.toLowerCase();
          if (!grouped[email]) {
            grouped[email] = {
              email: r.customer_email,
              name: r.customer_name,
              phone: r.customer_phone,
              totalVisits: 0,
              totalGuests: 0,
              lastVisit: r.reservation_date,
              allergies: [],
              isVIP: false,
              reservations: [],
            };
          }

          grouped[email].totalVisits += 1;
          grouped[email].totalGuests += r.guest_count;
          grouped[email].reservations.push(r);

          if (r.special_requests && !grouped[email].allergies.includes(r.special_requests)) {
            grouped[email].allergies.push(r.special_requests);
          }

          if (grouped[email].totalVisits >= 2 || r.seating_preference === "private-salon") {
            grouped[email].isVIP = true;
          }
        });

        setPatrons(Object.values(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPatrons();
  }, []);

  const filtered = patrons.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-semibold">
            Patron Lineage & Relationship Desk
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light mt-1">
            Guest Conclave Register
          </h1>
        </div>

        <div className="text-xs font-mono text-gold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full">
          Recognized Patrons: {patrons.length}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patron by name, email, or telephone..."
            className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-2.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none"
          />
          <Search className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Patrons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ivory/50 text-xs">
            No patrons found matching search criteria.
          </div>
        ) : (
          filtered.map((patron) => (
            <div
              key={patron.email}
              onClick={() => setSelectedPatron(patron)}
              className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-gold/40 transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <span className="font-serif-luxury text-base text-gold font-light">
                      {patron.name.charAt(0)}
                    </span>
                  </div>

                  {patron.isVIP ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40 text-[10px] font-mono uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>VIP Circle</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-ivory/40 uppercase tracking-wider font-mono">
                      Guest
                    </span>
                  )}
                </div>

                <h3 className="font-serif-luxury text-2xl text-ivory group-hover:text-gold-light transition-colors mb-1">
                  {patron.name}
                </h3>
                <p className="text-xs text-ivory/60 font-sans mb-4">
                  {patron.email}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-ivory/40 block font-mono">Total Visits</span>
                  <span className="text-ivory font-medium">{patron.totalVisits} Times ({patron.totalGuests} covers)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ivory/40 block font-mono">Last Dining</span>
                  <span className="text-gold font-medium">{formatDate(patron.lastVisit)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patron Detail Drawer / Modal */}
      {selectedPatron && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#141414] border border-gold/40 rounded-3xl p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-1">
                  Patron Dossier
                </span>
                <h2 className="font-serif-luxury text-3xl text-ivory">
                  {selectedPatron.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPatron(null)}
                className="px-4 py-1.5 rounded-full border border-white/20 text-xs hover:border-gold"
              >
                Close
              </button>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 text-xs">
              <div>
                <span className="text-ivory/50 block text-[10px] uppercase">Telephone</span>
                <a href={`tel:${selectedPatron.phone}`} className="text-gold hover:underline">
                  {selectedPatron.phone}
                </a>
              </div>
              <div>
                <span className="text-ivory/50 block text-[10px] uppercase">Email</span>
                <a href={`mailto:${selectedPatron.email}`} className="text-gold hover:underline">
                  {selectedPatron.email}
                </a>
              </div>
            </div>

            {/* Allergies & Preferences Recorded */}
            <div>
              <span className="text-xs uppercase tracking-wider text-gold font-mono block mb-2">
                Recorded Dietary Preferences & Allergies
              </span>
              {selectedPatron.allergies.length > 0 ? (
                <div className="space-y-2">
                  {selectedPatron.allergies.map((a, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#1e1e1e] border border-white/5 text-xs text-ivory/80">
                      {a}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ivory/50">No recurring allergies logged.</p>
              )}
            </div>

            {/* Historical Bookings */}
            <div>
              <span className="text-xs uppercase tracking-wider text-ivory/60 font-sans block mb-2">
                Complete Reservation Lineage ({selectedPatron.reservations.length})
              </span>
              <div className="space-y-2">
                {selectedPatron.reservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-gold font-bold mr-2">{r.reference_code}</span>
                      <span className="text-ivory">{formatDate(r.reservation_date)}</span>
                    </div>
                    <span className="capitalize px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-ivory">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

