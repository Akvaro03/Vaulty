import prisma from "@/lib/prisma";

function getAllCategoriesDb() {
  return prisma.category.findMany();
}

export default getAllCategoriesDb;
