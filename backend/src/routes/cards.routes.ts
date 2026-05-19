import { Router } from "express";
import { prisma } from "../db/prisma";
import { makeDemoCardSecrets, makeLastFour } from "../lib/card-mock";
import { HttpError } from "../lib/http-error";
import { toCardDTO, toCardDetailDTO } from "../lib/mappers";
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

cardsRouter.get("/:id", async (req, res, next) => {
  try {
    const card = await prisma.card.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!card) {
      throw new HttpError(404, "CARD_NOT_FOUND", "Card not found");
    }
    res.json({ card: toCardDetailDTO(card) });
  } catch (err) {
    next(err);
  }
});

cardsRouter.post("/", async (req, res, next) => {
  try {
    const input = createCardSchema.parse(req.body);
    const lastFour = makeLastFour();
    const secrets = makeDemoCardSecrets(lastFour);
    const card = await prisma.card.create({
      data: {
        userId: req.userId!,
        type: input.type,
        variant: input.variant ?? "BLUE",
        currency: input.currency ?? "USD",
        lastFour,
        ...secrets,
      },
    });
    res.status(201).json({ card: toCardDTO(card) });
  } catch (err) {
    next(err);
  }
});
