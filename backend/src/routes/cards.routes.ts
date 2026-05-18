import { Router } from "express";
import { prisma } from "../db/prisma";
import { toCardDTO } from "../lib/mappers";
import { requireAuth } from "../middleware/auth";
import { createCardSchema } from "../schemas/cards.schema";

export const cardsRouter = Router();

cardsRouter.use(requireAuth);

cardsRouter.get("/", async (req, res, next) => {
  try {
    const cards = await prisma.card.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "desc" },
    });
    res.json({ cards: cards.map(toCardDTO) });
  } catch (err) {
    next(err);
  }
});

cardsRouter.post("/", async (req, res, next) => {
  try {
    const input = createCardSchema.parse(req.body);
    const lastFour = String(Math.floor(1000 + Math.random() * 9000));
    const card = await prisma.card.create({
      data: {
        userId: req.userId!,
        type: input.type,
        variant: input.variant ?? "BLUE",
        currency: input.currency ?? "USD",
        lastFour,
      },
    });
    res.status(201).json({ card: toCardDTO(card) });
  } catch (err) {
    next(err);
  }
});
