import type { Request, Response } from "express";
import * as orderService from "../services/order.service.js";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { addressId } = req.body;

    const result = await orderService.createOrder(
      req.user!.userId,
      addressId,
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create order error:", error);

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
      message: "Failed to create order",
    });
  }
};