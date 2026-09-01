import { z } from "zod";

// ========================================
// CREATE ORDER
// ========================================

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid address ID"),
  }),
});