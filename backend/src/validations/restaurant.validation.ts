import { z } from "zod";

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Restaurant name must be at least 2 characters")
      .max(100, "Restaurant name must not exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits",
      ),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .optional(),

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

    latitude: z.coerce
      .number()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude"),

    longitude: z.coerce
      .number()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude"),

    logoUrl: z
      .string()
      .url("Invalid logo URL")
      .optional(),

    coverImageUrl: z
      .string()
      .url("Invalid cover image URL")
      .optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const updateRestaurantSchema = z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, "Restaurant name must be at least 2 characters")
        .max(100, "Restaurant name must not exceed 100 characters")
        .optional(),
  
      description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
  
      phone: z
        .string()
        .trim()
        .regex(
          /^\d{10}$/,
          "Phone number must contain exactly 10 digits",
        )
        .optional(),
  
      email: z
        .string()
        .trim()
        .email("Invalid email address")
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
  
      latitude: z.coerce
        .number()
        .min(-90)
        .max(90)
        .optional(),
  
      longitude: z.coerce
        .number()
        .min(-180)
        .max(180)
        .optional(),
  
      logoUrl: z
        .string()
        .url("Invalid logo URL")
        .optional(),
  
      coverImageUrl: z
        .string()
        .url("Invalid cover image URL")
        .optional(),
    }),
  
    params: z.object({
      id: z.string().uuid("Invalid restaurant ID"),
    }),
  
    query: z.object({}),
  });