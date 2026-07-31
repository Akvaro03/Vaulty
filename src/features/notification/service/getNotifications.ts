import getNotificationsDb from "../data/get";

function getNotificationsService(userId: string) {
  return getNotificationsDb(userId);
}

export default getNotificationsService;
