import { z } from "zod";

export const reservationFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  customer_email: z.string().email("Please enter a valid email address"),
  customer_phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+0-9\s()-]+$/, "Invalid phone number format"),
  reservation_date: z.string().refine((dateStr) => {
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Reservation date cannot be in the past"),
  reservation_time: z
    .string()
    .min(1, "Please select a dining time slot"),
  guest_count: z
    .number({ invalid_type_error: "Please enter guest count" })
    .min(1, "Minimum 1 guest")
    .max(12, "For parties larger than 12, please contact private dining directly"),
  seating_preference: z.enum(["main-dining", "chef-counter", "private-salon", "terrace"]).optional().default("main-dining"),
  special_requests: z.string().max(500, "Special requests must not exceed 500 characters").optional(),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;

export const menuItemSchema = z.object({
  name: z.string().min(2, "Dish name required"),
  description: z.string().min(5, "Description required"),
  price: z.number().positive("Price must be positive"),
  category_id: z.string().min(1, "Category is required"),
  image_url: z.string().url("Valid image URL required"),
  is_available: z.boolean().default(true),
  is_signature: z.boolean().default(false),
  dietary_tags: z.array(z.string()).default([]),
  wine_pairing: z.string().optional().nullable(),
  calories: z.number().positive().optional().nullable(),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

