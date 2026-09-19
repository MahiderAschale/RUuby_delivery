import { api } from "./api";

export interface ChapaPayment {
  orderId: string;
  paymentId: string;
  txRef: string;
  checkoutUrl: string;
  amount: number | string;
  currency: string;
  paymentMethod: string;
}

interface InitializePaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: ChapaPayment;
  };
}

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: {
      id: string;
      orderId: string;
      amount: number | string;
      method: string;
      status: string;
      provider?: string | null;
      transactionReference?: string | null;
      paidAt?: string | null;
      createdAt?: string;
      updatedAt?: string;
    };
  };
}

export const initializeChapaPayment = async (
  orderId: string,
): Promise<ChapaPayment> => {
  const response =
    await api.post<InitializePaymentResponse>(
      "/payments/chapa/initialize",
      {
        orderId,
      },
    );

  return response.data.data.payment;
};


// VERIFY CHAPA PAYMENT

export const verifyChapaPayment = async (
  txRef: string,
) => {
  const response = await api.get(
    `/payments/chapa/verify/${txRef}`,
  );

  return response.data.data.payment;
};
