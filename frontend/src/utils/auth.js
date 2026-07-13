export const authUtils = {
  clearToken: async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      console.log("Logged out");
    } catch (err) {
      console.error("Logout error:", err);
    }
  },
};
