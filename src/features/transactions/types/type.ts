import { TransactionType } from "@/generated/prisma/enums";

export interface transactionType {
  id: string;
  userId?: string;
  accountId?: string;
  categoryId?: string;
  recurringTransactionId?: string;
  amount: number;
  category: {
    name: string;
    color: string;
    icon: string;
  };
  description: string;
  date: Date;
  type: TransactionType;
}
