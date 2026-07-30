import getAllCategoriesDb from "../data/get";

async function getCategoriesService() {
  return getAllCategoriesDb();
}

export default getCategoriesService;
