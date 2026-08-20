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
  getRestaurantDashboard,
  openRestaurant,
  closeRestaurant,
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

  router.get(
    "/:id/dashboard",
    authenticate,
    authorize("RESTAURANT_OWNER"),
    getRestaurantDashboard,
  );
  
  router.patch(
    "/:id/open",
    authenticate,
    authorize("RESTAURANT_OWNER"),
    openRestaurant,
  );
  
  router.patch(
    "/:id/close",
    authenticate,
    authorize("RESTAURANT_OWNER"),
    closeRestaurant,
  );
export default router;