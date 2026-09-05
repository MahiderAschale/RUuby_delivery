import prisma from "../config/database.js";

// GET CUSTOMER ORDER TRACKING

export const getOrderTracking = async (
  userId: string,
  orderId: string,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
          city: true,
          subCity: true,
          latitude: true,
          longitude: true,
        },
      },
      delivery: {
        include: {
          rider: {
            include: {
              user: {
                select: {
                  id: true,
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

  if (!order) {
    throw new Error("Order not found");
  }

  const delivery = order.delivery;

  return {
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
    },

    restaurant: order.restaurant,

    delivery: delivery
      ? {
          id: delivery.id,
          status: delivery.status,
          assignedAt: delivery.assignedAt,
          acceptedAt: delivery.acceptedAt,
          arrivedAtRestaurantAt:
            delivery.arrivedAtRestaurantAt,
          pickedUpAt: delivery.pickedUpAt,
          deliveredAt: delivery.deliveredAt,

          rider: delivery.rider
            ? {
                id: delivery.rider.id,
                firstName:
                  delivery.rider.user.firstName,
                lastName:
                  delivery.rider.user.lastName,
                phone: delivery.rider.user.phone,

                currentLocation:
                  delivery.rider.currentLatitude !==
                    null &&
                  delivery.rider.currentLongitude !==
                    null
                    ? {
                        latitude: Number(
                          delivery.rider
                            .currentLatitude,
                        ),
                        longitude: Number(
                          delivery.rider
                            .currentLongitude,
                        ),
                      }
                    : null,
              }
            : null,
        }
      : null,

    destination: {
      address: order.deliveryAddress,
      city: order.deliveryCity,
      subCity: order.deliverySubCity,
      latitude: Number(order.deliveryLatitude),
      longitude: Number(order.deliveryLongitude),
    },
  };
};