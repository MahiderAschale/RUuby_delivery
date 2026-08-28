import { z } from "zod";

// ========================================
// CREATE ADDRESS
// ========================================

export const createAddressSchema = z.object({
  body: z.object({
    label: z
      .string()
      .trim()
      .min(2, "Address label must be at least 2 characters")
      .max(50, "Address label must not exceed 50 characters"),

    address: z
      .string()
      .trim()
      .min(3, "Address is required")
      .max(255, "Address must not exceed 255 characters"),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100, "City must not exceed 100 characters"),

    subCity: z
      .string()
      .trim()
      .max(100, "Sub-city must not exceed 100 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits",
      )
      .optional(),

    latitude: z.coerce
      .number()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude"),

    longitude: z.coerce
      .number()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude"),

    isDefault: z.boolean().optional(),
  }),
});


// ========================================
// UPDATE ADDRESS
// ========================================

export const updateAddressSchema = z.object({
  body: z.object({
    label: z
      .string()
      .trim()
      .min(2, "Address label must be at least 2 characters")
      .max(50, "Address label must not exceed 50 characters")
      .optional(),

    address: z
      .string()
      .trim()
      .min(3, "Address is required")
      .max(255, "Address must not exceed 255 characters")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100, "City must not exceed 100 characters")
      .optional(),

    subCity: z
      .string()
      .trim()
      .max(100, "Sub-city must not exceed 100 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits",
      )
      .optional(),

    latitude: z.coerce
      .number()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude")
      .optional(),

    longitude: z.coerce
      .number()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude")
      .optional(),

    isDefault: z.boolean().optional(),
  }),

  params: z.object({
    id: z.string().uuid("Invalid address ID"),
  }),
});