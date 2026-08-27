import bcrypt from "bcrypt";
import prisma from "../src/config/database.js";

const seed = async () => {
  const adminPassword = "AdminPassword123";

  const passwordHash = await bcrypt.hash(
    adminPassword,
    12,
  );

  const admin = await prisma.user.upsert({
    where: {
      phone: "0900000001",
    },
    update: {
      firstName: "RUuby",
      lastName: "Admin",
      email: "admin@ruuby.com",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      firstName: "RUuby",
      lastName: "Admin",
      phone: "0900000001",
      email: "admin@ruuby.com",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Admin created:", {
    id: admin.id,
    phone: admin.phone,
    role: admin.role,
  });
};

seed()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });