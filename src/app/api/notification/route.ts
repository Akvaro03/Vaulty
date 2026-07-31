import getNotificationsService from "@/features/notification/service/getNotifications";
import { NextResponse } from "next/server";

export async function GET() {
  const notifications = await getNotificationsService("cms7i2dzg0000n4driknx6f3y");

  return NextResponse.json(notifications);
}
