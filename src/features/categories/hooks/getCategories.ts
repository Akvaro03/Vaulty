import { Category } from "../type/type";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories", {
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

export default getCategories;
