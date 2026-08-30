import axios from "axios";
import { randomUUID } from "crypto";

import prisma from "../config/database.js";
import { previewCheckout } from "./checkout.service.js";

const CHAPA_API_URL =
  process.env.CHAPA_API_URL ?? "https://api.chapa.co";

const CHAPA_SECRET_KEY =
  process.env.CHAPA_SECRET_KEY;

const CHAPA_CALLBACK_URL =
  process.env.CHAPA_CALLBACK_URL;

const CHAPA_RETURN_URL =
  process.env.CHAPA_RETURN_URL;


// ========================================
// ENVIRONMENT CHECK
// ========================================

const ensureChapaConfig = () => {
  if (!CHAPA_SECRET_KEY) {
    throw new Error(
      "CHAPA_SECRET_KEY is not configured",
    );
  }

  if (!CHAPA_CALLBACK_URL) {
    throw new Error(
      "CHAPA_CALLBACK_URL is not configured",
    );
  }

  if (!CHAPA_RETURN_URL) {
    throw new Error(
      "CHAPA_RETURN_URL is not configured",
    );
  }
};


// ========================================
// INITIALIZE PAYMENT
// ========================================

export const initializePayment = async (
  userId: string,
  addressId: string,
) => {
  ensureChapaConfig();

  // Recalculate checkout on the server.
  const checkout = await previewCheckout(
    userId,
    addressId,
    "CHAPA",
  );

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Unique Chapa transaction reference.
  const txRef = `RUUBY-${Date.now()}-${randomUUID()}`;

  const payload: Record<string, unknown> = {
    amount: checkout.total.toString(),
    currency: "ETB",

    first_name: user.firstName,
    last_name: user.lastName,
    phone_number: user.phone,

    tx_ref: txRef,

    callback_url: CHAPA_CALLBACK_URL,
    return_url: CHAPA_RETURN_URL,

    customization: {
      title: "RUuby Delivery",
      description:
        `Payment for ${checkout.restaurant.name}`,
    },

    meta: {
      payment_reason: "RUuby Delivery order",

      invoices: checkout.items.map((item) => ({
        key: item.name,
        value: `${item.quantity} x ${item.unitPrice.toString()} ETB`,
      })),
    },
  };

  if (user.email) {
    payload.email = user.email;
  }

  const response = await axios.post(
    `${CHAPA_API_URL}/v1/transaction/initialize`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (
    response.data?.status !== "success" ||
    !response.data?.data?.checkout_url
  ) {
    throw new Error(
      response.data?.message ??
        "Failed to initialize Chapa payment",
    );
  }

  return {
    txRef,
    checkoutUrl: response.data.data.checkout_url,
    amount: checkout.total,
    currency: "ETB",
    paymentMethod: "CHAPA",
  };
};


// ========================================
// VERIFY PAYMENT
// ========================================

export const verifyPayment = async (
  txRef: string,
) => {
  ensureChapaConfig();

  const response = await axios.get(
    `${CHAPA_API_URL}/v1/transaction/verify/${encodeURIComponent(
      txRef,
    )}`,
    {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    },
  );

  return response.data;
};