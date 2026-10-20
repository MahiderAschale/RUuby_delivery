import type { Request, Response } from "express";
import {
  login,
  register,
  getCurrentUser,
} from "../services/auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Registration failed";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Login failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    const user = await getCurrentUser(
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        user,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(
      "Get current user error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve current user",
    });
  }
};
