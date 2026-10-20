import { Router } from "express";
import {
  loginController,
  registerController,
  getCurrentUserController,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
} from "../validations/auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerController,
);

router.post(
  "/login",
  validate(loginSchema),
  loginController,
);

router.get(
  "/me",
  authenticate,
  getCurrentUserController,
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "You have admin access",
    });
  },
);

export default router;
