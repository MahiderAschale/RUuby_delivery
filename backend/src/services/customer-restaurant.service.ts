import prisma from "../config/database.js";

// ========================================
// GET APPROVED RESTAURANTS
// ========================================

export const getRestaurants = async (filters: {
  search?: string;
  city?: string;
  subCity?: string;
}) => {
  const { search, city, subCity } = filters;

  return prisma.restaurant.findMany({
    where: {
      status: "APPROVED",

      ...(city
        ? {
            city: {
              equals: city,
              mode: "insensitive",
            },
          }
        : {}),

      ...(subCity
        ? {
            subCity: {
              equals: subCity,
              mode: "insensitive",
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      phone: true,
      logoUrl: true,
      coverImageUrl: true,
      address: true,
      city: true,
      subCity: true,
      latitude: true,
      longitude: true,
      status: true,
      isOpen: true,
      createdAt: true,

      _count: {
        select: {
          reviews: true,
          orders: true,
        },
      },
    },
  });
};


// ========================================
// GET RESTAURANT BY SLUG
// ========================================

export const getRestaurantBySlug = async (
  slug: string,
) => {
  return prisma.restaurant.findFirst({
    where: {
      slug,
      status: "APPROVED",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      phone: true,
      email: true,
      logoUrl: true,
      coverImageUrl: true,
      address: true,
      city: true,
      subCity: true,
      latitude: true,
      longitude: true,
      status: true,
      isOpen: true,
      createdAt: true,

      categories: {
        where: {
          isActive: true,
        },

        orderBy: {
          sortOrder: "asc",
        },

        select: {
          id: true,
          name: true,
          description: true,
          sortOrder: true,

          items: {
            where: {
              isAvailable: true,
            },

            orderBy: {
              createdAt: "asc",
            },

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
};