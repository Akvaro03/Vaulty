import { NextResponse } from "next/server";
import getCategoriesService from "@/features/categories/service/getCategories";

export async function GET() {
  const categories = await getCategoriesService();

  return NextResponse.json(categories);
}
