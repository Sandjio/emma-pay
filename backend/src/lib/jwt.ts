import jwt from "jsonwebtoken";
import { env } from "../config/env";

const EXPIRES_IN = "7d";

export type JwtPayload = { sub: string };

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string" || !decoded.sub) {
    throw new Error("Invalid token payload");
  }
  return { sub: String(decoded.sub) };
}
