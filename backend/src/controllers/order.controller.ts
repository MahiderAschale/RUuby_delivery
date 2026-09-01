import type { Request, Response } from "express";
import * as orderService from "../services/order.service.js";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { addressId } = req.body;

    const result = await orderService.createOrder(
      req.user!.userId,
      addressId,
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (error instanceof Error) {
      const notFoundErrors = [
        "Address not found",
      ];

      if (notFoundErrors.includes(error.message)) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      const conflictErrors = [
        "Cart is empty",
        "Restaurant is not available for ordering",
        "Restaurant is currently closed",
        "Cart contains an invalid menu item",
      ];

      if (conflictErrors.includes(error.message)) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message.includes(
          "is not available",
        ) ||
        error.message.includes(
          "is currently unavailable",
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
      message: "Failed to create order",
    });
  }
};
// ========================================
// GET CUSTOMER ORDERS
// ========================================

export const getCustomerOrders = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const orders =
        await orderService.getCustomerOrders(
          req.user!.userId,
        );
  
      res.status(200).json({
        success: true,
        data: {
          orders,
        },
      });
    } catch (error) {
      console.error(
        "Get customer orders error:",
        error,
      );
  
      res.status(500).json({
        success: false,
        message: "Failed to get orders",
      });
    }
  };
  
  
  // ========================================
  // GET CUSTOMER ORDER BY ID
  // ========================================
  
  export const getCustomerOrderById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const orderId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
  
      const order =
        await orderService.getCustomerOrderById(
          req.user!.userId,
          orderId,
        );
  
      if (!order) {
        res.status(404).json({
          success: false,
          message: "Order not found",
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        data: {
          order,
        },
      });
    } catch (error) {
      console.error(
        "Get customer order error:",
        error,
      );
  
      res.status(500).json({
        success: false,
        message: "Failed to get order",
      });
    }
  };
  
  
  // ========================================
  // CANCEL CUSTOMER ORDER
  // ========================================
  
  export const cancelCustomerOrder = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const orderId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
  
      const order =
        await orderService.cancelCustomerOrder(
          req.user!.userId,
          orderId,
        );
  
      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: {
          order,
        },
      });
    } catch (error) {
      console.error(
        "Cancel customer order error:",
        error,
      );
  
      if (error instanceof Error) {
        if (error.message === "Order not found") {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
  
        if (
          error.message ===
          "This order can no longer be cancelled"
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
        message: "Failed to cancel order",
      });
    }
  };

  // GET RESTAURANT ORDERS
export const getRestaurantOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(
      req.params.restaurantId,
    )
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orders =
      await orderService.getRestaurantOrders(
        restaurantId,
        req.user!.userId,
      );

    res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.error(
      "Get restaurant orders error:",
      error,
    );

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
      message: "Failed to get restaurant orders",
    });
  }
};

// GET RESTAURANT ORDER BY ID
export const getRestaurantOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(
      req.params.restaurantId,
    )
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order =
      await orderService.getRestaurantOrderById(
        restaurantId,
        req.user!.userId,
        orderId,
      );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Get restaurant order error:",
      error,
    );

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
      message: "Failed to get restaurant order",
    });
  }
};

// ACCEPT RESTAURANT ORDER
export const acceptRestaurantOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(
      req.params.restaurantId,
    )
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order =
      await orderService.acceptRestaurantOrder(
        restaurantId,
        req.user!.userId,
        orderId,
      );

    res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Accept restaurant order error:",
      error,
    );

    if (error instanceof Error) {
      if (error.message === "Order not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message ===
        "Only pending orders can be accepted"
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
      message: "Failed to accept order",
    });
  }
};

// REJECT RESTAURANT ORDER
export const rejectRestaurantOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(
      req.params.restaurantId,
    )
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order =
      await orderService.rejectRestaurantOrder(
        restaurantId,
        req.user!.userId,
        orderId,
      );

    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Reject restaurant order error:",
      error,
    );

    if (error instanceof Error) {
      if (error.message === "Order not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message ===
        "Only pending orders can be rejected"
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
      message: "Failed to reject order",
    });
  }
};

// MARK ORDER PREPARING
export const markOrderPreparing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(
      req.params.restaurantId,
    )
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order =
      await orderService.markOrderPreparing(
        restaurantId,
        req.user!.userId,
        orderId,
      );

    res.status(200).json({
      success: true,
      message: "Order marked as preparing",
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Mark order preparing error:",
      error,
    );

    if (error instanceof Error) {
      if (error.message === "Order not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message ===
        "Only confirmed orders can be marked as preparing"
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
      message: "Failed to update order",
    });
  }
};

// MARK ORDER READY
export const markOrderReady = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = Array.isArray(
      req.params.restaurantId,
    )
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order =
      await orderService.markOrderReady(
        restaurantId,
        req.user!.userId,
        orderId,
      );

    res.status(200).json({
      success: true,
      message: "Order marked as ready for pickup",
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Mark order ready error:",
      error,
    );

    if (error instanceof Error) {
      if (error.message === "Order not found") {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error.message ===
        "Only preparing orders can be marked as ready"
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
      message: "Failed to update order",
    });
  }
};