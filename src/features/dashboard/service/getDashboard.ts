"use server";
import getAccountService from "@/features/account/service/getService";
import getCategoriesService from "@/features/categories/service/getCategories";
import getTransactionService from "@/features/transactions/service/getTransaction";

async function getDashboardService() {
  try {
    const accounts = await getAccountService();
    const categories = await getCategoriesService();
    const transactions = await getTransactionService();
    return { accounts, categories, transactions };
  } catch (error) {
    console.log(error);
  }
}

export default getDashboardService;
