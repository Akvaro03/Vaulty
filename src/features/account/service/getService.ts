import getCurrentUser from "@/features/auth/service/getCurrentUser";
import getAllAccountsDb from "../data/get";

async function getAccountService() {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return getAllAccountsDb({ userId: auth.user.id });
}

export default getAccountService;
