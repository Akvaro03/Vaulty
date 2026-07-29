import prisma from "@/lib/prisma";
import { CreateTransactionInput } from "../types/schemaTransactions";

function createTransactions({
  accountId,
  amount,
  date,
  type,
  userId,
  categoryId,
  description,
}: CreateTransactionInput) {
  prisma.transaction.create({
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
