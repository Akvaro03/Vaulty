import prisma from "@/lib/prisma";
import { CreateRecurringTransactionInput } from "../types/schemaRecurringTransaction";
import { calculateNextRunStart } from "../hooks/calculateNextRun";

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
  const nextRunAt = calculateNextRunStart(frequency, dayOfWeek, dayOfMonth);
  return prisma.recurringTransaction.create({
    data: {
      expectedAmount,
      description,
      categoryId,
      dayOfMonth,
      accountId,
      frequency,
      lastRunAt: null,
      nextRunAt,
      dayOfWeek,
      isActive,
      userId,
      type,
    },
  });
}

export default createRecurringTransaction;
