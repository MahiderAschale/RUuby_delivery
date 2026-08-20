import { z } from "zod";


// for restaurant approval 
export const restaurantStatusQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    status: z
      .enum([
        "PENDING",
        "APPROVED",
        "SUSPENDED",
        "REJECTED",
      ])
      .optional(),
  }),
});

export const restaurantIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid("Invalid restaurant ID"),
  }),
  query: z.object({}),
});