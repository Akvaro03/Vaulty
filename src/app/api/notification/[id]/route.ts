import markAsReadService from "@/features/notification/service/markAsReadService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pidParam = Array.isArray(id) ? id[0] : id;
  if (!pidParam || typeof pidParam !== "string") {
    return new NextResponse(null, { status: 400 });
  }

  await markAsReadService(pidParam);
  return NextResponse.json({
    success: true,
  });
}
