import { Router } from "express";

import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../validations/cart.validation.js";

const router = Router();


// ========================================
// GET CART
// ========================================

router.get(
  "/",
  authenticate,
  getCart,
);


// ========================================
// ADD ITEM
// ========================================

router.post(
  "/items",
  authenticate,
  validate(addCartItemSchema),
  addItemToCart,
);


// ========================================
// UPDATE ITEM
// ========================================

router.patch(
  "/items/:id",
  authenticate,
  validate(updateCartItemSchema),
  updateCartItem,
);


// ========================================
// REMOVE ITEM
// ========================================

router.delete(
  "/items/:id",
  authenticate,
  removeCartItem,
);


// ========================================
// CLEAR CART
// ========================================

router.delete(
  "/",
  authenticate,
  clearCart,
);


export default router;