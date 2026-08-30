import type { Request, Response } from "express";
import * as chapaService from "../services/chapa.service.js";

// ========================================
// INITIALIZE CHAPA PAYMENT
// ========================================

export const initializeChapaPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { addressId } = req.body;

    const payment =
      await chapaService.initializePayment(
        req.user!.userId,
        addressId,
      );

    res.status(200).json({
      success: true,
      message: "Chapa payment initialized successfully",
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error(
      "Chapa payment initialization error:",
      error,
    );

    if (error instanceof Error) {
      const notFoundErrors = [
        "Address not found",
        "User not found",
        "Cart is empty",
      ];

      if (
        notFoundErrors.includes(error.message)
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "Restaurant is",
        ) ||
        error.message.includes(
          "Menu item",
        ) ||
        error.message.includes(
          "Category",
        ) ||
        error.message.includes(
          "Cart contains",
        )
      ) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "CHAPA_",
        )
      ) {
        res.status(500).json({
          success: false,
          message: "Chapa payment configuration is missing",
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to initialize Chapa payment",
    });
  }
};


// ========================================
// VERIFY CHAPA PAYMENT
// ========================================

export const verifyChapaPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const txRef = Array.isArray(req.params.txRef)
      ? req.params.txRef[0]
      : req.params.txRef;

    const result =
      await chapaService.verifyPayment(txRef);

    res.status(200).json({
      success: true,
      data: {
        payment: result,
      },
    });
  } catch (error) {
    console.error(
      "Chapa payment verification error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to verify Chapa payment",
    });
  }
};