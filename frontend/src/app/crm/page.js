"use client";

import { authUtils } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function HomeCrm() {
  const router = useRouter();

  const handleLogout = async () => {
    await authUtils.clearToken();

    // עושה רענון קשיח ומעביר לדף לוגין - מנקה את הזיכרון של הדפדפן לגמרי
    window.location.href = "/login";
  };
  return (
   
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <h1>CRM Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
        <div>Welcome to CRM - You are logged in</div>
      </div>
   
  );
}
