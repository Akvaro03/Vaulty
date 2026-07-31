import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsRead(notificationId: string, userId: string) {
  await prisma.notification.update({
    where: { id: notificationId, userId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  revalidatePath("/api/dashboard");
}