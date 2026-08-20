import { Router } from "express";

import {
  createMenuItem,
  getCategoryItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu-item.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "../validations/menu.validation.js";

const router = Router();

// ========================================
// CREATE MENU ITEM
// ========================================

router.post(
  "/categories/:categoryId/items",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate(createMenuItemSchema),
  createMenuItem,
);


// ========================================
// GET CATEGORY ITEMS
// ========================================

router.get(
  "/categories/:categoryId/items",
  authenticate,
  getCategoryItems,
);


// ========================================
// GET MENU ITEM
// ========================================

router.get(
  "/menu-items/:id",
  authenticate,
  getMenuItemById,
);


// ========================================
// UPDATE MENU ITEM
// ========================================

router.patch(
  "/menu-items/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate(updateMenuItemSchema),
  updateMenuItem,
);


// ========================================
// DELETE MENU ITEM
// ========================================

router.delete(
  "/menu-items/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  deleteMenuItem,
);

export default router;