import type { Request, Response } from "express";
import * as customerRestaurantService from "../services/customer-restaurant.service.js";

// ========================================
// GET RESTAURANTS
// ========================================

export const getRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurants =
      await customerRestaurantService.getRestaurants({
        search:
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,

        city:
          typeof req.query.city === "string"
            ? req.query.city
            : undefined,

        subCity:
          typeof req.query.subCity === "string"
            ? req.query.subCity
            : undefined,
      });

    res.status(200).json({
      success: true,
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error(
      "Get customer restaurants error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to get restaurants",
    });
  }
};


// ========================================
// GET RESTAURANT BY SLUG
// ========================================

export const getRestaurantBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const restaurant =
      await customerRestaurantService.getRestaurantBySlug(
        slug,
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
    console.error(
      "Get customer restaurant error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to get restaurant",
    });
  }
};