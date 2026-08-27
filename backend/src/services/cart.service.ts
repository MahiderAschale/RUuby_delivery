import prisma from "../config/database.js";
import { Prisma } from "../generated/prisma/client.js";

// ========================================
// GET CART
// ========================================

export const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          isOpen: true,
        },
      },

      items: {
        orderBy: {
          createdAt: "asc",
        },

        include: {
          menuItem: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return null;
  }

  const subtotal = cart.items.reduce(
    (total, item) => {
      return total.add(
        item.menuItem.price.mul(item.quantity),
      );
    },
    new Prisma.Decimal(0),
  );

  return {
    ...cart,
    subtotal,
  };
};


// ========================================
// ADD ITEM TO CART
// ========================================

export const addItemToCart = async (
  userId: string,
  data: {
    menuItemId: string;
    quantity: number;
  },
) => {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: data.menuItemId,
    },

    include: {
      category: {
        include: {
          restaurant: true,
        },
      },
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  const restaurant = menuItem.category.restaurant;

  if (restaurant.status !== "APPROVED") {
    throw new Error(
      "Restaurant is not available for ordering",
    );
  }

  if (!restaurant.isOpen) {
    throw new Error(
      "Restaurant is currently closed",
    );
  }

  if (!menuItem.category.isActive) {
    throw new Error(
      "Menu category is not available",
    );
  }

  if (!menuItem.isAvailable) {
    throw new Error(
      "Menu item is currently unavailable",
    );
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  // ========================================
  // CREATE CART
  // ========================================

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        restaurantId: restaurant.id,
      },
    });
  } else {
    // ========================================
    // CHECK RESTAURANT
    // ========================================

    if (cart.restaurantId !== restaurant.id) {
      throw new Error(
        "Your cart contains items from another restaurant",
      );
    }
  }

  // ========================================
  // ADD / INCREASE ITEM
  // ========================================

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_menuItemId: {
        cartId: cart.id,
        menuItemId: data.menuItemId,
      },
    },
  });

  const newQuantity =
    (existingItem?.quantity ?? 0) + data.quantity;

  if (newQuantity > 20) {
    throw new Error(
      "Maximum quantity for an item is 20",
    );
  }

  const cartItem = existingItem
    ? await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      })
    : await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId: data.menuItemId,
          quantity: data.quantity,
        },
      });

  return cartItem;
};


// ========================================
// UPDATE CART ITEM
// ========================================

export const updateCartItem = async (
  userId: string,
  cartItemId: string,
  quantity: number,
) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId,
      },
    },

    include: {
      menuItem: {
        include: {
          category: {
            include: {
              restaurant: true,
            },
          },
        },
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (
    cartItem.menuItem.category.restaurant.status !==
    "APPROVED"
  ) {
    throw new Error(
      "Restaurant is not available for ordering",
    );
  }

  if (
    !cartItem.menuItem.category.restaurant.isOpen
  ) {
    throw new Error(
      "Restaurant is currently closed",
    );
  }

  if (!cartItem.menuItem.isAvailable) {
    throw new Error(
      "Menu item is currently unavailable",
    );
  }

  return prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      quantity,
    },
  });
};


// ========================================
// REMOVE CART ITEM
// ========================================

export const removeCartItem = async (
  userId: string,
  cartItemId: string,
) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
};


// ========================================
// CLEAR CART
// ========================================

export const clearCart = async (
  userId: string,
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    return null;
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return cart;
};