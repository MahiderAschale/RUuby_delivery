import prisma from "../config/database.js";
import { Prisma } from "../generated/prisma/client.js";
import { DEFAULT_DELIVERY_FEE } from "../constants/checkout.constants.js";

// ========================================
// CHECKOUT PREVIEW
// ========================================

export const previewCheckout = async (
  userId: string,
  addressId: string,
  paymentMethod: "CHAPA" ,
) => {
  // ========================================
  // 1. GET CUSTOMER ADDRESS
  // ========================================

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // ========================================
  // 2. GET CUSTOMER CART
  // ========================================

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

              category: {
                select: {
                  id: true,
                  name: true,
                  isActive: true,

                  restaurantId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // ========================================
  // 3. CHECK CART
  // ========================================

  if (!cart) {
    throw new Error("Cart is empty");
  }

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // ========================================
  // 4. CHECK RESTAURANT
  // ========================================

  if (cart.restaurant.status !== "APPROVED") {
    throw new Error(
      "Restaurant is not available for ordering",
    );
  }

  if (!cart.restaurant.isOpen) {
    throw new Error(
      "Restaurant is currently closed",
    );
  }

  // ========================================
  // 5. VALIDATE MENU ITEMS AGAIN
  // ========================================

  const checkoutItems = cart.items.map((cartItem) => {
    const menuItem = cartItem.menuItem;

    if (
      menuItem.category.restaurantId !==
      cart.restaurantId
    ) {
      throw new Error(
        "Cart contains an invalid menu item",
      );
    }

    if (!menuItem.category.isActive) {
      throw new Error(
        `Category "${menuItem.category.name}" is not available`,
      );
    }

    if (!menuItem.isAvailable) {
      throw new Error(
        `Menu item "${menuItem.name}" is currently unavailable`,
      );
    }

    const unitPrice = menuItem.price;

    const itemSubtotal = unitPrice.mul(
      cartItem.quantity,
    );

    return {
      id: cartItem.id,
      menuItemId: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      imageUrl: menuItem.imageUrl,
      quantity: cartItem.quantity,
      unitPrice,
      subtotal: itemSubtotal,
    };
  });

  // ========================================
  // 6. CALCULATE SUBTOTAL
  // ========================================

  const subtotal = checkoutItems.reduce(
    (total, item) => {
      return total.add(item.subtotal);
    },
    new Prisma.Decimal(0),
  );

  // ========================================
  // 7. DELIVERY FEE
  // ========================================

  const deliveryFee = new Prisma.Decimal(
    DEFAULT_DELIVERY_FEE,
  );

  // ========================================
  // 8. DISCOUNT
  // ========================================

  const discount = new Prisma.Decimal(0);

  // ========================================
  // 9. CALCULATE TOTAL
  // ========================================

  const total = subtotal
    .add(deliveryFee)
    .sub(discount);

  // ========================================
  // 10. RETURN CHECKOUT PREVIEW
  // ========================================

  return {
    restaurant: cart.restaurant,

    address: {
      id: address.id,
      label: address.label,
      address: address.address,
      city: address.city,
      subCity: address.subCity,
      phone: address.phone,
      latitude: address.latitude,
      longitude: address.longitude,
    },

    items: checkoutItems,

    subtotal,
    deliveryFee,
    discount,
    total,

    paymentMethod,
  };
};