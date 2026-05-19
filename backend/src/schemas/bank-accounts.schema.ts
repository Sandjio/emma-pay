import { z } from "zod";

export const createBankAccountSchema = z.object({
  institutionId: z.string().trim().min(1).max(40),
  institutionName: z.string().trim().min(1).max(120),
  logoColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  logoLetter: z.string().trim().min(1).max(2),
  accountType: z.enum(["CHECKING", "SAVINGS"]).optional(),
  isPrimary: z.boolean().optional(),
});

export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;
