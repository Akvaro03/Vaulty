"use server";

import createNotificationService from "@/features/notification/service/createNotification";
import { CreateTransactionInput } from "../types/schemaTransactions";
import createTransactions from "../data/create";

async function createTransactionsService(data: CreateTransactionInput) {
  try {
    await createNotificationService({
      userId: "cms7i2dzg0000n4driknx6f3y",
      createdAt: new Date(),
      type: "ACTION_PROG",
      message: "Se agrego un nuevo movimiento",
      title: "Nueva transacción",
      isRead: false,
      link: "/",
    });
    await createTransactions(data);
  } catch (error) {
    console.log(error);
  }
}

export default createTransactionsService;
