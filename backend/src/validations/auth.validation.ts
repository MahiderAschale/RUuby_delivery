import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),

    phone: z
      .string()
      .trim()
      .min(9, "Phone number is invalid")
      .max(11, "Phone number is invalid"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .trim()
      .min(9, "Phone number is invalid")
      .max(20, "Phone number is invalid"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});