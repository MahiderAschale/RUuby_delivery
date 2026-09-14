import { Router } from "express";

import { authenticate }
  from "../middleware/auth.middleware.js";

import { validate }
  from "../middleware/validate.middleware.js";

import {
  initializePayment,
  verifyPayment,
  chapaCallback,
} from "../controllers/chapa.controller.js";

import {
  initializeChapaSchema,
} from "../validations/chapa.validation.js";


const router = Router();


// ========================================
// INITIALIZE CHAPA PAYMENT
// ========================================

router.post(
  "/initialize",

  authenticate,

  validate(
    initializeChapaSchema,
  ),

  initializePayment,
);


// ========================================
// VERIFY PAYMENT
// ========================================

router.get(
  "/verify/:txRef",

  authenticate,

  verifyPayment,
);


// ========================================
// CHAPA CALLBACK
// ========================================

router.get(
  "/callback",

  chapaCallback,
);


export default router;