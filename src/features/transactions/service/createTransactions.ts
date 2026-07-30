"use server"

import { CreateTransactionInput } from "../types/schemaTransactions";
import createTransactions from "../data/create";

async function createTransactionsService(data: CreateTransactionInput) {
  try {
    await createTransactions(data);
  } catch (error) {
    console.log(error);
  }
}

export default createTransactionsService;
