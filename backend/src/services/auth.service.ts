import prisma from "../config/database.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  comparePassword,
  hashPassword,
} from "../utils/password.js";
import type {
  LoginInput,
  RegisterInput,
} from "../types/auth.types.js";

export const register = async (
  input: RegisterInput,
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: input.phone },
        ...(input.email
          ? [{ email: input.email }]
          : []),
      ],
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email,
      passwordHash,

      // Public registration always creates customers.
      role: "CUSTOMER",
    },
  });

  const accessToken = generateAccessToken(
    user.id,
    user.role,
  );

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    accessToken,
  };
};

export const login = async (
  input: LoginInput,
) => {
  const user = await prisma.user.findUnique({
    where: {
      phone: input.phone,
    },
  });

  if (!user) {
    throw new Error("Invalid phone number or password");
  }

  const passwordIsValid = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordIsValid) {
    throw new Error("Invalid phone number or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User account is not active");
  }

  const accessToken = generateAccessToken(
    user.id,
    user.role,
  );

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    accessToken,
  };
};