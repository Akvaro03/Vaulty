import prisma from "@/lib/prisma";

function getAllTransactionsDb() {
  return prisma.transaction.findMany({
    include: { category: { select: { name: true, color: true, icon: true } } },
    orderBy: { date: "desc" },
  });
}

export default getAllTransactionsDb;
