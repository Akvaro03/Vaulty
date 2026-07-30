import { accountType } from "../type/type";

async function getAccounts(): Promise<accountType[]> {
  try {
    const res = await fetch("/api/accounts", {
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

export default getAccounts;
