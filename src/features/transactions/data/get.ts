import prisma from "@/lib/prisma";

function getAllTransactionsDb({
  userId,
  limit,
}: {
  userId: string;
  limit: number | undefined;
}) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: { select: { name: true, color: true, icon: true } } },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export default getAllTransactionsDb;
