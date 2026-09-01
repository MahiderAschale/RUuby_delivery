import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createOrder } from "../controllers/order.controller.js";

import { createOrderSchema } from "../validations/order.validation.js";

const router = Router();

// CREATE ORDER

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  createOrder,
);

export default router;