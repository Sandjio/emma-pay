import { Router } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../lib/http-error";
import { toContactDTO, toUserDTO } from "../lib/mappers";
import { requireAuth } from "../middleware/auth";
import { updateUserSchema } from "../schemas/users.schema";

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get("/me", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) throw new HttpError(404, "USER_NOT_FOUND", "User not found");
    res.json({ user: toUserDTO(user) });
  } catch (err) {
    next(err);
  }
});

usersRouter.patch("/me", async (req, res, next) => {
  try {
    const input = updateUserSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: input,
    });
    res.json({ user: toUserDTO(user) });
  } catch (err) {
    next(err);
  }
});

// Contacts live under the authenticated user; kept here to avoid a sliver of a router for one endpoint.
export const contactsRouter = Router();
contactsRouter.use(requireAuth);

contactsRouter.get("/", async (req, res, next) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.userId! },
      orderBy: { name: "asc" },
    });
    res.json({ contacts: contacts.map(toContactDTO) });
  } catch (err) {
    next(err);
  }
});
