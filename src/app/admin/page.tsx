"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Users,
  UtensilsCrossed,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { DataService } from "@/lib/storage";
import { Reservation, MenuItem } from "@/lib/supabase/types";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resList, dishes] = await Promise.all([
        DataService.getReservations(),
        DataService.getMenuItems(),
      ]);
      setReservations(resList);
      setMenuItems(dishes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter((r) => r.reservation_date === todayStr);
  const pendingReservations = reservations.filter((r) => r.status === "pending");
  const confirmedReservations = reservations.filter((r) => r.status === "confirmed" || r.status === "seated");

  // Estimated Degustation Revenue: average $325 per confirmed guest
  const estimatedRevenue = confirmedReservations.reduce(
    (acc, r) => acc + r.guest_count * 325,
    0
  );

  const handleQuickStatusChange = async (id: string, newStatus: "confirmed" | "rejected") => {
    await DataService.updateReservationStatus(id, newStatus);
    loadData();
  };

  return (
    <div className="space-y-10">
      {/* Top Welcome & Service Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-semibold">
            Executive Control & Service Dashboard
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light mt-1">
            Service Briefing & Operations
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Evening Service Active</span>
          </div>
          <Link
            href="/admin/reservations"
            className="px-5 py-2 rounded-full bg-gold text-black text-xs uppercase tracking-wider font-semibold hover:bg-gold-light transition-all"
          >
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reservations */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-ivory/60 font-sans">
              Total Reservations
            </span>
            <CalendarCheck2 className="w-5 h-5 text-gold" />
          </div>
          <span className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light">
            {reservations.length}
          </span>
          <p className="text-[11px] text-ivory/50 mt-2 font-sans">
            All recorded booking history
          </p>
        </div>

        {/* Today's Bookings */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-ivory/60 font-sans">
              Today's Seating
            </span>
            <Clock className="w-5 h-5 text-gold-light" />
          </div>
          <span className="font-serif-luxury text-3xl sm:text-4xl text-gold-light font-light">
            {todayReservations.length} Tables
          </span>
          <p className="text-[11px] text-ivory/50 mt-2 font-sans">
            {todayReservations.reduce((sum, r) => sum + r.guest_count, 0)} guests expected tonight
          </p>
        </div>

        {/* Pending Requests */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-gold/30 bg-gold/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-gold font-sans font-medium">
              Action Required
            </span>
            <AlertCircle className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <span className="font-serif-luxury text-3xl sm:text-4xl text-gold font-light">
            {pendingReservations.length} Pending
          </span>
          <p className="text-[11px] text-gold/80 mt-2 font-sans">
            Awaiting Maitre D' authorization
          </p>
        </div>

        {/* Total Menu Dishes */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-ivory/60 font-sans">
              Active Creations
            </span>
            <UtensilsCrossed className="w-5 h-5 text-gold" />
          </div>
          <span className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light">
            {menuItems.length} Dishes
          </span>
          <p className="text-[11px] text-ivory/50 mt-2 font-sans">
            Across 5 curated categories
          </p>
        </div>
      </div>

      {/* Revenue Projection & Capacity Insights */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-mono block mb-1">
            Service Projection
          </span>
          <h3 className="font-serif-luxury text-2xl text-ivory">
            Confirmed Tasting Revenue: {formatPrice(estimatedRevenue)}
          </h3>
          <p className="font-sans text-xs text-ivory-muted mt-1 font-light">
            Based on current confirmed party counts and average degustation pairing spend ($325 / cover).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/admin/menu"
            className="px-6 py-3 rounded-full border border-white/20 hover:border-gold text-xs uppercase tracking-wider text-ivory transition-colors"
          >
            Review Dishes & Cellar
          </Link>
          <Link
            href="/admin/reservations"
            className="px-6 py-3 rounded-full bg-gold text-black text-xs uppercase tracking-wider font-semibold hover:bg-gold-light transition-colors"
          >
            Full Bookings Register
          </Link>
        </div>
      </div>

      {/* Pending Reservations Queue */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-serif-luxury text-2xl text-ivory">
              Pending Booking Inquiries
            </h2>
            <p className="text-xs text-ivory-muted font-sans font-light">
              Guest inquiries requiring seat allocation and sommelier validation.
            </p>
          </div>
          <span className="text-xs font-mono text-gold px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
            {pendingReservations.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : pendingReservations.length === 0 ? (
          <div className="py-12 text-center text-ivory/50 text-xs font-sans">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            All table reservation requests have been processed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-ivory/50 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-medium">Ref</th>
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Party</th>
                  <th className="pb-3 font-medium">Salon</th>
                  <th className="pb-3 font-medium">Special Notes</th>
                  <th className="pb-3 font-medium text-right">Maitre D' Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono text-gold font-semibold">
                      {res.reference_code}
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-ivory">{res.customer_name}</p>
                      <p className="text-[11px] text-ivory/50">{res.customer_phone}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-ivory">{formatDate(res.reservation_date)}</p>
                      <p className="text-gold/80 font-mono text-[11px]">{formatTime(res.reservation_time)}</p>
                    </td>
                    <td className="py-4 text-ivory">
                      {res.guest_count} Persons
                    </td>
                    <td className="py-4 capitalize text-ivory/80">
                      {res.seating_preference?.replace("-", " ")}
                    </td>
                    <td className="py-4 text-ivory/60 max-w-xs truncate">
                      {res.special_requests || "Standard tasting"}
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => handleQuickStatusChange(res.id, "confirmed")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleQuickStatusChange(res.id, "rejected")}
                          className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

