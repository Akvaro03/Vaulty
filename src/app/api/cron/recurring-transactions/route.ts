import { NextResponse } from "next/server";
import createNotificationService from "@/features/notification/service/createNotification";

export async function GET() {
  const categories = await createNotificationService({
    createdAt: new Date(),
    isRead: false,
    link: "",
    message: "test",
    title: "test",
    type: "BUDGET_WARNING",
    userId: "cms7i2dzg0000n4driknx6f3y",
  });

  return NextResponse.json(categories);
}
