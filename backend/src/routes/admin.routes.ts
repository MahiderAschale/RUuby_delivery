import { Router } from "express";


// for restaurant approval
import {
  getRestaurants,
  getRestaurantById,
  approveRestaurant,
  rejectRestaurant,
  suspendRestaurant,
  restoreRestaurant,
  getRiders,
  getRiderById,
  verifyRider,
  unverifyRider,
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  restaurantStatusQuerySchema,
  restaurantIdParamSchema,
} from "../validations/admin.validation.js";

const router = Router();

router.get(
  "/restaurants",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantStatusQuerySchema),
  getRestaurants,
);

router.get(
  "/restaurants/:id",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  getRestaurantById,
);

router.patch(
  "/restaurants/:id/approve",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  approveRestaurant,
);

router.patch(
  "/restaurants/:id/reject",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  rejectRestaurant,
);

router.patch(
  "/restaurants/:id/suspend",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  suspendRestaurant,
);

router.patch(
  "/restaurants/:id/restore",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  restoreRestaurant,
);


// RIDER MANAGEMENT

router.get(
  "/riders",
  authenticate,
  authorize("ADMIN"),
  getRiders,
);

router.get(
  "/riders/:id",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  getRiderById,
);

router.patch(
  "/riders/:id/verify",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  verifyRider,
);

router.patch(
  "/riders/:id/unverify",
  authenticate,
  authorize("ADMIN"),
  validate(restaurantIdParamSchema),
  unverifyRider,
);

export default router;