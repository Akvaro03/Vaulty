import prisma from "@/lib/prisma";

function getAllTransactionsDb({ userId }: { userId: string }) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: { select: { name: true, color: true, icon: true } } },
    orderBy: { date: "desc" },
  });
}

export default getAllTransactionsDb;
