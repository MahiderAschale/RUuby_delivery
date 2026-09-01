import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  cancelCustomerOrder, 
  createOrder,
  getCustomerOrderById, 
  getCustomerOrders ,
  getRestaurantOrders,
  getRestaurantOrderById,
  acceptRestaurantOrder,
  rejectRestaurantOrder,
  markOrderPreparing,
  markOrderReady,} from "../controllers/order.controller.js";

import { createOrderSchema } from "../validations/order.validation.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// CREATE ORDER

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  createOrder,
);

// GET CUSTOMER ORDERS
// ========================================

router.get(
    "/",
    authenticate,
    getCustomerOrders,
  );

  // GET CUSTOMER ORDER BY ID


router.get(
    "/:id",
    authenticate,
    getCustomerOrderById,
  );
  
  // CANCEL CUSTOMER ORDER


router.patch(
    "/:id/cancel",
    authenticate,
    cancelCustomerOrder,);

    // GET RESTAURANT ORDERS
router.get(
  "/restaurant/:restaurantId",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  getRestaurantOrders,
);

// GET RESTAURANT ORDER
router.get(
  "/restaurant/:restaurantId/:orderId",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  getRestaurantOrderById,
);

// ACCEPT ORDER
router.patch(
  "/restaurant/:restaurantId/:orderId/accept",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  acceptRestaurantOrder,
);

// REJECT ORDER
router.patch(
  "/restaurant/:restaurantId/:orderId/reject",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  rejectRestaurantOrder,
);

// MARK PREPARING
router.patch(
  "/restaurant/:restaurantId/:orderId/preparing",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  markOrderPreparing,
);

// MARK READY
router.patch(
  "/restaurant/:restaurantId/:orderId/ready",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  markOrderReady,
);
export default router;