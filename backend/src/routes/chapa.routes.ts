import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  initializeChapaPayment,
  verifyChapaPayment,
} from "../controllers/chapa.controller.js";

import { checkoutPreviewSchema } from "../validations/checkout.validation.js";

const router = Router();


// ========================================
// INITIALIZE CHAPA PAYMENT
// ========================================

router.post(
  "/initialize",
  authenticate,
  validate(checkoutPreviewSchema),
  initializeChapaPayment,
);


// ========================================
// VERIFY CHAPA PAYMENT
// ========================================

router.get(
  "/verify/:txRef",
  authenticate,
  verifyChapaPayment,
);

export default router;