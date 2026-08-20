import prisma from "../config/database.js";

// ========================================
// CREATE MENU ITEM
// ========================================

export const createMenuItem = async (
  categoryId: string,
  ownerId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
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

  return prisma.menuItem.create({
    data: {
      categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable ?? true,
    },
  });
};


// ========================================
// GET CATEGORY ITEMS
// ========================================

export const getCategoryItems = async (
  categoryId: string,
) => {
  return prisma.menuItem.findMany({
    where: {
      categoryId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};


// ========================================
// GET MENU ITEM BY ID
// ========================================

export const getMenuItemById = async (
  menuItemId: string,
) => {
  return prisma.menuItem.findUnique({
    where: {
      id: menuItemId,
    },
    include: {
      category: {
        include: {
          restaurant: true,
        },
      },
    },
  });
};


// ========================================
// UPDATE MENU ITEM
// ========================================

export const updateMenuItem = async (
  menuItemId: string,
  ownerId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isAvailable?: boolean;
  },
) => {
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      category: {
        restaurant: {
          ownerId,
        },
      },
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data,
  });
};


// ========================================
// DELETE MENU ITEM
// ========================================

export const deleteMenuItem = async (
  menuItemId: string,
  ownerId: string,
) => {
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      category: {
        restaurant: {
          ownerId,
        },
      },
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  return prisma.menuItem.delete({
    where: {
      id: menuItemId,
    },
  });
};