const BASE_URL = "/api/proxy";
export const customersApi = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/customers`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch customer details");
    return data;
  },

  create: async (customerData) => {
    const res = await fetch(`${BASE_URL}/customers/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create customer");
    }
    return data;
  },

  update: async ({ id, customerData }) => {
    const res = await fetch(`${BASE_URL}/customers/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update customer");
    return data;
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/customers/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete customer");
    return data;
  },
};
