import { markAsRead } from "../data/markAsRead";

function markAsReadService(notificationId: string, userId: string) {
  return markAsRead(notificationId, userId);
}

export default markAsReadService;
