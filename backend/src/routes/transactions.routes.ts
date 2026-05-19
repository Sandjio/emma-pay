import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../lib/http-error";
import { toTransactionDTO } from "../lib/mappers";
import { requireAuth } from "../middleware/auth";
import {
  listTransactionsQuery,
  sendSchema,
  topUpSchema,
  withdrawSchema,
} from "../schemas/transactions.schema";

export const transactionsRouter = Router();

const bankAccountInclude = {
  bankAccount: {
    select: {
      institutionName: true,
      lastFour: true,
      logoColor: true,
      logoLetter: true,
    },
  },
} as const;

transactionsRouter.use(requireAuth);

transactionsRouter.get("/", async (req, res, next) => {
  try {
    const { limit, cursor } = listTransactionsQuery.parse(req.query);
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      include: bankAccountInclude,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    let nextCursor: string | null = null;
    if (transactions.length > limit) {
      const next = transactions.pop()!;
      nextCursor = next.id;
    }

    res.json({
      transactions: transactions.map(toTransactionDTO),
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
});

transactionsRouter.post("/send", async (req, res, next) => {
  try {
    const input = sendSchema.parse(req.body);
    const txn = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        type: "SEND",
        amount: new Prisma.Decimal(input.amount),
        currency: input.currency,
        counterpartyName: input.counterpartyName,
        status: "COMPLETED",
      },
      include: bankAccountInclude,
    });
    res.status(201).json({ transaction: toTransactionDTO(txn) });
  } catch (err) {
    next(err);
  }
});

async function adjustCardAndRecord(
  userId: string,
  cardId: string,
  amount: string,
  currency: string,
  type: "TOPUP" | "WITHDRAW",
  bankAccountId?: string,
) {
  return prisma.$transaction(async (tx) => {
    const card = await tx.card.findFirst({ where: { id: cardId, userId } });
    if (!card) {
      throw new HttpError(404, "CARD_NOT_FOUND", "Card not found");
    }
    if (card.currency !== currency) {
      throw new HttpError(400, "CURRENCY_MISMATCH", `Card currency is ${card.currency}`);
    }

    let bankAccount = null;
    if (bankAccountId) {
      bankAccount = await tx.bankAccount.findFirst({
        where: { id: bankAccountId, userId },
      });
      if (!bankAccount) {
        throw new HttpError(404, "BANK_ACCOUNT_NOT_FOUND", "Bank account not found");
      }
    }

    const delta = new Prisma.Decimal(amount);
    const newBalance =
      type === "TOPUP" ? card.balance.add(delta) : card.balance.sub(delta);

    if (type === "WITHDRAW" && newBalance.isNegative()) {
      throw new HttpError(400, "INSUFFICIENT_FUNDS", "Insufficient funds on this card");
    }

    await tx.card.update({ where: { id: card.id }, data: { balance: newBalance } });

    const fallbackName = type === "TOPUP" ? "Top-up" : "Withdrawal";

    return tx.transaction.create({
      data: {
        userId,
        type,
        amount: delta,
        currency,
        counterpartyName: bankAccount?.institutionName ?? fallbackName,
        status: "COMPLETED",
        bankAccountId: bankAccount?.id,
      },
      include: bankAccountInclude,
    });
  });
}

transactionsRouter.post("/top-up", async (req, res, next) => {
  try {
    const input = topUpSchema.parse(req.body);
    const txn = await adjustCardAndRecord(
      req.userId!,
      input.cardId,
      input.amount,
      input.currency,
      "TOPUP",
      input.bankAccountId,
    );
    res.status(201).json({ transaction: toTransactionDTO(txn) });
  } catch (err) {
    next(err);
  }
});

transactionsRouter.post("/withdraw", async (req, res, next) => {
  try {
    const input = withdrawSchema.parse(req.body);
    const txn = await adjustCardAndRecord(
      req.userId!,
      input.cardId,
      input.amount,
      input.currency,
      "WITHDRAW",
      input.bankAccountId,
    );
    res.status(201).json({ transaction: toTransactionDTO(txn) });
  } catch (err) {
    next(err);
  }
});
