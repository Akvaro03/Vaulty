import { AccountType } from "@/generated/prisma/enums";

export interface accountType {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
}
