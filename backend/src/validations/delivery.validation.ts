import { z } from "zod";

export const orderIdParamSchema = z.object({
  params: z.object({
    orderId: z.string().uuid(),
  }),
});

export const deliveryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});