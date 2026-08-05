import getSessionDb from "../data/getSession";

async function getSessionService({ token }: { token: string }) {
  return await getSessionDb(token);
}

export default getSessionService;
