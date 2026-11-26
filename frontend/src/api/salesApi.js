const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const salesApi = {
  // GET /sales/getSales
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/sales/getSales`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      const message =
        res.status === 401 || res.status === 403
          ? "אין גישה"
          : "כשל בשליפת הנתונים";
      throw new Error(message);
    }
    return data;
  },
};
