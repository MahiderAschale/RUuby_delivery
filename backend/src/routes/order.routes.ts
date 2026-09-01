import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { cancelCustomerOrder, createOrder, getCustomerOrderById, getCustomerOrders } from "../controllers/order.controller.js";

import { createOrderSchema } from "../validations/order.validation.js";

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

export default router;