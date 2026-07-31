import { NotificationType } from "@/generated/prisma/enums";

export interface NotificationGetType {
  items: NotificationTypeDb[];
  unreadCount: number;
}

export interface NotificationTypeDb {
  createdAt: Date;
  id: string;
  isRead: boolean;
  link: string;
  message: string;
  readAt?: boolean;
  title: string;
  type: NotificationType;
  userId: string;
}
