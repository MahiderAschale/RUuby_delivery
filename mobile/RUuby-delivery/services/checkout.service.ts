import { api } from "./api";

export interface CheckoutRestaurant {
  id: string;
  name: string;
  slug: string;
  status: string;
  isOpen: boolean;
}

export interface CheckoutAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  subCity?: string | null;
  phone?: string | null;
  latitude: number | string;
  longitude: number | string;
}

export interface CheckoutItem {
  id: string;
  menuItemId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
}

export interface Checkout {
  restaurant: CheckoutRestaurant;
  address: CheckoutAddress;
  items: CheckoutItem[];
  subtotal: number | string;
  deliveryFee: number | string;
  discount: number | string;
  total: number | string;
  paymentMethod: "CHAPA";
}

interface CheckoutPreviewResponse {
  success: boolean;
  data: {
    checkout: Checkout;
  };
}

export const previewCheckout = async (
  addressId: string,
): Promise<Checkout> => {
  const response =
    await api.post<CheckoutPreviewResponse>(
      "/checkout/preview",
      {
        addressId,
        paymentMethod: "CHAPA",
      },
    );

  return response.data.data.checkout;
};