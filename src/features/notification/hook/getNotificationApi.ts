import { NotificationGetType } from "../types/notificationType";

async function getNotificationApi(): Promise<NotificationGetType> {
  try {
    const res = await fetch("/api/notification", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export default getNotificationApi;
