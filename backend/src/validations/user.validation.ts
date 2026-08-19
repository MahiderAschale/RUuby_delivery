import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits",
      )
      .optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "New password must not exceed 100 characters"),
  }),

  params: z.object({}),
  query: z.object({}),
});