import { Category } from "../categories/type/type";
import { transactionType } from "../transactions/types/type";

export interface DashboardType {
  transactions: transactionType[];
  categories: Category[];
}
