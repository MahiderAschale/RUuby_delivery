import { Router } from "express";

import {
  createRiderProfile,
  getMyRiderProfile,
  updateRiderProfile,
  goOnline,
  goOffline,
  updateRiderLocation,
} from "../controllers/rider.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  authorize,
} from "../middleware/role.middleware.js";

import {
  validate,
} from "../middleware/validate.middleware.js";

import {
  createRiderSchema,
  updateRiderSchema,
  updateRiderLocationSchema,
} from "../validations/rider.validation.js";

const router = Router();

// CREATE RIDER PROFILE
router.post(
  "/profile",
  authenticate,
  authorize("RIDER"),
  validate(createRiderSchema),
  createRiderProfile,
);

// GET MY RIDER PROFILE
router.get(
  "/profile",
  authenticate,
  authorize("RIDER"),
  getMyRiderProfile,
);

// UPDATE RIDER PROFILE
router.patch(
  "/profile",
  authenticate,
  authorize("RIDER"),
  validate(updateRiderSchema),
  updateRiderProfile,
);

// GO ONLINE
router.patch(
  "/online",
  authenticate,
  authorize("RIDER"),
  goOnline,
);

// GO OFFLINE
router.patch(
  "/offline",
  authenticate,
  authorize("RIDER"),
  goOffline,
);

// UPDATE LOCATION
router.patch(
  "/location",
  authenticate,
  authorize("RIDER"),
  validate(updateRiderLocationSchema),
  updateRiderLocation,
);

export default router;