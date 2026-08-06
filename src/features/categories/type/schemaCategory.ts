import { TransactionType } from "@/generated/prisma/enums";
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  type: z.nativeEnum(TransactionType),

  icon: z.string().trim().min(1, "El ícono es obligatorio").max(100),

  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color hexadecimal inválido"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  id: z.string().cuid(),

  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100)
    .optional(),

  type: z.nativeEnum(TransactionType).optional(),

  icon: z.string().trim().min(1).max(100).optional(),

  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color hexadecimal inválido")
    .optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const deleteCategorySchema = z.object({
  id: z.string().cuid(),
});

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
