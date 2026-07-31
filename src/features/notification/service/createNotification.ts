import createNotificationDb from "../data/create";
import { CreateNotificationInput } from "../types/schemaNotifications";

function createNotificationService(data: CreateNotificationInput) {
  return createNotificationDb(data);
}

export default createNotificationService;
