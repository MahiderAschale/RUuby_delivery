import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Role } from "../generated/prisma/client.js";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const generateAccessToken = (
  userId: string,
  role: Role,
): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId,
      role,
    },
    env.jwtSecret,
    options,
  );
};

export const verifyAccessToken = (
  token: string,
): JwtPayload => {
  return jwt.verify(
    token,
    env.jwtSecret,
  ) as JwtPayload;
};