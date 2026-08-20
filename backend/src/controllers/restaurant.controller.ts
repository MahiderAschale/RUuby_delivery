import type { Request, Response } from "express";
import * as restaurantService from "../services/restaurant.service.js";

// ========================================
// CREATE RESTAURANT
// ========================================

export const createRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.user!.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
};


// ========================================
// GET MY RESTAURANTS
// ========================================

export const getMyRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurants = await restaurantService.getMyRestaurants(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error("Get my restaurants error:", error);

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
      await restaurantService.getRestaurantById(restaurantId);

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
    console.error("Get restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get restaurant",
    });
  }
};


// ========================================
// UPDATE RESTAURANT
// ========================================

export const updateRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const restaurant = await restaurantService.updateRestaurant(
      restaurantId,
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    if (
      error instanceof Error &&
      error.message === "Restaurant not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
    });
  }
};


// ========================================
// DELETE RESTAURANT
// ========================================

export const deleteRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await restaurantService.deleteRestaurant(
      restaurantId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);

    if (
      error instanceof Error &&
      error.message === "Restaurant not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
    });
  }
};