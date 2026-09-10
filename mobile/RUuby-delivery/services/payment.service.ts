import { api } from "./api";

export interface ChapaPayment {
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
  data: {
    payment: any;
  };
}

export const initializeChapaPayment = async (
  addressId: string,
): Promise<ChapaPayment> => {
  const response =
    await api.post<InitializePaymentResponse>(
      "/payments/chapa/initialize",
      {
        addressId,
      },
    );

  return response.data.data.payment;
};

export const verifyChapaPayment = async (
  txRef: string,
) => {
  const response =
    await api.get<VerifyPaymentResponse>(
      `/payments/chapa/verify/${encodeURIComponent(txRef)}`,
    );

  return response.data.data.payment;
};