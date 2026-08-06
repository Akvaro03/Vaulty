import getCurrentUser from "@/features/auth/service/getCurrentUser";
import getAllCategoriesDb from "../data/get";

async function getCategoriesService() {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return getAllCategoriesDb({ userId: auth.user.id });
}

export default getCategoriesService;
