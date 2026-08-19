import prisma from "@/lib/prisma";

function deleteTransactionDb({ userId, id }: { userId: string; id: string }) {
  return prisma.transaction.delete({
    where: {
      userId: userId,
      id: id,
    },
  });
}

export default deleteTransactionDb;
