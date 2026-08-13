import getCurrentUser from "@/features/auth/service/getCurrentUser";
import getAllTransactionsDb from "../data/get";

async function getTransactionService(limit: number) {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return getAllTransactionsDb({ userId: auth.session.userId, limit });
}

export default getTransactionService;
