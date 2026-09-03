import { Router } from "express";

import {
  assignRider,
  getRiderDeliveries,
  acceptDelivery,
  rejectDelivery,
} from "../controllers/delivery.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  orderIdParamSchema,
  deliveryIdParamSchema,
} from "../validations/delivery.validation.js";

const router = Router();

// ADMIN ASSIGNS RIDER

router.post(
  "/orders/:orderId/assign",
  authenticate,
  authorize("ADMIN"),
  validate(orderIdParamSchema),
  assignRider,
);

// RIDER'S ACTIVE DELIVERIES

router.get(
  "/my",
  authenticate,
  authorize("RIDER"),
  getRiderDeliveries,
);

// RIDER ACCEPTS

router.patch(
  "/:id/accept",
  authenticate,
  authorize("RIDER"),
  validate(deliveryIdParamSchema),
  acceptDelivery,
);

// RIDER REJECTS

router.patch(
  "/:id/reject",
  authenticate,
  authorize("RIDER"),
  validate(deliveryIdParamSchema),
  rejectDelivery,
);

export default router;