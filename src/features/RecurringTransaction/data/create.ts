import prisma from "@/lib/prisma";
import { CreateRecurringTransactionInput } from "../types/schemaRecurringTransaction";

type CreateRecurringTransactionParams = CreateRecurringTransactionInput & {
  userId: string;
};

function createRecurringTransaction({
  expectedAmount,
  description,
  dayOfMonth,
  categoryId,
  accountId,
  frequency,
  dayOfWeek,
  isActive,
  userId,
  type,
}: CreateRecurringTransactionParams) {
  return prisma.recurringTransaction.create({
    data: {
      expectedAmount,
      description,
      categoryId,
      dayOfMonth,
      accountId,
      frequency,
      dayOfWeek,
      isActive,
      userId,
      type,
    },
  });
}

export default createRecurringTransaction;
