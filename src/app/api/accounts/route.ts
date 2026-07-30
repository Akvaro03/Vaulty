import { NextResponse } from "next/server";
import getAccountService from "@/features/account/service/getService";

export async function GET() {
  const accounts = await getAccountService();

  return NextResponse.json(accounts);
}
