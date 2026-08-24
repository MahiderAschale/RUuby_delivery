import { z } from "zod";

export const restaurantListQuerySchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    search: z
      .string()
      .trim()
      .max(100, "Search text is too long")
      .optional(),

    city: z
      .string()
      .trim()
      .max(100)
      .optional(),

    subCity: z
      .string()
      .trim()
      .max(100)
      .optional(),
  }),
});

export const restaurantSlugParamSchema = z.object({
  body: z.object({}),

  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, "Restaurant slug is required"),
  }),

  query: z.object({}),
});