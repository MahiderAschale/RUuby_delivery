import type { Request, Response } from "express";

import * as chapaService
  from "../services/chapa.service.js";


// ========================================
// INITIALIZE CHAPA PAYMENT
// ========================================

export const initializePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {

  try {

    const {
      orderId,
    } = req.body;


    const payment =
      await chapaService.initializePayment(
        req.user!.userId,
        orderId,
      );


    res.status(200).json({
      success: true,

      message:
        "Chapa payment initialized successfully",

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
        "Order not found",
        "Payment not found",
        "User not found",
      ];


      if (
        notFoundErrors.includes(
          error.message,
        )
      ) {

        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }


      const conflictErrors = [
        "Order has already been paid",
        "Cancelled orders cannot be paid",
      ];


      if (
        conflictErrors.includes(
          error.message,
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

          message:
            "Chapa payment configuration is missing",
        });

        return;
      }
    }


    res.status(500).json({
      success: false,

      message:
        "Failed to initialize Chapa payment",
    });
  }
};


// ========================================
// VERIFY PAYMENT
// ========================================

export const verifyPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {

  try {

    const txRef =
      Array.isArray(req.params.txRef)
        ? req.params.txRef[0]
        : req.params.txRef;


    const payment =
      await chapaService.completePayment(
        txRef,
      );


    res.status(200).json({
      success: true,

      message:
        "Payment verified successfully",

      data: {
        payment,
      },
    });

  } catch (error) {

    console.error(
      "Chapa payment verification error:",
      error,
    );


    res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Payment verification failed",
    });
  }
};


// ========================================
// CHAPA CALLBACK
// ========================================

export const chapaCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {

  try {

    const txRef =
      typeof req.query.trx_ref === "string"
        ? req.query.trx_ref
        : typeof req.query.tx_ref === "string"
          ? req.query.tx_ref
          : undefined;


    if (!txRef) {

      res.status(400).json({
        success: false,

        message:
          "Transaction reference is missing",
      });

      return;
    }


    const payment =
      await chapaService.completePayment(
        txRef,
      );


    res.status(200).json({
      success: true,

      message:
        "Payment callback processed successfully",

      data: {
        payment,
      },
    });

  } catch (error) {

    console.error(
      "Chapa callback error:",
      error,
    );


    res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Payment callback failed",
    });
  }
};