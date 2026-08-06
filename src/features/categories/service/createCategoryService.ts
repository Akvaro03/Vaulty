"use server";

import getCurrentUser from "@/features/auth/service/getCurrentUser";
import { CreateCategoryInput } from "../type/schemaCategory";
import createCategoryDb from "../data/create";

async function createCategoryService(data: CreateCategoryInput) {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  try {
    await createCategoryDb({
      ...data,
      userId: auth.user.id,
    });
  } catch (error) {
    console.log(error);
  }
}

export default createCategoryService;
