"use server";

import { CreateTransactionInput } from "../types/schemaTransactions";
import getCurrentUser from "@/features/auth/service/getCurrentUser";
import createTransactions from "../data/create";

async function createTransactionsService(data: CreateTransactionInput) {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  try {
    await createTransactions({
      ...data,
      userId: auth.session.userId,
    });
  } catch (error) {
    console.log(error);
  }
}

export default createTransactionsService;
