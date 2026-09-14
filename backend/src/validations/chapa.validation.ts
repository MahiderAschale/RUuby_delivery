import { z } from "zod";


// ========================================
// INITIALIZE CHAPA PAYMENT
// ========================================

export const initializeChapaSchema =
  z.object({
    body: z.object({
      orderId: z.string().uuid(
        "Invalid order ID",
      ),
    }),
  });