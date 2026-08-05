import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/features/dashboard/service/getDashboard";
import { UnauthorizedError } from "@/features/auth/types/authType";

export async function GET() {
  try {
    const accounts = await getDashboardMetrics();
    return NextResponse.json(accounts);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    throw err;
  }
}
