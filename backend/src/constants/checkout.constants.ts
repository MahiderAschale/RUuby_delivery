import { Prisma } from "../generated/prisma/client.js";

export const DEFAULT_DELIVERY_FEE =
  new Prisma.Decimal(50);

export const DEFAULT_DISCOUNT =
  new Prisma.Decimal(0);