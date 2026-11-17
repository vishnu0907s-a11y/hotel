"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit3,
  UserCheck,
  AlertTriangle,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { DataService } from "@/lib/storage";
import { Reservation, ReservationStatus } from "@/lib/supabase/types";
import { formatDate, formatTime } from "@/lib/utils";

export default function ReservationsAdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await DataService.getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    try {
      await DataService.updateReservationStatus(id, status);
      await fetchReservations();
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRes) return;
    try {
      await DataService.updateReservationStatus(
        selectedRes.id,
        selectedRes.status,
        editNotes
      );
      await fetchReservations();
      setSelectedRes((prev) => (prev ? { ...prev, admin_notes: editNotes } : null));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesDate = !dateFilter || r.reservation_date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
      case "pending":
        return "bg-amber-950/80 text-amber-300 border-amber-500/40";
      case "seated":
        return "bg-blue-950/80 text-blue-300 border-blue-500/40";
      case "completed":
        return "bg-purple-950/80 text-purple-300 border-purple-500/40";
      case "rejected":
      case "cancelled":
        return "bg-red-950/80 text-red-300 border-red-500/40";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-semibold">
            Maitre D' Desk
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-ivory font-light mt-1">
            Table & Guest Reservations
          </h1>
        </div>
        <div className="text-xs font-mono text-gold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full">
          Total Bookings: {reservations.length}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, reference, email..."
            className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-2.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none"
          />
          <Search className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["all", "pending", "confirmed", "seated", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider capitalize font-sans transition-all ${
                statusFilter === st
                  ? "bg-gold text-black font-semibold"
                  : "bg-white/5 text-ivory/70 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Calendar className="w-4 h-4 text-gold shrink-0" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-[10px] text-ivory/50 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory/50 text-xs font-sans">
            No bookings match your current filter parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-ivory/50 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Guest & Contact</th>
                  <th className="pb-3 font-medium">Date & Slot</th>
                  <th className="pb-3 font-medium">Cover</th>
                  <th className="pb-3 font-medium">Salon</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono text-gold font-bold">
                      {res.reference_code}
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-ivory">{res.customer_name}</p>
                      <p className="text-[11px] text-ivory/50">{res.customer_email}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-ivory">{formatDate(res.reservation_date)}</p>
                      <p className="text-gold/80 font-mono text-[11px]">{formatTime(res.reservation_time)}</p>
                    </td>
                    <td className="py-4 text-ivory">
                      {res.guest_count} Guests
                    </td>
                    <td className="py-4 capitalize text-ivory/80">
                      {res.seating_preference?.replace("-", " ")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase font-mono border ${getStatusBadge(
                          res.status
                        )}`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedRes(res);
                            setEditNotes(res.admin_notes || "");
                          }}
                          className="p-2 text-ivory/70 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                          title="View Guest Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {res.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "confirmed")}
                            className="p-2 text-emerald-400 hover:bg-emerald-950/80 rounded-lg transition-colors"
                            title="Confirm Booking"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {res.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "seated")}
                            className="p-2 text-blue-400 hover:bg-blue-950/80 rounded-lg transition-colors"
                            title="Mark Seated at Table"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        {res.status !== "cancelled" && res.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "cancelled")}
                            className="p-2 text-red-400 hover:bg-red-950/80 rounded-lg transition-colors"
                            title="Cancel Reservation"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guest Record Detail Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#141414] border border-gold/40 rounded-3xl p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedRes(null)}
              className="absolute top-6 right-6 p-2 text-ivory/60 hover:text-gold rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-1">
                Confidential Reservation Card
              </span>
              <h2 className="font-serif-luxury text-3xl text-ivory">
                {selectedRes.customer_name}
              </h2>
              <span className="font-mono text-sm text-gold font-bold">
                {selectedRes.reference_code}
              </span>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 text-xs">
              <div>
                <span className="text-ivory/50 block text-[10px] uppercase">Service Date & Time</span>
                <span className="text-ivory font-medium">
                  {formatDate(selectedRes.reservation_date)} at {formatTime(selectedRes.reservation_time)}
                </span>
              </div>
              <div>
                <span className="text-ivory/50 block text-[10px] uppercase">Party & Salon</span>
                <span className="text-ivory font-medium capitalize">
                  {selectedRes.guest_count} Guests • {selectedRes.seating_preference?.replace("-", " ")}
                </span>
              </div>
              <div>
                <span className="text-ivory/50 block text-[10px] uppercase">Telephone</span>
                <a href={`tel:${selectedRes.customer_phone}`} className="text-gold hover:underline">
                  {selectedRes.customer_phone}
                </a>
              </div>
              <div>
                <span className="text-ivory/50 block text-[10px] uppercase">Email</span>
                <a href={`mailto:${selectedRes.customer_email}`} className="text-gold hover:underline">
                  {selectedRes.customer_email}
                </a>
              </div>
            </div>

            {/* Guest Special Requests */}
            <div>
              <span className="text-xs uppercase tracking-wider text-ivory/60 font-sans block mb-2">
                Guest Dietary & Special Inquiries
              </span>
              <div className="p-3.5 rounded-xl bg-[#1e1e1e] border border-white/5 text-xs text-ivory/80">
                {selectedRes.special_requests || "None specified by guest."}
              </div>
            </div>

            {/* Maitre D' Internal Notes */}
            <div>
              <span className="text-xs uppercase tracking-wider text-ivory/60 font-sans block mb-2">
                Maitre D' & Sommelier Confidential Notes
              </span>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Table 4 allocated. Wine pairing pre-decanted. VIP repeat guest..."
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-3 text-xs text-ivory focus:border-gold focus:outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-gold hover:text-black text-xs transition-colors"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center justify-between">
              <span className="text-xs text-ivory/50">Update Service Status:</span>
              <div className="flex flex-wrap gap-1.5">
                {(["pending", "confirmed", "seated", "completed", "cancelled"] as ReservationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedRes.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono tracking-wider transition-all ${
                      selectedRes.status === st
                        ? "bg-gold text-black font-bold"
                        : "bg-white/5 text-ivory/70 hover:bg-white/10"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

