import getCurrentUser from "@/features/auth/service/getCurrentUser";
import { markAsRead } from "../data/markAsRead";

async function markAsReadService(notificationId: string) {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return markAsRead(notificationId, auth.user.id);
}

export default markAsReadService;
