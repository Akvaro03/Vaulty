import getNotificationsService from "@/features/notification/service/getNotifications";
import { NextResponse } from "next/server";

export async function GET() {
  const notifications = await getNotificationsService();

  return NextResponse.json(notifications);
}
