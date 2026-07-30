import { TransactionType } from "@/generated/prisma/enums";

export interface Category {
  id: string;
  name: string;
  userId: string;
  type: TransactionType;
  icon: string;
  color: string;
}
