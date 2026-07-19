const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const activitiesApi = {
  getActivitiesStatus: async () => {
    // עדכון הכתובת המלאה בהתאם לשינוי בשרת
    const res = await fetch(`${BASE_URL}/activities/analytics/by-status`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch activities status");
    return data;
  },
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
  // הפונקציה החדשה לעדכון סטטוס ומכירה (PUT)
  updateStatus: async ({ customerId, activityId, status, amount }) => {
    const res = await fetch(`${BASE_URL}/activities/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, status, amount }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update status");
    return data;
  },
};
