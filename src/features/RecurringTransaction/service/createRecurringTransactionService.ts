"use server";

import createNotificationService from "@/features/notification/service/createNotification";
import getCurrentUser from "@/features/auth/service/getCurrentUser";
import { CreateRecurringTransactionInput } from "../types/schemaRecurringTransaction";
import createRecurringTransaction from "../data/create";

async function createRecurringTransactionService(
  data: CreateRecurringTransactionInput,
) {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  try {
    await createNotificationService({
      userId: auth.session.userId,
      createdAt: new Date(),
      type: "ACTION_PROG",
      message: "Se agrego una nueva actividad recurrente",
      title: "Nueva transacción",
      isRead: false,
      link: "/",
    });
    await createRecurringTransaction({
      ...data,
      userId: auth.session.userId,
    });
  } catch (error) {
    console.log(error);
  }
}

export default createRecurringTransactionService;
