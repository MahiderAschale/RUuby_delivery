import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/user.controller.js";

import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  getCurrentUser,
);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateProfile,
);

router.patch(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);

router.delete(
  "/me",
  authenticate,
  deleteAccount,
);

export default router;