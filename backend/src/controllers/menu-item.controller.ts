import type { Request, Response } from "express";
import * as menuItemService from "../services/menu-item.service.js";

// ========================================
// CREATE MENU ITEM
// ========================================

export const createMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = Array.isArray(req.params.categoryId)
      ? req.params.categoryId[0]
      : req.params.categoryId;

    const menuItem = await menuItemService.createMenuItem(
      categoryId,
      req.user!.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: {
        menuItem,
      },
    });
  } catch (error) {
    console.error("Create menu item error:", error);

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
      message: "Failed to create menu item",
    });
  }
};


// ========================================
// GET CATEGORY ITEMS
// ========================================

export const getCategoryItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = Array.isArray(req.params.categoryId)
      ? req.params.categoryId[0]
      : req.params.categoryId;

    const menuItems = await menuItemService.getCategoryItems(
      categoryId,
    );

    res.status(200).json({
      success: true,
      data: {
        menuItems,
      },
    });
  } catch (error) {
    console.error("Get category items error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get menu items",
    });
  }
};


// ========================================
// GET MENU ITEM BY ID
// ========================================

export const getMenuItemById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const menuItemId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const menuItem = await menuItemService.getMenuItemById(
      menuItemId,
    );

    if (!menuItem) {
      res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        menuItem,
      },
    });
  } catch (error) {
    console.error("Get menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get menu item",
    });
  }
};


// ========================================
// UPDATE MENU ITEM
// ========================================

export const updateMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const menuItemId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const menuItem = await menuItemService.updateMenuItem(
      menuItemId,
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: {
        menuItem,
      },
    });
  } catch (error) {
    console.error("Update menu item error:", error);

    if (
      error instanceof Error &&
      error.message === "Menu item not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
    });
  }
};


// ========================================
// DELETE MENU ITEM
// ========================================

export const deleteMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const menuItemId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await menuItemService.deleteMenuItem(
      menuItemId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);

    if (
      error instanceof Error &&
      error.message === "Menu item not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
    });
  }
};