import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/http-error";
import { verifyToken } from "../lib/jwt";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "UNAUTHORIZED", "Missing bearer token"));
  }
  const token = header.slice("Bearer ".length).trim();
  try {
    const { sub } = verifyToken(token);
    req.userId = sub;
    next();
  } catch {
    next(new HttpError(401, "UNAUTHORIZED", "Invalid or expired token"));
  }
}
