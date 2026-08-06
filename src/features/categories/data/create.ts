import { CreateCategoryInput } from "../type/schemaCategory";
import prisma from "@/lib/prisma";
type CreateTransactionParams = CreateCategoryInput & {
  userId: string;
};

function createCategoryDb({
  userId,
  color,
  icon,
  name,
  type,
}: CreateTransactionParams) {
  return prisma.category.create({
    data: {
      userId,
      color,
      icon,
      name,
      type,
    },
  });
}

export default createCategoryDb;
