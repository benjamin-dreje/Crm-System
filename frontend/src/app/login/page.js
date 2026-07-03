"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hook/useAuth.js";
import "./page.css";

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
        <div className="login-demo-text">
          <h4>Demo Credentials</h4>
        </div>
        <p>email: user@example.com</p>
        <p>password: password</p>
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
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
