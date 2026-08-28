import type { Request, Response } from "express";
import * as checkoutService from "../services/checkout.service.js";

// ========================================
// CHECKOUT PREVIEW
// ========================================

export const previewCheckout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      addressId,
      paymentMethod,
    } = req.body;

    const checkout =
      await checkoutService.previewCheckout(
        req.user!.userId,
        addressId,
        paymentMethod,
      );

    res.status(200).json({
      success: true,
      data: {
        checkout,
      },
    });
  } catch (error) {
    console.error(
      "Checkout preview error:",
      error,
    );

    if (error instanceof Error) {
      const notFoundErrors = [
        "Address not found",
      ];

      if (notFoundErrors.includes(error.message)) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      const conflictErrors = [
        "Cart is empty",
        "Restaurant is not available for ordering",
        "Restaurant is currently closed",
        "Cart contains an invalid menu item",
      ];

      if (conflictErrors.includes(error.message)) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "is not available",
        ) ||
        error.message.includes(
          "is currently unavailable",
        )
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
      message: "Failed to preview checkout",
    });
  }
};