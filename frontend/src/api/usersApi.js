// הוספת גיבוי קשיח עם /api בסוף בשורה הראשונה
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

console.log("BASE_URL:", BASE_URL);

export const usersApi = {
  // GET /users/ - שליפת כל המשתמשים (רק למי שעבר authMiddleware)
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/users`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  // POST /users/create - יצירת משתמש/עובד חדש (רק אדמין)
  create: async (userData) => {
    const res = await fetch(`${BASE_URL}/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  // POST /users/login - התחברות וקבלת העוגיות
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Login failed. Check your credentials.");
    return res.json();
  },

  // POST /users/logout - התנתקות ומחיקת העוגייה
  logout: async () => {
    const res = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Logout failed");
    return res.json();
  },

  // POST /users/refresh - חידוש אוטומטי של ה-Access Token
  refresh: async () => {
    const res = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Session expired");
    return res.json();
  },
};
