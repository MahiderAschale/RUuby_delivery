import { Router } from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  makeDefaultAddress,
} from "../controllers/address.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "../validations/address.validation.js";

const router = Router();


// ========================================
// CREATE ADDRESS
// ========================================

router.post(
  "/",
  authenticate,
  validate(createAddressSchema),
  createAddress,
);


// ========================================
// GET ALL ADDRESSES
// ========================================

router.get(
  "/",
  authenticate,
  getAddresses,
);


// ========================================
// GET ONE ADDRESS
// ========================================

router.get(
  "/:id",
  authenticate,
  getAddressById,
);


// ========================================
// UPDATE ADDRESS
// ========================================

router.patch(
  "/:id",
  authenticate,
  validate(updateAddressSchema),
  updateAddress,
);


// ========================================
// SET DEFAULT
// ========================================

router.patch(
  "/:id/default",
  authenticate,
  makeDefaultAddress,
);


// ========================================
// DELETE ADDRESS
// ========================================

router.delete(
  "/:id",
  authenticate,
  deleteAddress,
);

export default router;