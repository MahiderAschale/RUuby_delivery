import type { Request, Response } from "express";
import * as adminService from "../services/admin.service.js";


// for restaurant approval
// ========================================
// GET RESTAURANTS
// ========================================

export const getRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const status = req.query.status as
      | "PENDING"
      | "APPROVED"
      | "SUSPENDED"
      | "REJECTED"
      | undefined;

    const restaurants =
      await adminService.getRestaurants(status);

    res.status(200).json({
      success: true,
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error("Get admin restaurants error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get restaurants",
    });
  }
};


// ========================================
// GET RESTAURANT BY ID
// ========================================

export const getRestaurantById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const restaurant =
      await adminService.getRestaurantById(
        restaurantId,
      );

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Get admin restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get restaurant",
    });
  }
};


// ========================================
// APPROVE
// ========================================

export const approveRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const restaurant =
      await adminService.approveRestaurant(
        restaurantId,
      );

    res.status(200).json({
      success: true,
      message: "Restaurant approved successfully",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Approve restaurant error:", error);

    if (error instanceof Error) {
      if (error.message === "Restaurant not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message === "Restaurant is already approved" ||
        error.message.includes(
          "must be restored before approval",
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
      message: "Failed to approve restaurant",
    });
  }
};


// ========================================
// REJECT
// ========================================

export const rejectRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const restaurant =
      await adminService.rejectRestaurant(
        restaurantId,
      );

    res.status(200).json({
      success: true,
      message: "Restaurant rejected successfully",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Reject restaurant error:", error);

    if (error instanceof Error) {
      if (error.message === "Restaurant not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "cannot be rejected directly",
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
      message: "Failed to reject restaurant",
    });
  }
};


// ========================================
// SUSPEND
// ========================================

export const suspendRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const restaurant =
      await adminService.suspendRestaurant(
        restaurantId,
      );

    res.status(200).json({
      success: true,
      message: "Restaurant suspended successfully",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Suspend restaurant error:", error);

    if (
      error instanceof Error &&
      error.message === "Restaurant not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to suspend restaurant",
    });
  }
};


// ========================================
// RESTORE
// ========================================

export const restoreRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const restaurant =
      await adminService.restoreRestaurant(
        restaurantId,
      );

    res.status(200).json({
      success: true,
      message: "Restaurant restored successfully",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Restore restaurant error:", error);

    if (error instanceof Error) {
      if (error.message === "Restaurant not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "Only suspended restaurants",
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
      message: "Failed to restore restaurant",
    });
  }
};