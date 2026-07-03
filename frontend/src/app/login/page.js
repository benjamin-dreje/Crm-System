"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hook/useAuth.js";
import "./login.css";
import Loading from "../crm/component/loading/loading.js";

export default function Login() {
  const { login, isLoggingIn } = useAuth(); // שימוש במוטציה ובמצב הטעינה המובנה
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // איפוס שגיאות קודמות

    try {
      // הפעלת פונקציית ההתחברות מה-Hook
      // היא כבר מבצעת את ה-fetch, מנהלת credentials, ומנווטת ל-/crm בהצלחה
      await login({ email, password });
    } catch (err) {
      // אם השרת החזיר שגיאה (למשל 401), היא תיתפס כאן אוטומטית הודות ל-mutateAsync
      setError(err.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <div className="login-demo">
        <h4>Demo Credentials</h4>
        <div className="login-demo-container">
          <div className="login-demo-user">
            <h3>user</h3>
            <p>email: user@example.com</p>
            <p>password: password</p>
          </div>
          <div className="login-demo-admin">
            <h3>admin</h3>
            <p>email: admin@system.com</p>
            <p>password: adminpassword</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-btn" type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
