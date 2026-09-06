import prisma from "../config/database.js";

// CALCULATE DISTANCE BETWEEN TWO LOCATIONS
const calculateDistance = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number => {
  const earthRadius = 6371;

  const lat1 = (latitude1 * Math.PI) / 180;
  const lat2 = (latitude2 * Math.PI) / 180;

  const deltaLat =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const deltaLon =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

// ASSIGN RIDER TO ORDER
export const assignRiderToOrder = async (
  orderId: string,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          latitude: true,
          longitude: true,
        },
      },
      delivery: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "READY_FOR_PICKUP") {
    throw new Error(
      "Only orders ready for pickup can be assigned",
    );
  }

  if (!order.delivery) {
    throw new Error("Delivery not found for this order");
  }

  if (order.delivery.riderId) {
    throw new Error("Order already has a rider assigned");
  }

  const riders = await prisma.rider.findMany({
    where: {
      isOnline: true,
      isVerified: true,
      user: {
        status: "ACTIVE",
      },
      deliveries: {
        none: {
          status: {
            in: [
              "ASSIGNED",
              "ACCEPTED",
              "ARRIVED_AT_RESTAURANT",
              "PICKED_UP",
              "ON_THE_WAY",
            ],
          },
        },
      },
    },
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
  });

  if (riders.length === 0) {
    throw new Error(
      "No available riders found",
    );
  }

  let nearestRider = riders[0];
  let shortestDistance = Number.POSITIVE_INFINITY;

  const restaurantLatitude = Number(
    order.restaurant.latitude,
  );

  const restaurantLongitude = Number(
    order.restaurant.longitude,
  );

  for (const rider of riders) {
    if (
      rider.currentLatitude === null ||
      rider.currentLongitude === null
    ) {
      continue;
    }

    const distance = calculateDistance(
      restaurantLatitude,
      restaurantLongitude,
      Number(rider.currentLatitude),
      Number(rider.currentLongitude),
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestRider = rider;
    }
  }

  if (
    nearestRider.currentLatitude === null ||
    nearestRider.currentLongitude === null
  ) {
    throw new Error(
      "No available rider has a valid location",
    );
  }

  const updatedDelivery =
    await prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.findUnique({
        where: {
          orderId,
        },
      });

      if (!delivery) {
        throw new Error("Delivery not found");
      }

      if (delivery.riderId) {
        throw new Error(
          "Order already has a rider assigned",
        );
      }

      await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "RIDER_ASSIGNED",
        },
      });

      return tx.delivery.update({
        where: {
          id: delivery.id,
        },
        data: {
          riderId: nearestRider.id,
          status: "ASSIGNED",
          assignedAt: new Date(),
        },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              total: true,
              deliveryAddress: true,
              deliveryCity: true,
              deliverySubCity: true,
              deliveryLatitude: true,
              deliveryLongitude: true,
            },
          },
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
      });
    });

  return {
    delivery: updatedDelivery,
    distanceKm:
      Number.isFinite(shortestDistance)
        ? Number(shortestDistance.toFixed(2))
        : null,
  };
};

// GET RIDER'S ASSIGNED DELIVERIES
export const getRiderDeliveries = async (
  userId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  return prisma.delivery.findMany({
    where: {
      riderId: rider.id,
      status: {
        in: [
          "ASSIGNED",
          "ACCEPTED",
          "ARRIVED_AT_RESTAURANT",
          "PICKED_UP",
          "ON_THE_WAY",
        ],
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          deliveryAddress: true,
          deliveryCity: true,
          deliverySubCity: true,
          deliveryLatitude: true,
          deliveryLongitude: true,
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
        },
      },
    },
  });
};

// ACCEPT DELIVERY
export const acceptDelivery = async (
  userId: string,
  deliveryId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  if (!rider.isVerified) {
    throw new Error(
      "Rider must be verified",
    );
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error(
      "This delivery is not assigned to you",
    );
  }

  if (delivery.status !== "ASSIGNED") {
    throw new Error(
      "Only assigned deliveries can be accepted",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedDelivery =
      await tx.delivery.update({
        where: {
          id: deliveryId,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
        include: {
          order: true,
        },
      });

    return updatedDelivery;
  });
};

// REJECT DELIVERY
export const rejectDelivery = async (
  userId: string,
  deliveryId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error(
      "This delivery is not assigned to you",
    );
  }

  if (delivery.status !== "ASSIGNED") {
    throw new Error(
      "Only assigned deliveries can be rejected",
    );
  }

  return prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: delivery.orderId,
      },
      data: {
        status: "READY_FOR_PICKUP",
      },
    });

    return tx.delivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        riderId: null,
        status: "PENDING",
        assignedAt: null,
        acceptedAt: null,
      },
    });
  });
};


// RIDER ARRIVES AT RESTAURANT

export const arriveAtRestaurant = async (
  userId: string,
  deliveryId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error(
      "This delivery is not assigned to you",
    );
  }

  if (delivery.status !== "ACCEPTED") {
    throw new Error(
      "Only accepted deliveries can be marked as arrived",
    );
  }

  return prisma.$transaction(async (tx) => {
    return tx.delivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        status: "ARRIVED_AT_RESTAURANT",
        arrivedAtRestaurantAt: new Date(),
      },
      include: {
        order: true,
      },
    });
  });
};

// RIDER PICKS UP ORDER

export const pickupOrder = async (
  userId: string,
  deliveryId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error(
      "This delivery is not assigned to you",
    );
  }

  if (delivery.status !== "ARRIVED_AT_RESTAURANT") {
    throw new Error(
      "Rider must arrive at the restaurant before pickup",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedDelivery =
      await tx.delivery.update({
        where: {
          id: deliveryId,
        },
        data: {
          status: "PICKED_UP",
          pickedUpAt: new Date(),
        },
        include: {
          order: true,
        },
      });

    await tx.order.update({
      where: {
        id: delivery.orderId,
      },
      data: {
        status: "PICKED_UP",
      },
    });

    return updatedDelivery;
  });
};

// RIDER STARTS DELIVERY

export const startDelivery = async (
  userId: string,
  deliveryId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error(
      "This delivery is not assigned to you",
    );
  }

  if (delivery.status !== "PICKED_UP") {
    throw new Error(
      "Order must be picked up before starting delivery",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedDelivery =
      await tx.delivery.update({
        where: {
          id: deliveryId,
        },
        data: {
          status: "ON_THE_WAY",
        },
        include: {
          order: true,
        },
      });

    await tx.order.update({
      where: {
        id: delivery.orderId,
      },
      data: {
        status: "ON_THE_WAY",
      },
    });

    return updatedDelivery;
  });
};

// RIDER MARKS ORDER DELIVERED

export const completeDelivery = async (
  userId: string,
  deliveryId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error(
      "This delivery is not assigned to you",
    );
  }

  if (delivery.status !== "ON_THE_WAY") {
    throw new Error(
      "Only deliveries that are on the way can be completed",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedDelivery =
      await tx.delivery.update({
        where: {
          id: deliveryId,
        },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
        include: {
          order: true,
        },
      });

    await tx.order.update({
      where: {
        id: delivery.orderId,
      },
      data: {
        status: "DELIVERED",
      },
    });

    return updatedDelivery;
  });
};
