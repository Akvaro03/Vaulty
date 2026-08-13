"use server";

import createNotificationService from "@/features/notification/service/createNotification";
import getCurrentUser from "@/features/auth/service/getCurrentUser";
import { CreateBudgetInput } from "../types/schemaBudgets";
import createBudget from "../data/create";

async function createBudgetService(data: CreateBudgetInput) {
  console.log("first");
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }
  try {
    await createNotificationService({
      userId: auth.session.userId,
      createdAt: new Date(),
      type: "ACTION_PROG",
      message: "Se agrego un nuevo movimiento",
      title: "Nueva transacción",
      isRead: false,
      link: "/",
    });
    await createBudget({
      ...data,
      userId: auth.session.userId,
    });
  } catch (error) {
    console.log(error);
  }
}

export default createBudgetService;
