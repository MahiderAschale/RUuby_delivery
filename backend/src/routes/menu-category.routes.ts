import { Router } from "express";

import {
  createCategory,
  getRestaurantCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/menu-category.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// ========================================
// RESTAURANT MENU CATEGORIES
// ========================================

router.post(
  "/restaurants/:restaurantId/categories",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  createCategory,
);

router.get(
  "/restaurants/:restaurantId/categories",
  authenticate,
  getRestaurantCategories,
);

router.get(
  "/categories/:id",
  authenticate,
  getCategoryById,
);

router.patch(
  "/categories/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  updateCategory,
);

router.delete(
  "/categories/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  deleteCategory,
);

export default router;