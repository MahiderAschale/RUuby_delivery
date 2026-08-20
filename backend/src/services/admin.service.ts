import prisma from "../config/database.js";


// for restaurant approval 
type RestaurantStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";


// ========================================
// GET RESTAURANTS
// ========================================

export const getRestaurants = async (
  status?: RestaurantStatus,
) => {
  return prisma.restaurant.findMany({
    where: status
      ? {
          status,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
        },
      },
      _count: {
        select: {
          categories: true,
          orders: true,
          reviews: true,
        },
      },
    },
  });
};


// ========================================
// GET RESTAURANT BY ID
// ========================================

export const getRestaurantById = async (
  restaurantId: string,
) => {
  return prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          status: true,
        },
      },
      categories: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          items: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
      _count: {
        select: {
          categories: true,
          orders: true,
          reviews: true,
        },
      },
    },
  });
};


// ========================================
// APPROVE RESTAURANT
// ========================================

export const approveRestaurant = async (
  restaurantId: string,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.status === "APPROVED") {
    throw new Error("Restaurant is already approved");
  }

  if (restaurant.status === "SUSPENDED") {
    throw new Error(
      "Suspended restaurants must be restored before approval",
    );
  }

  return prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      status: "APPROVED",
    },
  });
};


// ========================================
// REJECT RESTAURANT
// ========================================

export const rejectRestaurant = async (
  restaurantId: string,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.status === "APPROVED") {
    throw new Error(
      "Approved restaurants cannot be rejected directly",
    );
  }

  return prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      status: "REJECTED",
      isOpen: false,
    },
  });
};


// ========================================
// SUSPEND RESTAURANT
// ========================================

export const suspendRestaurant = async (
  restaurantId: string,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      status: "SUSPENDED",
      isOpen: false,
    },
  });
};


// ========================================
// RESTORE RESTAURANT
// ========================================

export const restoreRestaurant = async (
  restaurantId: string,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.status !== "SUSPENDED") {
    throw new Error(
      "Only suspended restaurants can be restored",
    );
  }

  return prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      status: "APPROVED",
    },
  });
};