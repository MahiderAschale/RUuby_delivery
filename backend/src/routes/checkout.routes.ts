import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { previewCheckout } from "../controllers/checkout.controller.js";

import { checkoutPreviewSchema } from "../validations/checkout.validation.js";

const router = Router();

// ========================================
// CHECKOUT PREVIEW
// ========================================

router.post(
  "/preview",
  authenticate,
  validate(checkoutPreviewSchema),
  previewCheckout,
);

export default router;