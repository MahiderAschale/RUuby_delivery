import { z } from "zod";

export const orderTrackingParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});