import { z } from "zod";

export const createMenuItemSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Food name must be at least 2 characters")
      .max(100, "Food name must not exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),

    price: z.coerce
      .number()
      .positive("Price must be greater than 0"),

    imageUrl: z
      .string()
      .url("Invalid image URL")
      .optional(),

    isAvailable: z
      .boolean()
      .optional(),
  }),

  params: z.object({
    categoryId: z.string().uuid("Invalid category ID"),
  }),

  query: z.object({}),
});

export const updateMenuItemSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Food name must be at least 2 characters")
      .max(100, "Food name must not exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),

    price: z.coerce
      .number()
      .positive("Price must be greater than 0")
      .optional(),

    imageUrl: z
      .string()
      .url("Invalid image URL")
      .optional(),

    isAvailable: z
      .boolean()
      .optional(),
  }),

  params: z.object({
    id: z.string().uuid("Invalid menu item ID"),
  }),

  query: z.object({}),
});