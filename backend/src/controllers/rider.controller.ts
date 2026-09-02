import type { Request, Response } from "express";
import * as riderService from "../services/rider.service.js";

// CREATE RIDER PROFILE
export const createRiderProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rider =
      await riderService.createRiderProfile(
        req.user!.userId,
        req.body,
      );

    res.status(201).json({
      success: true,
      message: "Rider profile created successfully",
      data: {
        rider,
      },
    });
  } catch (error) {
    console.error(
      "Create rider profile error:",
      error,
    );

    if (error instanceof Error) {
      if (
        error.message === "User not found" ||
        error.message ===
          "Rider profile already exists"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message ===
        "User is not registered as a rider"
      ) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to create rider profile",
    });
  }
};

// GET MY RIDER PROFILE
export const getMyRiderProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rider =
      await riderService.getMyRiderProfile(
        req.user!.userId,
      );

    res.status(200).json({
      success: true,
      data: {
        rider,
      },
    });
  } catch (error) {
    console.error(
      "Get rider profile error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "Rider profile not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to get rider profile",
    });
  }
};

// UPDATE RIDER PROFILE
export const updateRiderProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rider =
      await riderService.updateRiderProfile(
        req.user!.userId,
        req.body,
      );

    res.status(200).json({
      success: true,
      message: "Rider profile updated successfully",
      data: {
        rider,
      },
    });
  } catch (error) {
    console.error(
      "Update rider profile error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "Rider profile not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update rider profile",
    });
  }
};

// GO ONLINE
export const goOnline = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rider =
      await riderService.goOnline(
        req.user!.userId,
      );

    res.status(200).json({
      success: true,
      message: "Rider is now online",
      data: {
        rider,
      },
    });
  } catch (error) {
    console.error(
      "Go online error:",
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
        error.message ===
        "Rider must be verified before going online"
      ) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to go online",
    });
  }
};

// GO OFFLINE
export const goOffline = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rider =
      await riderService.goOffline(
        req.user!.userId,
      );

    res.status(200).json({
      success: true,
      message: "Rider is now offline",
      data: {
        rider,
      },
    });
  } catch (error) {
    console.error(
      "Go offline error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "Rider profile not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to go offline",
    });
  }
};

// UPDATE RIDER LOCATION
export const updateRiderLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { latitude, longitude } =
      req.body;

    const rider =
      await riderService.updateRiderLocation(
        req.user!.userId,
        latitude,
        longitude,
      );

    res.status(200).json({
      success: true,
      message: "Rider location updated successfully",
      data: {
        rider,
      },
    });
  } catch (error) {
    console.error(
      "Update rider location error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "Rider profile not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update rider location",
    });
  }
};