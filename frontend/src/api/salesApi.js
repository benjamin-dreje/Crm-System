const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const salesApi = {
  // GET /sales/getSales
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/sales/getSales`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch sales data");
    return data;
  },
};
