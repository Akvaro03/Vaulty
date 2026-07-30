import { Category } from "../categories/type/type";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  categoryId: string;
  description?: string;
}

export interface Dashboard {
  transactions: Transaction[];
  categories: Category[];
}
