import { z } from "zod";

// ========================================
// RESTAURANT LIST QUERY
// ========================================

export const restaurantListQuerySchema = z.object({
  query: z.object({
    search: z
      .string()
      .trim()
      .max(100, "Search text is too long")
      .optional(),

    city: z
      .string()
      .trim()
      .max(100, "City is too long")
      .optional(),

    subCity: z
      .string()
      .trim()
      .max(100, "Sub-city is too long")
      .optional(),
  }),
});


// ========================================
// RESTAURANT SLUG PARAM
// ========================================

export const restaurantSlugParamSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, "Restaurant slug is required"),
  }),
});