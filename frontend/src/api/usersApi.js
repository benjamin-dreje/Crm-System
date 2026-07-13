// הוספת גיבוי קשיח עם /api בסוף בשורה הראשונה
const BASE_URL = "/api/proxy";

console.log("BASE_URL:", BASE_URL);

export const usersApi = {
  // GET /users/ - שליפת כל המשתמשים (רק למי שעבר authMiddleware)
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/users`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    return data;
  },

  // POST /users/create - יצירת משתמש/עובד חדש (רק אדמין)
  create: async (userData) => {
    const res = await fetch(`${BASE_URL}/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create user");
    return data;
    
  },

  // POST /users/login - התחברות וקבלת העוגיות
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Login failed. Check your credentials.");
    return data;
  },

  // POST /users/logout - התנתקות ומחיקת העוגייה
  logout: async () => {
    const res = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Logout failed");
    return data;
  },

  // POST /users/refresh - חידוש אוטומטי של ה-Access Token
  refresh: async () => {
    const res = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Session expired");
    return data;
  },
};
