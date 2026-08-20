import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createRestaurant,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";

import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "../validations/restaurant.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate(createRestaurantSchema),
  createRestaurant,
);

router.get(
  "/my",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  getMyRestaurants,
);

router.get(
  "/:id",
  authenticate,
  getRestaurantById,
);

router.patch(
  "/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate(updateRestaurantSchema),
  updateRestaurant,
);
router.delete(
    "/:id",
    authenticate,
    authorize("RESTAURANT_OWNER"),
    deleteRestaurant,
  );
export default router;