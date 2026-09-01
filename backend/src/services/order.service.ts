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


  // GET RESTAURANT ORDERS

  
export const getRestaurantOrders = async (
  restaurantId: string,
  ownerId: string,
) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return prisma.order.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
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
          riderId: true,
          assignedAt: true,
          acceptedAt: true,
          pickedUpAt: true,
          deliveredAt: true,
        },
      },
    },
  });
};

// GET RESTAURANT ORDER BY ID
export const getRestaurantOrderById = async (
  restaurantId: string,
  ownerId: string,
  orderId: string,
) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId,
    },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
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
        include: {
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
        },
      },
    },
  });
};

// ACCEPT RESTAURANT ORDER
export const acceptRestaurantOrder = async (
  restaurantId: string,
  ownerId: string,
  orderId: string,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId,
      restaurant: {
        ownerId,
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error(
      "Only pending orders can be accepted",
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CONFIRMED",
    },
  });
};

// REJECT RESTAURANT ORDER
export const rejectRestaurantOrder = async (
  restaurantId: string,
  ownerId: string,
  orderId: string,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId,
      restaurant: {
        ownerId,
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error(
      "Only pending orders can be rejected",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    await tx.delivery.updateMany({
      where: {
        orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return updatedOrder;
  });
};

// MARK ORDER AS PREPARING
export const markOrderPreparing = async (
  restaurantId: string,
  ownerId: string,
  orderId: string,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId,
      restaurant: {
        ownerId,
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "CONFIRMED") {
    throw new Error(
      "Only confirmed orders can be marked as preparing",
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "PREPARING",
    },
  });
};

// MARK ORDER AS READY
export const markOrderReady = async (
  restaurantId: string,
  ownerId: string,
  orderId: string,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId,
      restaurant: {
        ownerId,
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PREPARING") {
    throw new Error(
      "Only preparing orders can be marked as ready",
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "READY_FOR_PICKUP",
    },
  });
};