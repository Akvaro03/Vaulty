import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().cuid(),

  amount: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0"),

  month: z.coerce
    .number()
    .int("El mes debe ser un número entero")
    .min(1, "El mes debe estar entre 1 y 12")
    .max(12, "El mes debe estar entre 1 y 12"),

  year: z.coerce
    .number()
    .int("El año debe ser un número entero")
    .min(2000, "Año inválido")
    .max(2100, "Año inválido"),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export const updateBudgetSchema = z.object({
  id: z.string().cuid(),

  categoryId: z.string().cuid().optional(),

  amount: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0")
    .optional(),

  month: z.coerce
    .number()
    .int()
    .min(1)
    .max(12)
    .optional(),

  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .optional(),
});

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

export const deleteBudgetSchema = z.object({
  id: z.string().cuid(),
});

export type DeleteBudgetInput = z.infer<typeof deleteBudgetSchema>;