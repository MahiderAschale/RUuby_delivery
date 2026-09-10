import { api } from "./api";

export interface CartRestaurant {
  id: string;
  name: string;
  slug: string;
  status: string;
  isOpen: boolean;
}

export interface CartMenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  imageUrl?: string | null;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  cartId: string;
  menuItemId: string;
  quantity: number;
  menuItem: CartMenuItem;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: CartRestaurant;
  items: CartItem[];
  subtotal: number | string;
}

interface GetCartResponse {
  success: boolean;
  data: {
    cart: Cart | null;
  };
}

interface AddCartItemResponse {
  success: boolean;
  message: string;
  data: {
    cartItem: CartItem;
  };
}

interface UpdateCartItemResponse {
  success: boolean;
  message: string;
  data: {
    cartItem: CartItem;
  };
}

export const getCart = async (): Promise<Cart | null> => {
  const response =
    await api.get<GetCartResponse>("/cart");

  return response.data.data.cart;
};

export const addItemToCart = async (
  menuItemId: string,
  quantity: number = 1,
): Promise<CartItem> => {
  const response =
    await api.post<AddCartItemResponse>(
      "/cart/items",
      {
        menuItemId,
        quantity,
      },
    );

  return response.data.data.cartItem;
};

export const updateCartItem = async (
  cartItemId: string,
  quantity: number,
): Promise<CartItem> => {
  const response =
    await api.patch<UpdateCartItemResponse>(
      `/cart/items/${cartItemId}`,
      {
        quantity,
      },
    );

  return response.data.data.cartItem;
};

export const removeCartItem = async (
  cartItemId: string,
): Promise<void> => {
  await api.delete(
    `/cart/items/${cartItemId}`,
  );
};

export const clearCart = async (): Promise<void> => {
  await api.delete("/cart");
};