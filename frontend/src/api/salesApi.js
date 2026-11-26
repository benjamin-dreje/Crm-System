const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const salesApi = {
  // GET /sales/getSales
  getAll: async () => {
    let res;
    try {
      res = await fetch(`${BASE_URL}/sales/getSales`, {
        credentials: "include",
      });
    } catch {
      throw new Error("Failed to fetch data");
    }

    if (res.status === 401 || res.status === 403) {
      throw new Error("Forbidden");
    }

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    try {
      return await res.json();
    } catch {
      throw new Error("Failed to fetch data");
    }
  },
};
