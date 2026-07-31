import prisma from "@/lib/prisma";
import { CreateNotificationInput } from "../types/schemaNotifications";

function createNotificationDb({
  createdAt,
  message,
  readAt,
  userId,
  isRead,
  title,
  link,
  type,
}: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      createdAt,
      userId,
      message,
      title,
      type,
      readAt,
      isRead,
      link,
    },
  });
}

export default createNotificationDb;
