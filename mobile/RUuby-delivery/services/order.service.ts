import { api } from "./api";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId?: string | null;
  name: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
}

export interface OrderRestaurant {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  subCity?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
}

export interface OrderPayment {
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
}

export interface OrderDelivery {
  id: string;
  orderId: string;
  riderId?: string | null;
  status: string;
  assignedAt?: string | null;
  acceptedAt?: string | null;
  arrivedAt?: string | null;
  pickedUpAt?: string | null;
  startedAt?: string | null;
  deliveredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;

  customerId: string;
  restaurantId: string;

  subtotal: number | string;
  deliveryFee: number | string;
  discount: number | string;
  total: number | string;

  status: string;
  paymentStatus: string;

  deliveryAddress: string;
  deliveryCity: string;
  deliverySubCity?: string | null;

  deliveryLatitude?: number | string | null;
  deliveryLongitude?: number | string | null;

  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  items?: OrderItem[];
  restaurant?: OrderRestaurant;
  payment?: OrderPayment | null;
  delivery?: OrderDelivery | null;
}

export interface CreateOrderResult {
  order: Order;
  payment: OrderPayment;
  delivery: OrderDelivery;
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: CreateOrderResult;
}

interface GetOrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
}

interface GetOrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

interface CancelOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
  };
}

export const createOrder = async (
  addressId: string,
): Promise<CreateOrderResult> => {
  const response =
    await api.post<CreateOrderResponse>(
      "/orders",
      {
        addressId,
      },
    );

  return response.data.data;
};

export const getCustomerOrders = async (): Promise<
  Order[]
> => {
  const response =
    await api.get<GetOrdersResponse>(
      "/orders",
    );

  return response.data.data.orders;
};

export const getCustomerOrderById = async (
  orderId: string,
): Promise<Order> => {
  const response =
    await api.get<GetOrderResponse>(
      `/orders/${orderId}`,
    );

  return response.data.data.order;
};

export const cancelCustomerOrder = async (
  orderId: string,
): Promise<Order> => {
  const response =
    await api.patch<CancelOrderResponse>(
      `/orders/${orderId}/cancel`,
    );

  return response.data.data.order;
};
