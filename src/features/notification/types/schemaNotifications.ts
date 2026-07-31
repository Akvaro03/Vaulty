import { NotificationType } from "@/generated/prisma/enums";
import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().trim().max(255),
  message: z.string().trim().max(255),
  type: z.nativeEnum(NotificationType),
  isRead: z.boolean(),
  link: z.string().trim().max(255),
  createdAt: z.coerce.date(),
  readAt: z.coerce.date().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export const updateNotificationSchema = z.object({
  id: z.string().cuid(),

  userId: z.string().cuid(),
  title: z.string().trim().max(255),
  message: z.string().trim().max(255).optional(),
  type: z.nativeEnum(NotificationType),
  isRead: z.boolean(),
  link: z.string().trim().max(255),
  createdAt: z.coerce.date().optional(),
  readAt: z.coerce.date().optional(),
});

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;

export const deleteNotificationSchema = z.object({
  id: z.string().cuid(),
});

export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;
