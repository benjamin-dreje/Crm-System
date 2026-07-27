"use client";
import "./profile.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hook/useAuth";
import Loading from "../component/loading/loading";

export default function ProfilePage() {
  const { user } = useAuth();

  // אם עדיין לא עלינו בדפדפן
  if (!user) {
    return <Loading></Loading>;
  }

  // אם אין משתמש
  if (!user) {
    return (
      <div
        className="profile-page"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <h2> You are not connected</h2>
      </div>
    );
  }

  const fullName = user.fullName || user.name || "לא צוין";
  const role = user.role || "User";

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>

        <div className="profile-header-info">
          <span className="role-badge">{role}</span>
          <span className="profile-avatar">👤</span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card summary-card">
          <h2>{fullName}</h2>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-card form-card">
          <h3>Account Details</h3>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{fullName}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email Address:</span>
              <span className="detail-value">{user.email || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{user.phone || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
