"use server"

import getCurrentUser from "@/features/auth/service/getCurrentUser";
import { markAllAsRead } from "../data/markAllAsRead";

async function markAllAsReadService() {
  const auth = await getCurrentUser();
  if (!auth.authenticated) {
    throw new Error("User not authenticated");
  }

  return markAllAsRead(auth.session.userId);
}

export default markAllAsReadService;
