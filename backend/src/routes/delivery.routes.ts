import { Router } from "express";

import {
  assignRider,
  getRiderDeliveries,
  acceptDelivery,
  rejectDelivery,
  arriveAtRestaurant,
  pickupOrder,
  startDelivery,
  completeDelivery,
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
// RIDER ARRIVES AT RESTAURANT

router.patch(
  "/:id/arrive",
  authenticate,
  authorize("RIDER"),
  validate(deliveryIdParamSchema),
  arriveAtRestaurant,
);

// RIDER PICKS UP ORDER

router.patch(
  "/:id/pickup",
  authenticate,
  authorize("RIDER"),
  validate(deliveryIdParamSchema),
  pickupOrder,
);

// RIDER STARTS DELIVERY

router.patch(
  "/:id/on-the-way",
  authenticate,
  authorize("RIDER"),
  validate(deliveryIdParamSchema),
  startDelivery,
);

// RIDER COMPLETES DELIVERY

router.patch(
  "/:id/delivered",
  authenticate,
  authorize("RIDER"),
  validate(deliveryIdParamSchema),
  completeDelivery,
);
export default router;