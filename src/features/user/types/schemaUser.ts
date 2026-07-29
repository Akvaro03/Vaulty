import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  passwordHash: z.string(),

  name: z.string().trim().min(2).max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export const updateUserSchema = z.object({
  id: z.string().cuid(),

  email: z.email().optional(),

  name: z.string().trim().min(2).max(100).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export const deleteUserSchema = z.object({
  id: z.string().cuid(),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
