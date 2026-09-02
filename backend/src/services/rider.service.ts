import prisma from "../config/database.js";

// CREATE RIDER PROFILE
export const createRiderProfile = async (
  userId: string,
  data: {
    vehicleType: "MOTORCYCLE" | "BICYCLE" | "CAR";
    vehicleNumber?: string;
    licenseNumber?: string;
    profileImageUrl?: string;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      rider: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.rider) {
    throw new Error(
      "Rider profile already exists",
    );
  }

  if (user.role !== "RIDER") {
    throw new Error(
      "User is not registered as a rider",
    );
  }

  return prisma.rider.create({
    data: {
      userId,

      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      licenseNumber: data.licenseNumber,
      profileImageUrl: data.profileImageUrl,

      isOnline: false,
      isVerified: false,
    },
  });
};

// GET MY RIDER PROFILE
export const getMyRiderProfile = async (
  userId: string,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  return rider;
};

// UPDATE RIDER PROFILE
export const updateRiderProfile = async (
  userId: string,
  data: {
    vehicleType?: "MOTORCYCLE" | "BICYCLE" | "CAR";
    vehicleNumber?: string;
    licenseNumber?: string;
    profileImageUrl?: string;
  },
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  return prisma.rider.update({
    where: {
      userId,
    },
    data,
  });
};

// GO ONLINE
export const goOnline = async (
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

  if (!rider.isVerified) {
    throw new Error(
      "Rider must be verified before going online",
    );
  }

  return prisma.rider.update({
    where: {
      userId,
    },
    data: {
      isOnline: true,
    },
  });
};

// GO OFFLINE
export const goOffline = async (
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

  return prisma.rider.update({
    where: {
      userId,
    },
    data: {
      isOnline: false,
    },
  });
};

// UPDATE RIDER LOCATION
export const updateRiderLocation = async (
  userId: string,
  latitude: number,
  longitude: number,
) => {
  const rider = await prisma.rider.findUnique({
    where: {
      userId,
    },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  return prisma.rider.update({
    where: {
      userId,
    },
    data: {
      currentLatitude: latitude,
      currentLongitude: longitude,
    },
  });
};