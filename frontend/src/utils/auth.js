// Authentication utility functions
export const authUtils = {
  // Logout - call backend to clear httpOnly cookies
  clearToken: async () => {
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include", // שומר שהדפדפן ישלח את הקוקי לשרת לצורך מחיקה
      });
      console.log("Logged out");
    } catch (err) {
      console.error("Logout error:", err);
    }
  },
};
