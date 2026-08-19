import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
  console.log("Database connected successfully");
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log("Database disconnected");
};

export default prisma;