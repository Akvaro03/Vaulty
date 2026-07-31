async function markAsReadApi(id: string) {
  try {
    const res = await fetch(`/api/notification/${id}`, {
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

export default markAsReadApi;
