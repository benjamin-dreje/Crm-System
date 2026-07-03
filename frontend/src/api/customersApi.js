const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    if (!res.ok) throw new Error("Failed to fetch customer details");
    return res.json();
  },

  create: async (customerData) => {
    const res = await fetch(`${BASE_URL}/customers/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return res.json();
  },

  update: async ({ id, customerData }) => {
    const res = await fetch(`${BASE_URL}/customers/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/customers/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    return res.json();
  },
};
