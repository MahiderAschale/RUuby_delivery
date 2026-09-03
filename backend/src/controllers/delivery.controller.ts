import type { Request, Response } from "express";
import * as deliveryService from "../services/delivery.service.js";

// ASSIGN RIDER

export const assignRider = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const delivery =
      await deliveryService.assignRiderToOrder(
        orderId,
      );

    res.status(200).json({
      success: true,
      message: "Rider assigned successfully",
      data: delivery,
    });
  } catch (error) {
    console.error("Assign rider error:", error);

    if (error instanceof Error) {
      if (
        error.message === "Order not found" ||
        error.message === "Delivery not found"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "No available riders",
        ) ||
        error.message.includes(
          "No available rider",
        ) ||
        error.message.includes(
          "already has a rider",
        ) ||
        error.message.includes(
          "Only orders ready for pickup",
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
      message: "Failed to assign rider",
    });
  }
};

// GET RIDER DELIVERIES

export const getRiderDeliveries = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User information is missing",
      });
      return;
    }
    const userId = req.user.userId;

    const deliveries =
      await deliveryService.getRiderDeliveries(
        userId,
      );

    res.status(200).json({
      success: true,
      data: {
        deliveries,
      },
    });
  } catch (error) {
    console.error(
      "Get rider deliveries error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to get rider deliveries",
    });
  }
};

// ACCEPT DELIVERY

export const acceptDelivery = async (
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
    
    const userId = req.user.userId;

    const deliveryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const delivery =
      await deliveryService.acceptDelivery(
        userId,
        deliveryId,
      );

    res.status(200).json({
      success: true,
      message: "Delivery accepted successfully",
      data: {
        delivery,
      },
    });
  } catch (error) {
    console.error(
      "Accept delivery error:",
      error,
    );

    if (error instanceof Error) {
      if (
        error.message ===
        "Rider profile not found"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message === "Delivery not found"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "not assigned to you",
        ) ||
        error.message.includes(
          "Only assigned deliveries",
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
      message: "Failed to accept delivery",
    });
  }
};

// REJECT DELIVERY

export const rejectDelivery = async (
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
    
    const userId = req.user.userId;

    const deliveryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const delivery =
      await deliveryService.rejectDelivery(
        userId,
        deliveryId,
      );

    res.status(200).json({
      success: true,
      message: "Delivery rejected successfully",
      data: {
        delivery,
      },
    });
  } catch (error) {
    console.error(
      "Reject delivery error:",
      error,
    );

    if (error instanceof Error) {
      if (
        error.message ===
          "Rider profile not found" ||
        error.message === "Delivery not found"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "not assigned to you",
        ) ||
        error.message.includes(
          "Only assigned deliveries",
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
      message: "Failed to reject delivery",
    });
  }
};