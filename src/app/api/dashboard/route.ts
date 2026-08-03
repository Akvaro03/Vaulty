import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/features/dashboard/service/getDashboard";

export async function GET() {
  const accounts = await getDashboardMetrics(
    "cms7i2dzg0000n4driknx6f3y",
    new Date(),
  );

  return NextResponse.json(accounts);
}
