import { z } from "zod";

// ========================================
// ADD CART ITEM
// ========================================

export const addCartItemSchema = z.object({
  body: z.object({
    menuItemId: z.string().uuid("Invalid menu item ID"),

    quantity: z
      .coerce
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(20, "Quantity cannot exceed 20"),
  }),

  params: z.object({}),
  query: z.object({}),
});


// ========================================
// UPDATE CART ITEM
// ========================================

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z
      .coerce
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(20, "Quantity cannot exceed 20"),
  }),

  params: z.object({
    id: z.string().uuid("Invalid cart item ID"),
  }),

  query: z.object({}),
});