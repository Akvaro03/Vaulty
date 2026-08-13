import { NextResponse } from "next/server";
import { processRecurringTransactions } from "@/features/RecurringTransaction/service/processRecurringTransactions";

export async function GET() {
  const data = await processRecurringTransactions();
  return NextResponse.json(data);
}
