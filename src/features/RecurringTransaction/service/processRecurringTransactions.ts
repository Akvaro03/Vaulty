import { RecurringTransaction } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import calculateNextRun from "../hooks/calculateNextRun";

export async function processRecurringTransactions() {
  const now = new Date();

  const recurringTransactions = await prisma.recurringTransaction.findMany({
    where: {
      isActive: true,
      nextRunAt: {
        lte: now,
      },
    },
    take: 10,
  });

  let processed = 0;
  let failed = 0;
  for (const recurring of recurringTransactions) {
    try {
      await processRecurringTransaction(recurring);
      processed++;
    } catch (error) {
      failed++;

      console.error(`Failed recurring transaction ${recurring.id}`, error);
    }
  }

  return {
    found: recurringTransactions.length,
    processed,
    failed,
  };
}

async function processRecurringTransaction(recurring: RecurringTransaction) {
  await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        userId: recurring.userId,
        accountId: recurring.accountId,
        categoryId: recurring.categoryId,
        description: recurring.description,
        amount: recurring.expectedAmount,
        date: new Date(),
        type: recurring.type,
        recurringTransactionId: recurring.id,
      },
    });

    await tx.recurringTransaction.update({
      where: {
        id: recurring.id,
      },
      data: {
        lastRunAt: recurring.nextRunAt,
        nextRunAt: calculateNextRun(recurring),
      },
    });
  });
}
