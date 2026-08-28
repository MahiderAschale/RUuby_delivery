import prisma from "../config/database.js";

// ========================================
// HELPER: SET DEFAULT ADDRESS
// ========================================

const setDefaultAddress = async (
  userId: string,
  addressId: string,
) => {
  await prisma.address.updateMany({
    where: {
      userId,
      isDefault: true,
      NOT: {
        id: addressId,
      },
    },
    data: {
      isDefault: false,
    },
  });

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      isDefault: true,
    },
  });
};


// ========================================
// CREATE ADDRESS
// ========================================

export const createAddress = async (
  userId: string,
  data: {
    label: string;
    address: string;
    city: string;
    subCity?: string;
    phone?: string;
    latitude: number;
    longitude: number;
    isDefault?: boolean;
  },
) => {
  const addressCount = await prisma.address.count({
    where: {
      userId,
    },
  });

  const shouldBeDefault =
    data.isDefault === true || addressCount === 0;

  const address = await prisma.address.create({
    data: {
      userId,
      label: data.label,
      address: data.address,
      city: data.city,
      subCity: data.subCity,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
      isDefault: false,
    },
  });

  if (shouldBeDefault) {
    return setDefaultAddress(userId, address.id);
  }

  return address;
};


// ========================================
// GET USER ADDRESSES
// ========================================

export const getAddresses = async (
  userId: string,
) => {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};


// ========================================
// GET ADDRESS BY ID
// ========================================

export const getAddressById = async (
  userId: string,
  addressId: string,
) => {
  return prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });
};


// ========================================
// UPDATE ADDRESS
// ========================================

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: {
    label?: string;
    address?: string;
    city?: string;
    subCity?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  },
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  const updatedAddress = await prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      label: data.label,
      address: data.address,
      city: data.city,
      subCity: data.subCity,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });

  if (data.isDefault === true) {
    return setDefaultAddress(userId, addressId);
  }

  return updatedAddress;
};


// ========================================
// DELETE ADDRESS
// ========================================

export const deleteAddress = async (
  userId: string,
  addressId: string,
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  // If default address was deleted,
  // promote another address.
  if (address.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (nextAddress) {
      await setDefaultAddress(
        userId,
        nextAddress.id,
      );
    }
  }
};


// ========================================
// SET DEFAULT ADDRESS
// ========================================

export const makeDefaultAddress = async (
  userId: string,
  addressId: string,
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return setDefaultAddress(
    userId,
    addressId,
  );
};