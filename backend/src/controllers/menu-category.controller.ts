import type { Request, Response } from "express";
import * as categoryService from "../services/menu-category.service.js";

// ========================================
// CREATE CATEGORY
// ========================================

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.restaurantId)
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const category = await categoryService.createCategory(
      restaurantId,
      req.user!.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);

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
      message: "Failed to create category",
    });
  }
};


// ========================================
// GET RESTAURANT CATEGORIES
// ========================================

export const getRestaurantCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(req.params.restaurantId)
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const categories =
      await categoryService.getRestaurantCategories(
        restaurantId,
      );

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get categories",
    });
  }
};


// ========================================
// GET CATEGORY BY ID
// ========================================

export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const category =
      await categoryService.getCategoryById(categoryId);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get category",
    });
  }
};


// ========================================
// UPDATE CATEGORY
// ========================================

export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const category = await categoryService.updateCategory(
      categoryId,
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};


// ========================================
// DELETE CATEGORY
// ========================================

export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await categoryService.deleteCategory(
      categoryId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};