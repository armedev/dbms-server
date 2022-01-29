import { User } from "@prisma/client";
import { sign, verify, JwtPayload } from "jsonwebtoken";

const accessSecretKey = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET!;

export const createAccessToken = (user: User): string => {
  return sign({ UserId: user.id }, accessSecretKey, { expiresIn: "2d" });
};

export const validateAccessToken = (token: string): string | JwtPayload => {
  const payload = verify(token, accessSecretKey);
  return payload;
};

export const createRefreshToken = (user: User): string => {
  return sign({ UserId: user.id }, refreshSecretKey, { expiresIn: "7d" });
};

export const validateRefreshToken = (token: string): string | JwtPayload => {
  const payload = verify(token, refreshSecretKey);
  return payload;
};
