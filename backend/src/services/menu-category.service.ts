import prisma from "../config/database.js";

// ========================================
// CREATE CATEGORY
// ========================================

export const createCategory = async (
  restaurantId: string,
  ownerId: string,
  data: {
    name: string;
    description?: string;
    sortOrder?: number;
  },
) => {
  // Verify restaurant belongs to logged-in owner
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return prisma.menuCategory.create({
    data: {
      restaurantId,
      name: data.name,
      description: data.description,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};


// ========================================
// GET RESTAURANT CATEGORIES
// ========================================

export const getRestaurantCategories = async (
  restaurantId: string,
) => {
  return prisma.menuCategory.findMany({
    where: {
      restaurantId,
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
  });
};


// ========================================
// GET CATEGORY BY ID
// ========================================

export const getCategoryById = async (
  categoryId: string,
) => {
  return prisma.menuCategory.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};


// ========================================
// UPDATE CATEGORY
// ========================================

export const updateCategory = async (
  categoryId: string,
  ownerId: string,
  data: {
    name?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) => {
  const category = await prisma.menuCategory.findFirst({
    where: {
      id: categoryId,
      restaurant: {
        ownerId,
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.menuCategory.update({
    where: {
      id: categoryId,
    },
    data,
  });
};


// ========================================
// DELETE CATEGORY
// ========================================

export const deleteCategory = async (
  categoryId: string,
  ownerId: string,
) => {
  const category = await prisma.menuCategory.findFirst({
    where: {
      id: categoryId,
      restaurant: {
        ownerId,
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.menuCategory.delete({
    where: {
      id: categoryId,
    },
  });
};