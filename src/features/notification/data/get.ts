import prisma from "@/lib/prisma";

async function getNotificationsDb(userId: string) {
  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  return { items, unreadCount };
}

export default getNotificationsDb;
