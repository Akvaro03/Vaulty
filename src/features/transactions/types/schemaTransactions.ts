import { z } from "zod";

export const createTransactionSchema = z.object({
  accountId: z.string().cuid(),

  categoryId: z.string().cuid().nullable().optional(),

  recurringTransactionId: z.string().cuid().nullable().optional(),

  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),

  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),

  description: z.string().trim().max(255).optional(),

  date: z.coerce.date(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
  id: z.string().cuid(),

  accountId: z.string().cuid().optional(),

  categoryId: z.string().cuid().nullable().optional(),

  recurringTransactionId: z.string().cuid().nullable().optional(),

  amount: z.coerce.number().positive().optional(),

  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),

  description: z.string().trim().max(255).optional(),

  date: z.coerce.date().optional(),
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export const deleteTransactionSchema = z.object({
  id: z.string().cuid(),
});

export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>;
