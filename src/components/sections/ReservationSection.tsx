"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  User,
  Search,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { reservationFormSchema, ReservationFormValues } from "@/lib/validations/reservation";
import { DataService } from "@/lib/storage";
import { Reservation } from "@/lib/supabase/types";
import { formatDate, formatTime } from "@/lib/utils";

const TIME_SLOTS = [
  "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

const SEATING_OPTIONS = [
  { id: "main-dining", label: "Main Dining Salon", note: "Central atmosphere & chandelier glow" },
  { id: "chef-counter", label: "The Chef's Counter", note: "Overlooking binchotan fire & plating" },
  { id: "private-salon", label: "Private Salon d'Or", note: "Discreet alcove & butler service" },
  { id: "terrace", label: "Winter Garden Terrace", note: "Heated glass conservatory" },
];

export default function ReservationSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Status Lookup state
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<Reservation | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      guest_count: 2,
      reservation_date: todayStr,
      reservation_time: "19:30",
      seating_preference: "main-dining",
      special_requests: "",
    },
  });

  const selectedDate = watch("reservation_date");
  const selectedTime = watch("reservation_time");
  const selectedGuests = watch("guest_count");
  const selectedSeating = watch("seating_preference");

  const onSubmit = async (values: ReservationFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Check existing bookings on this date/time to avoid capacity overload
      const existing = await DataService.getReservations();
      const currentSlotBookings = existing.filter(
        (r) =>
          r.reservation_date === values.reservation_date &&
          r.reservation_time === values.reservation_time &&
          r.status !== "cancelled" &&
          r.status !== "rejected"
      );

      // Max capacity per 30-min slot is 18 guests in fine-dining setting
      const currentGuestCount = currentSlotBookings.reduce((sum, r) => sum + r.guest_count, 0);
      if (currentGuestCount + values.guest_count > 24) {
        setErrorMessage(
          "This exact time slot is currently at capacity. Please select an alternate time or contact our concierge."
        );
        setIsSubmitting(false);
        return;
      }

      const created = await DataService.createReservation(values);
      setConfirmedReservation(created);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C8A96A", "#E5C588", "#FFFFFF", "#9D7E3F"],
        });
      } catch (e) {
        // Confetti is non-critical
      }

      reset();
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setIsSearching(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const res = await DataService.getReservationByReference(lookupQuery.trim());
      if (res) {
        setLookupResult(res);
      } else {
        setLookupError("No reservation found matching this reference code.");
      }
    } catch (err) {
      setLookupError("Unable to lookup reservation at this moment.");
    } finally {
      setIsSearching(false);
    }
  };

  const copyReference = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="reservation" className="relative py-28 md:py-36 bg-[#0B0B0B] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-gold font-sans font-medium">
              Section 06 — Table Reservations
            </span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-ivory font-light mb-4">
            Curate Your <span className="italic text-gold-gradient font-normal">Evening</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-ivory-muted font-light leading-relaxed">
            Reserve your journey through our multi-course degustation. We accommodate individual dietary requirements and bespoke celebrations with discrete artistry.
          </p>
        </div>

        {/* Main Grid: Reservation Form & Guest Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reservation Booking Form */}
          <div className="lg:col-span-8 bg-[#141414] rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl relative">
            {confirmedReservation ? (
              /* Booking Confirmation Card */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full border border-gold/60 bg-gold/10 flex items-center justify-center mx-auto mb-6 text-gold">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <span className="text-xs uppercase tracking-[0.35em] text-gold font-sans block mb-2">
                  Table Confirmed & Registered
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-ivory mb-2">
                  We Await Your Arrival, {confirmedReservation.customer_name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-ivory-muted max-w-md mx-auto mb-8 font-light">
                  A formal confirmation with sommelier tasting previews has been dispatched to{" "}
                  <strong className="text-ivory font-medium">{confirmedReservation.customer_email}</strong>.
                </p>

                {/* Booking Reference Box */}
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/60 border border-gold/40 mb-8">
                  <span className="text-[10px] uppercase tracking-widest text-gold/70 block mb-1">
                    Your Confidential Booking Reference
                  </span>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="font-mono text-2xl font-bold tracking-widest text-gold-light">
                      {confirmedReservation.reference_code}
                    </span>
                    <button
                      onClick={() => copyReference(confirmedReservation.reference_code)}
                      className="p-2 text-gold hover:text-white transition-colors"
                      title="Copy reference code"
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Reservation Summary Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto text-left p-4 rounded-xl bg-white/5 border border-white/5 mb-8">
                  <div>
                    <span className="text-[10px] uppercase text-ivory/50 block font-sans">Date</span>
                    <span className="text-xs text-ivory font-medium">
                      {formatDate(confirmedReservation.reservation_date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ivory/50 block font-sans">Time</span>
                    <span className="text-xs text-ivory font-medium">
                      {formatTime(confirmedReservation.reservation_time)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ivory/50 block font-sans">Guests</span>
                    <span className="text-xs text-ivory font-medium">
                      {confirmedReservation.guest_count} Persons
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ivory/50 block font-sans">Salon</span>
                    <span className="text-xs text-ivory font-medium capitalize">
                      {confirmedReservation.seating_preference?.replace("-", " ")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmedReservation(null)}
                  className="px-8 py-3 rounded-full border border-gold/40 text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all"
                >
                  Book Another Table
                </button>
              </motion.div>
            ) : (
              /* Active Reservation Form */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Step 1: Date, Time & Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Date Input */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={todayStr}
                        {...register("reservation_date")}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                    {errors.reservation_date && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.reservation_date.message}</p>
                    )}
                  </div>

                  {/* Guests Select */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                      Guests
                    </label>
                    <div className="relative">
                      <select
                        {...register("guest_count", { valueAsNumber: true })}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory focus:border-gold focus:outline-none transition-colors appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                      <Users className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.guest_count && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.guest_count.message}</p>
                    )}
                  </div>

                  {/* Seating Preference */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                      Dining Area
                    </label>
                    <select
                      {...register("seating_preference")}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory focus:border-gold focus:outline-none transition-colors appearance-none"
                    >
                      {SEATING_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 2: Time Slot Pills */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-3 font-sans">
                    Available Seating Times
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setValue("reservation_time", slot, { shouldValidate: true })}
                          className={`py-2.5 px-2 rounded-xl text-xs font-mono transition-all text-center ${
                            isSelected
                              ? "bg-gold text-black font-bold shadow-[0_0_15px_rgba(200,169,106,0.4)]"
                              : "bg-[#1e1e1e] text-ivory/80 hover:bg-white/10 border border-white/5"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {errors.reservation_time && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.reservation_time.message}</p>
                  )}
                </div>

                {/* Step 3: Guest Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                      Primary Guest Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Lady Vivienne Sterling"
                        {...register("customer_name")}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      />
                      <User className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.customer_name && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="guest@luxury.com"
                        {...register("customer_email")}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      />
                      <Mail className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.customer_email && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.customer_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                      Mobile Telephone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register("customer_phone")}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      />
                      <Phone className="w-4 h-4 text-gold/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.customer_phone && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.customer_phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-2 font-sans">
                    Dietary Allergies & Special Celebrations (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Kindly notify us of any shellfish, nut, or gluten sensitivities, or if this evening commemorates an anniversary or milestone..."
                    {...register("special_requests")}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none transition-colors resize-none"
                  />
                  {errors.special_requests && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.special_requests.message}</p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-ivory/50 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>Instant encrypted reservation with direct host confirmation</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-gold text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold-light hover:shadow-[0_0_30px_rgba(200,169,106,0.4)] transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Securing Table..." : "Confirm Reservation"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar: Lookup Existing Reservation + Policies */}
          <div className="lg:col-span-4 space-y-8">
            {/* Lookup Card */}
            <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans block mb-2">
                Existing Patron
              </span>
              <h3 className="font-serif-luxury text-2xl text-ivory mb-2">
                Lookup Reservation
              </h3>
              <p className="font-sans text-xs text-ivory-muted mb-6 leading-relaxed">
                Check table allocation and current reservation status with your reference code.
              </p>

              <form onSubmit={handleLookup} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="e.g. AUR-2026-X8K2"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono uppercase text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gold text-black text-xs font-medium hover:bg-gold-light transition-colors"
                  >
                    {isSearching ? "..." : <Search className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {lookupError && (
                  <p className="text-[11px] text-red-400 mt-1">{lookupError}</p>
                )}

                {lookupResult && (
                  <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-xs space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-gold font-bold">{lookupResult.reference_code}</span>
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-gold text-black font-semibold">
                        {lookupResult.status}
                      </span>
                    </div>
                    <p className="text-ivory font-medium">{lookupResult.customer_name}</p>
                    <p className="text-ivory/60 text-[11px]">
                      {formatDate(lookupResult.reservation_date)} at {formatTime(lookupResult.reservation_time)} ({lookupResult.guest_count} Guests)
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Dining Etiquette & Cancellation Policy */}
            <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-4 text-xs font-sans">
              <h4 className="font-serif-luxury text-xl text-ivory">Dining Etiquette</h4>
              <div className="space-y-3 text-ivory-muted leading-relaxed font-light">
                <p>
                  <strong className="text-ivory">Attire:</strong> Elegant evening attire. Jackets recommended for gentlemen.
                </p>
                <p>
                  <strong className="text-ivory">Arrival:</strong> We reserve your table for 15 minutes past scheduled seating time before offering it to our waitlist.
                </p>
                <p>
                  <strong className="text-ivory">Cancellation:</strong> Cancellations permitted up to 24 hours prior to reservation without charge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

