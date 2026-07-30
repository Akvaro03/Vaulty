import { NextResponse } from "next/server";
import getDashboardService from "@/features/dashboard/service/getDashboard";

export async function GET() {
  const accounts = await getDashboardService();

  return NextResponse.json(accounts);
}
