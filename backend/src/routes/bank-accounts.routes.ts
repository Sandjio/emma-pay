import { Router } from "express";
import { prisma } from "../db/prisma";
import { makeLastFour } from "../lib/card-mock";
import { HttpError } from "../lib/http-error";
import { toBankAccountDTO } from "../lib/mappers";
import { requireAuth } from "../middleware/auth";
import { createBankAccountSchema } from "../schemas/bank-accounts.schema";

export const bankAccountsRouter = Router();

bankAccountsRouter.use(requireAuth);

bankAccountsRouter.get("/", async (req, res, next) => {
  try {
    const banks = await prisma.bankAccount.findMany({
      where: { userId: req.userId! },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });
    res.json({ bankAccounts: banks.map(toBankAccountDTO) });
  } catch (err) {
    next(err);
  }
});

bankAccountsRouter.post("/", async (req, res, next) => {
  try {
    const input = createBankAccountSchema.parse(req.body);
    const userId = req.userId!;

    const created = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.bankAccount.count({ where: { userId } });
      const shouldBePrimary = input.isPrimary === true || existingCount === 0;

      if (shouldBePrimary) {
        await tx.bankAccount.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      return tx.bankAccount.create({
        data: {
          userId,
          institutionId: input.institutionId,
          institutionName: input.institutionName,
          logoColor: input.logoColor,
          logoLetter: input.logoLetter.toUpperCase(),
          accountType: input.accountType ?? "CHECKING",
          lastFour: makeLastFour(),
          isPrimary: shouldBePrimary,
        },
      });
    });

    res.status(201).json({ bankAccount: toBankAccountDTO(created) });
  } catch (err) {
    next(err);
  }
});

bankAccountsRouter.delete("/:id", async (req, res, next) => {
  try {
    const result = await prisma.bankAccount.deleteMany({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (result.count === 0) {
      throw new HttpError(404, "BANK_ACCOUNT_NOT_FOUND", "Bank account not found");
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
