import type { Request, Response } from "express";
import * as cartService from "../services/cart.service.js";

// ========================================
// GET CART
// ========================================

export const getCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cart = await cartService.getCart(
      req.user!.userId,
    );

    if (!cart) {
      res.status(200).json({
        success: true,
        data: {
          cart: null,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};


// ========================================
// ADD ITEM
// ========================================

export const addItemToCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cartItem = await cartService.addItemToCart(
      req.user!.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        cartItem,
      },
    });
  } catch (error) {
    console.error("Add cart item error:", error);

    if (error instanceof Error) {
      const notFoundErrors = [
        "Menu item not found",
      ];

      if (notFoundErrors.includes(error.message)) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      const conflictErrors = [
        "Restaurant is not available for ordering",
        "Restaurant is currently closed",
        "Menu category is not available",
        "Menu item is currently unavailable",
        "Your cart contains items from another restaurant",
        "Maximum quantity for an item is 20",
      ];

      if (conflictErrors.includes(error.message)) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};


// ========================================
// UPDATE ITEM
// ========================================

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cartItemId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const cartItem =
      await cartService.updateCartItem(
        req.user!.userId,
        cartItemId,
        req.body.quantity,
      );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: {
        cartItem,
      },
    });
  } catch (error) {
    console.error(
      "Update cart item error:",
      error,
    );

    if (error instanceof Error) {
      if (
        error.message === "Cart item not found"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message ===
          "Restaurant is not available for ordering" ||
        error.message ===
          "Restaurant is currently closed" ||
        error.message ===
          "Menu item is currently unavailable"
      ) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};


// ========================================
// REMOVE ITEM
// ========================================

export const removeCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cartItemId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await cartService.removeCartItem(
      req.user!.userId,
      cartItemId,
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error(
      "Remove cart item error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "Cart item not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });
  }
};


// ========================================
// CLEAR CART
// ========================================

export const clearCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await cartService.clearCart(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};