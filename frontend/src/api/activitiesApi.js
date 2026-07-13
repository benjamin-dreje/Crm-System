const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const activitiesApi = {
  getByCustomerId: async (customerId) => {
    const res = await fetch(`${BASE_URL}/activities/${customerId}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch activities");
    return data;
  },

  create: async ({ customerId, activityData }) => {
    const res = await fetch(`${BASE_URL}/activities/${customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create activity");
    return data;
  },
};
