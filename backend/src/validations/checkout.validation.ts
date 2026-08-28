import { z } from "zod";

// ========================================
// CHECKOUT PREVIEW
// ========================================

export const checkoutPreviewSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid address ID"),

    paymentMethod: z.enum([
      "CHAPA" 
    ]),
  }),
});