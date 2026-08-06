import getCurrentUser from "@/features/auth/service/getCurrentUser";
import getNotificationsDb from "../data/get";

async function getNotificationsService() {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return getNotificationsDb(auth.user.id);
}

export default getNotificationsService;
