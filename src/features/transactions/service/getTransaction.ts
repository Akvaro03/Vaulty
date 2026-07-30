import getAllTransactionsDb from "../data/get";

async function getTransactionService() {
  return getAllTransactionsDb();
}

export default getTransactionService;
