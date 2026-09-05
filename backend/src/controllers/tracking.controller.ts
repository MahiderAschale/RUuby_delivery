import type { Request, Response } from "express";
import * as trackingService from "../services/tracking.service.js";

// GET ORDER TRACKING

export const getOrderTracking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const tracking =
      await trackingService.getOrderTracking(
        req.user.userId,
        orderId,
      );

    res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (error) {
    console.error(
      "Get order tracking error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "Order not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to get order tracking",
    });
  }
};