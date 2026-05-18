import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
