const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const activitiesApi = {
  getByCustomerId: async (customerId) => {
    const res = await fetch(`${BASE_URL}/activities/${customerId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch activities");
    return res.json();
  },

  create: async ({ customerId, activityData }) => {
    const res = await fetch(`${BASE_URL}/activities/${customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to create activity");
    return res.json();
  },
};
