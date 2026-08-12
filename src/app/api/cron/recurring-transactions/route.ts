import { NextResponse } from "next/server";
import createNotificationService from "@/features/notification/service/createNotification";
import { processRecurringTransactions } from "@/features/RecurringTransaction/service/processRecurringTransactions";

export async function GET() {
  await createNotificationService({
    createdAt: new Date(),
    isRead: false,
    link: "",
    message: "test",
    title: "test",
    type: "BUDGET_WARNING",
    userId: "cms7i2dzg0000n4driknx6f3y",
  });
  const data = await processRecurringTransactions();
  return NextResponse.json(data);
}
