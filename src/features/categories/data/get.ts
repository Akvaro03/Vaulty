import prisma from "@/lib/prisma";

function getAllCategoriesDb({ userId }: { userId: string }) {
  return prisma.category.findMany({
    where: { userId },
  });
}

export default getAllCategoriesDb;
