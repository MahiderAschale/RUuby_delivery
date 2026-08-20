import prisma from "../config/database.js";


// ========================================
// HELPERS
// ========================================

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


// ========================================
// CREATE RESTAURANT
// ========================================

export const createRestaurant = async (
  ownerId: string,
  data: {
    name: string;
    description?: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    subCity?: string;
    latitude: number;
    longitude: number;
    logoUrl?: string;
    coverImageUrl?: string;
  },
) => {
  const slug = generateSlug(data.name);

  return prisma.restaurant.create({
    data: {
      ownerId,

      name: data.name,
      slug,
      description: data.description,

      phone: data.phone,
      email: data.email,

      address: data.address,
      city: data.city,
      subCity: data.subCity,

      latitude: data.latitude,
      longitude: data.longitude,

      logoUrl: data.logoUrl,
      coverImageUrl: data.coverImageUrl,

      status: "PENDING",
      isOpen: false,
    },
  });
};


// ========================================
// GET MY RESTAURANTS
// ========================================

export const getMyRestaurants = async (
  ownerId: string,
) => {
  return prisma.restaurant.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
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
      categories: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          items: {
            where: {
              isAvailable: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });
};


// ========================================
// UPDATE RESTAURANT
// ========================================

export const updateRestaurant = async (
  restaurantId: string,
  ownerId: string,
  data: {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    subCity?: string;
    latitude?: number;
    longitude?: number;
    logoUrl?: string;
    coverImageUrl?: string;
  },
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

  return prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data,
  });
};

// ========================================
// DELETE RESTAURANT
// ========================================

export const deleteRestaurant = async (
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
  
    return prisma.restaurant.delete({
      where: {
        id: restaurantId,
      },
    });
  };