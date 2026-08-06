"use server";

import createNotificationService from "@/features/notification/service/createNotification";
import { CreateTransactionInput } from "../types/schemaTransactions";
import createTransactions from "../data/create";
import getCurrentUser from "@/features/auth/service/getCurrentUser";

async function createTransactionsService(data: CreateTransactionInput) {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  try {
    await createNotificationService({
      userId: auth.user.id,
      createdAt: new Date(),
      type: "ACTION_PROG",
      message: "Se agrego un nuevo movimiento",
      title: "Nueva transacción",
      isRead: false,
      link: "/",
    });
    await createTransactions({
      ...data,
      userId: auth.user.id,
    });
  } catch (error) {
    console.log(error);
  }
}

export default createTransactionsService;
