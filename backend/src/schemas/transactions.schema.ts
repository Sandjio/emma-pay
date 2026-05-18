import { z } from "zod";

const amount = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? v.toString() : v))
  .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Amount must be a positive decimal with up to 2 places")
  .refine((v) => Number(v) > 0, "Amount must be greater than 0");

const currency = z.string().trim().length(3).toUpperCase();

export const sendSchema = z.object({
  amount,
  currency,
  counterpartyName: z.string().trim().min(1).max(120),
  contactId: z.string().optional(),
});

export const topUpSchema = z.object({
  amount,
  currency,
  cardId: z.string().min(1, "cardId is required"),
});

export const withdrawSchema = topUpSchema;

export const listTransactionsQuery = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  cursor: z.string().optional(),
});

export type SendInput = z.infer<typeof sendSchema>;
export type TopUpInput = z.infer<typeof topUpSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
