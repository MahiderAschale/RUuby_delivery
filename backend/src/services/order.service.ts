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
// ========================================
// GET CUSTOMER ORDERS
// ========================================

export const getCustomerOrders = async (
    userId: string,
  ) => {
    return prisma.order.findMany({
      where: {
        customerId: userId,
      },
  
      orderBy: {
        createdAt: "desc",
      },
  
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
  
        items: {
          orderBy: {
            createdAt: "asc",
          },
  
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            subtotal: true,
            menuItem: {
              select: {
                id: true,
                imageUrl: true,
              },
            },
          },
        },
  
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            provider: true,
            transactionReference: true,
            paidAt: true,
          },
        },
  
        delivery: {
          select: {
            id: true,
            status: true,
            assignedAt: true,
            acceptedAt: true,
            pickedUpAt: true,
            deliveredAt: true,
          },
        },
      },
    });
  };
  
  
  // ========================================
  // GET CUSTOMER ORDER BY ID
  // ========================================
  
  export const getCustomerOrderById = async (
    userId: string,
    orderId: string,
  ) => {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: userId,
      },
  
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            logoUrl: true,
            coverImageUrl: true,
            address: true,
            city: true,
            subCity: true,
          },
        },
  
        items: {
          orderBy: {
            createdAt: "asc",
          },
  
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            subtotal: true,
  
            menuItem: {
              select: {
                id: true,
                imageUrl: true,
              },
            },
          },
        },
  
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            provider: true,
            transactionReference: true,
            paidAt: true,
          },
        },
  
        delivery: {
          select: {
            id: true,
            status: true,
            rider: {
              select: {
                id: true,
                vehicleType: true,
                vehicleNumber: true,
                profileImageUrl: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                  },
                },
              },
            },
            assignedAt: true,
            acceptedAt: true,
            arrivedAtRestaurantAt: true,
            pickedUpAt: true,
            deliveredAt: true,
          },
        },
      },
    });
  };
  
  
  // ========================================
  // CANCEL CUSTOMER ORDER
  // ========================================
  
  export const cancelCustomerOrder = async (
    userId: string,
    orderId: string,
  ) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: userId,
      },
    });
  
    if (!order) {
      throw new Error("Order not found");
    }
  
    const cancellableStatuses = [
      "PENDING",
      "CONFIRMED",
    ];
  
    if (
      !cancellableStatuses.includes(order.status)
    ) {
      throw new Error(
        "This order can no longer be cancelled",
      );
    }
  
    return prisma.order.update({
      where: {
        id: orderId,
      },
  
      data: {
        status: "CANCELLED",
      },
    });
  };