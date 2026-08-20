import { Router } from "express";


// for restaurant approval
import {
  getRestaurants,
  getRestaurantById,
  approveRestaurant,
  rejectRestaurant,
  suspendRestaurant,
  restoreRestaurant,
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

export default router;