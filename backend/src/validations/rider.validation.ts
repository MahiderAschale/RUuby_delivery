import { z } from "zod";

// CREATE RIDER PROFILE
export const createRiderSchema = z.object({
  body: z.object({
    vehicleType: z.enum([
      "MOTORCYCLE",
      "BICYCLE",
      "CAR",
    ]),

    vehicleNumber: z
      .string()
      .trim()
      .max(50, "Vehicle number is too long")
      .optional(),

    licenseNumber: z
      .string()
      .trim()
      .max(100, "License number is too long")
      .optional(),

    profileImageUrl: z
      .string()
      .url("Invalid profile image URL")
      .optional(),
  }),
});

// UPDATE RIDER PROFILE
export const updateRiderSchema = z.object({
  body: z.object({
    vehicleType: z
      .enum([
        "MOTORCYCLE",
        "BICYCLE",
        "CAR",
      ])
      .optional(),

    vehicleNumber: z
      .string()
      .trim()
      .max(50, "Vehicle number is too long")
      .optional(),

    licenseNumber: z
      .string()
      .trim()
      .max(100, "License number is too long")
      .optional(),

    profileImageUrl: z
      .string()
      .url("Invalid profile image URL")
      .optional(),
  }),
});

// UPDATE RIDER LOCATION
export const updateRiderLocationSchema = z.object({
  body: z.object({
    latitude: z.coerce
      .number()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude"),

    longitude: z.coerce
      .number()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude"),
  }),
});