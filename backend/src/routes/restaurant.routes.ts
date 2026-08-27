import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createRestaurant,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDashboard,
  openRestaurant,
  closeRestaurant,
} from "../controllers/restaurant.controller.js";

import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "../validations/restaurant.validation.js";

const router = Router();


// ========================================
// CREATE RESTAURANT
// ========================================

router.post(
  "/",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate(createRestaurantSchema),
  createRestaurant,
);


// ========================================
// GET MY RESTAURANTS
// ========================================

router.get(
  "/my",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  getMyRestaurants,
);


// ========================================
// RESTAURANT DASHBOARD
// ========================================

router.get(
  "/:id/dashboard",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  getRestaurantDashboard,
);


// ========================================
// OPEN RESTAURANT
// ========================================

router.patch(
  "/:id/open",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  openRestaurant,
);


// ========================================
// CLOSE RESTAURANT
// ========================================

router.patch(
  "/:id/close",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  closeRestaurant,
);


// ========================================
// UPDATE RESTAURANT
// ========================================

router.patch(
  "/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate(updateRestaurantSchema),
  updateRestaurant,
);


// ========================================
// DELETE RESTAURANT
// ========================================

router.delete(
  "/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  deleteRestaurant,
);


// ========================================
// GET MY RESTAURANT BY ID
// ========================================

router.get(
  "/my/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  getRestaurantById,
);


export default router;