import getAllAccountsDb from "../data/get";

async function getAccountService() {
  return getAllAccountsDb();
}

export default getAccountService;
