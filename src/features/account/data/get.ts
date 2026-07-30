import prisma from "@/lib/prisma";

function getAllAccountsDb() {
  return prisma.account.findMany();
}

export default getAllAccountsDb;
