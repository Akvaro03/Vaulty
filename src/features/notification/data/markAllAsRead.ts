import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  revalidatePath("/api/dashboard");
}
