import axios from "axios";
import { randomUUID } from "crypto";

import prisma from "../config/database.js";

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
// 1. INITIALIZE PAYMENT
// ========================================

export const initializePayment = async (
  userId: string,
  orderId: string,
) => {
  ensureChapaConfig();


  // ========================================
  // GET ORDER
  // ========================================

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId,
    },

    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },

      payment: true,
    },
  });


  // ========================================
  // CHECK ORDER
  // ========================================

  if (!order) {
    throw new Error("Order not found");
  }


  // ========================================
  // CHECK PAYMENT
  // ========================================

  if (!order.payment) {
    throw new Error("Payment not found");
  }


  if (order.payment.status === "PAID") {
    throw new Error(
      "Order has already been paid",
    );
  }


  // ========================================
  // CHECK ORDER STATUS
  // ========================================

  if (order.status === "CANCELLED") {
    throw new Error(
      "Cancelled orders cannot be paid",
    );
  }


  // ========================================
  // GET CUSTOMER
  // ========================================

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


  // ========================================
  //  GENERATE TRANSACTION REFERENCE
  // ========================================

  const txRef = 
  `RUUBY-${Date.now()}-${randomUUID().slice(0, 8)}`;

  
// Build return URL with transaction reference
const returnUrl = new URL(CHAPA_RETURN_URL!);

returnUrl.searchParams.set("tx_ref", txRef);



  // ========================================
  // SAVE TX REF IN DATABASE
  // ========================================

  await prisma.payment.update({
    where: {
      id: order.payment.id,
    },

    data: {
      transactionReference: txRef,
      provider: "CHAPA",
      status: "PENDING",
    },
  });


  // ========================================
  //  CREATE CHAPA REQUEST
  // ========================================

  const payload: Record<string, unknown> = {
    amount: order.total.toString(),

    currency: "ETB",

    first_name: user.firstName,

    last_name: user.lastName,

    phone_number: user.phone,

    tx_ref: txRef,

    callback_url: CHAPA_CALLBACK_URL,

    return_url: returnUrl.toString(),



    customization: {
      title: "RUuby Delivery",

      description:
        `Payment for ${order.restaurant.name}`,
    },

    meta: {
      order_id: order.id,

      payment_id: order.payment.id,
    },
  };


  // ========================================
  // OPTIONAL EMAIL
  // ========================================

  if (user.email) {
    payload.email = user.email;
  }


  // ========================================
  // SEND REQUEST TO CHAPA
  // ========================================

  try {
    const response = await axios.post(
      `${CHAPA_API_URL}/v1/transaction/initialize`,

      payload,

      {
        headers: {
          Authorization:
            `Bearer ${CHAPA_SECRET_KEY}`,

          "Content-Type":
            "application/json",
        },
      },
    );


    // ========================================
    // CHECK CHAPA RESPONSE
    // ========================================

    if (
      response.data?.status !== "success" ||
      !response.data?.data?.checkout_url
    ) {
      throw new Error(
        response.data?.message ??
          "Failed to initialize Chapa payment",
      );
    }


    // ========================================
    // RETURN CHECKOUT INFORMATION
    // ========================================

    return {
      orderId: order.id,

      paymentId: order.payment.id,

      txRef,

      checkoutUrl:
        response.data.data.checkout_url,

      amount: order.total,

      currency: "ETB",

      paymentMethod: "CHAPA",
    };

  } catch (error: any) {

    console.error(
      "========== CHAPA INITIALIZATION ERROR ==========",
    );

    console.error(
      "Status:",
      error.response?.status,
    );

    console.error(
      "Response:",
      JSON.stringify(
        error.response?.data,
        null,
        2,
      ),
    );

    console.error(
      "================================================",
    );

    throw new Error(
      error.response?.data?.message ??
        "Failed to initialize Chapa payment",
    );
  }
};


// ========================================
// VERIFY PAYMENT WITH CHAPA
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
        Authorization:
          `Bearer ${CHAPA_SECRET_KEY}`,
      },
    },
  );

  return response.data;
};


// ========================================
// COMPLETE PAYMENT
// ========================================

export const completePayment = async (
  txRef: string,
) => {

  // ========================================
  // FIND PAYMENT
  // ========================================

  const payment =
    await prisma.payment.findFirst({
      where: {
        transactionReference: txRef,
      },

      include: {
        order: true,
      },
    });


  if (!payment) {
    throw new Error("Payment not found");
  }


  // ========================================
  // ALREADY PAID
  // ========================================

  if (payment.status === "PAID") {
    return payment;
  }


  // ========================================
  // VERIFY WITH CHAPA
  // ========================================

  const result =
    await verifyPayment(txRef);


  const chapaPayment =
    result?.data;


  // ========================================
  // CHECK CHAPA RESPONSE
  // ========================================

  if (
    result?.status !== "success" ||
    !chapaPayment
  ) {
    throw new Error(
      "Chapa payment verification failed",
    );
  }


  // ========================================
  // CHECK PAYMENT STATUS
  // ========================================

  if (
    chapaPayment.status !== "success"
  ) {
    throw new Error(
      "Payment was not successful",
    );
  }


  // ========================================
  // CHECK TX REF
  // ========================================

  if (
    chapaPayment.tx_ref !== txRef
  ) {
    throw new Error(
      "Transaction reference mismatch",
    );
  }


  // ========================================
  // CHECK AMOUNT
  // ========================================

  const chapaAmount =
    Number(chapaPayment.amount);

  const databaseAmount =
    Number(payment.amount);


  if (
    chapaAmount !== databaseAmount
  ) {
    throw new Error(
      "Payment amount mismatch",
    );
  }


  // ========================================
  // CHECK CURRENCY
  // ========================================

  if (
    chapaPayment.currency !== "ETB"
  ) {
    throw new Error(
      "Payment currency mismatch",
    );
  }


  // ========================================
  // MARK PAYMENT AS PAID
  // ========================================

  const updatedPayment =
    await prisma.$transaction(
      async (tx) => {

        const updatedPayment =
          await tx.payment.update({
            where: {
              id: payment.id,
            },

            data: {
              status: "PAID",

              paidAt: new Date(),

              provider: "CHAPA",
            },
          });


        // ========================================
        // MARK ORDER AS PAID
        // ========================================

        await tx.order.update({
          where: {
            id: payment.orderId,
          },

          data: {
            paymentStatus: "PAID",

            status: "CONFIRMED",
          },
        });


        return updatedPayment;
      },
    );


  return updatedPayment;
};