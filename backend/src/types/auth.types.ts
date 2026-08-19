import type { Role } from "../generated/prisma/client.js";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  role: Role;
}