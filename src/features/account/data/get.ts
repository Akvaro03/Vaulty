import prisma from "@/lib/prisma";

function getAllAccountsDb({ userId }: { userId: string }) {
  return prisma.account.findMany({
    where: { userId },
  });
}

export default getAllAccountsDb;
