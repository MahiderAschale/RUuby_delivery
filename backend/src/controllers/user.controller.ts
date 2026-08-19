import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await userService.getCurrentUser(
      req.user!.userId,
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await userService.updateProfile(
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Email or phone number is already in use",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword,
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Change password error:", error);

    if (error.message === "Current password is incorrect") {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message === "User not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await userService.deleteAccount(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};