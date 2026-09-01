import prisma from "../config/database.js";
import { Prisma } from "../generated/prisma/client.js";

import { generateOrderNumber } from "../utils/order-number.js";

const DELIVERY_FEE = new Prisma.Decimal(50);
const DISCOUNT = new Prisma.Decimal(0);


// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  userId: string,
  addressId: string,
) => {
  return prisma.$transaction(
    async (tx) => {
      //  GET ADDRESS
           const address = await tx.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });

      if (!address) {
        throw new Error("Address not found");
      }


       //  GET CART
      
      const cart = await tx.cart.findUnique({
        where: {
          userId,
        },

        include: {
          restaurant: true,

          items: {
            orderBy: {
              createdAt: "asc",
            },

            include: {
              menuItem: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

 //  VALIDATE RESTAURANT
      
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


      //VALIDATE ITEMS + CALCULATE PRICES
      

      const orderItems = cart.items.map((cartItem) => {
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

        const price = menuItem.price;

        const subtotal = price.mul(
          cartItem.quantity,
        );

        return {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price,
          quantity: cartItem.quantity,
          subtotal,
        };
      });


      //  CALCULATE TOTALS
      
      const subtotal = orderItems.reduce(
        (total, item) =>
          total.add(item.subtotal),
        new Prisma.Decimal(0),
      );

      const total = subtotal
        .add(DELIVERY_FEE)
        .sub(DISCOUNT);


      //  CREATE ORDER
      
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),

          customerId: userId,
          restaurantId: cart.restaurantId,

          subtotal,
          deliveryFee: DELIVERY_FEE,
          discount: DISCOUNT,
          total,

          status: "PENDING",
          paymentStatus: "PENDING",

          deliveryAddress: address.address,
          deliveryCity: address.city,
          deliverySubCity: address.subCity,

          deliveryLatitude: address.latitude,
          deliveryLongitude: address.longitude,
        },
      });


      //CREATE ORDER ITEMS
     
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          menuItemId: item.menuItemId,

          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      });

 //  CREATE PAYMENT
     
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,

          amount: total,

          method: "CHAPA",
          status: "PENDING",

          provider: "CHAPA",
        },
      });


        // CREATE DELIVERY
      
      const delivery = await tx.delivery.create({
        data: {
          orderId: order.id,
          status: "PENDING",
        },
      });

  //  CLEAR CART
     
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

  // RETURN ORDER
      
      return {
        order,
        payment,
        delivery,
      };
    },
    {
      timeout: 10000,
    },
  );
};