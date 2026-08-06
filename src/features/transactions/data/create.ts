import prisma from "@/lib/prisma";
import { CreateTransactionInput } from "../types/schemaTransactions";

type CreateTransactionParams = CreateTransactionInput & {
  userId: string;
};

function createTransactions({
  accountId,
  amount,
  date,
  type,
  categoryId,
  description,
  userId,
}: CreateTransactionParams) {
  return prisma.transaction.create({
    data: {
      amount,
      date,
      type,
      accountId,
      userId,
      categoryId,
      description,
    },
  });
}

export default createTransactions;