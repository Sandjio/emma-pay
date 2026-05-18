import { z } from "zod";

export const createCardSchema = z.object({
  type: z.enum(["VIRTUAL", "PHYSICAL"]),
  variant: z.enum(["BLUE", "PURPLE", "GREEN", "OBSIDIAN"]).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional(),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
