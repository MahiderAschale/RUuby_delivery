import type { Request, Response } from "express";
import * as addressService from "../services/address.service.js";

// ========================================
// CREATE ADDRESS
// ========================================

export const createAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const address = await addressService.createAddress(
      req.user!.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    console.error("Create address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create address",
    });
  }
};


// ========================================
// GET ADDRESSES
// ========================================

export const getAddresses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const addresses = await addressService.getAddresses(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: {
        addresses,
      },
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get addresses",
    });
  }
};


// ========================================
// GET ADDRESS BY ID
// ========================================

export const getAddressById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const address =
      await addressService.getAddressById(
        req.user!.userId,
        addressId,
      );

    if (!address) {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        address,
      },
    });
  } catch (error) {
    console.error("Get address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get address",
    });
  }
};


// ========================================
// UPDATE ADDRESS
// ========================================

export const updateAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const address =
      await addressService.updateAddress(
        req.user!.userId,
        addressId,
        req.body,
      );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    console.error("Update address error:", error);

    if (
      error instanceof Error &&
      error.message === "Address not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};


// ========================================
// DELETE ADDRESS
// ========================================

export const deleteAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await addressService.deleteAddress(
      req.user!.userId,
      addressId,
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    if (
      error instanceof Error &&
      error.message === "Address not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};


// ========================================
// SET DEFAULT
// ========================================

export const makeDefaultAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const address =
      await addressService.makeDefaultAddress(
        req.user!.userId,
        addressId,
      );

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    console.error(
      "Set default address error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "Address not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};