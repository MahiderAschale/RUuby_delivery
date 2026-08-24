import { Router } from "express";

import {
  getRestaurants,
  getRestaurantBySlug,
} from "../controllers/customer-restaurant.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  restaurantListQuerySchema,
  restaurantSlugParamSchema,
} from "../validations/customer.validation.js";

const router = Router();

// ========================================
// RESTAURANT DISCOVERY
// ========================================

router.get(
  "/restaurants",
  authenticate,
  validate(restaurantListQuerySchema),
  getRestaurants,
);

router.get(
  "/restaurants/:slug",
  authenticate,
  validate(restaurantSlugParamSchema),
  getRestaurantBySlug,
);

export default router;