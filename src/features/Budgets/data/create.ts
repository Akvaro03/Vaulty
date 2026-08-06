import prisma from "@/lib/prisma";
import { CreateBudgetInput } from "../types/schemaBudgets";

type CreateBudgetParams = CreateBudgetInput & {
  userId: string;
};

function createBudget({
  userId,
  amount,
  categoryId,
  month,
  year,
}: CreateBudgetParams) {
  return prisma.budget.create({
    data: {
      amount,
      userId,
      categoryId,
      month,
      year,
    },
  });
}

export default createBudget;
