import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { makeDemoCardSecrets, makeLastFour } from "../lib/card-mock";
import { HttpError } from "../lib/http-error";
import { signToken } from "../lib/jwt";
import { toUserDTO } from "../lib/mappers";
import { hashPassword, verifyPassword } from "../lib/password";
import { requireAuth } from "../middleware/auth";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);

    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: { name, email, passwordHash },
        });
        const lastFour = makeLastFour();
        await tx.card.create({
          data: {
            userId: created.id,
            type: "VIRTUAL",
            variant: "BLUE",
            currency: "USD",
            balance: new Prisma.Decimal(0),
            lastFour,
            ...makeDemoCardSecrets(lastFour),
          },
        });
        return created;
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new HttpError(409, "EMAIL_TAKEN", "An account with this email already exists");
      }
      throw err;
    }

    const token = signToken(user.id);
    res.status(201).json({ user: toUserDTO(user), token });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const token = signToken(user.id);
    res.json({ user: toUserDTO(user), token });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      throw new HttpError(404, "USER_NOT_FOUND", "User not found");
    }
    res.json({ user: toUserDTO(user) });
  } catch (err) {
    next(err);
  }
});
