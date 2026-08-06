import getCurrentUser from "@/features/auth/service/getCurrentUser";
import getAllTransactionsDb from "../data/get";

async function getTransactionService() {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return getAllTransactionsDb({ userId: auth.user.id });
}

export default getTransactionService;
