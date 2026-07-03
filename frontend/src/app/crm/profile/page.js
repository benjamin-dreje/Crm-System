"use client";

import { useState } from "react";

export default function ProfilePage() {
  // סטייט מקומי לעדכון פרטי הפרופיל בטופס
  const [formData, setFormData] = useState({
    fullName: "Benjamin System",
    email: "benjamin@crm.com",
    role: "Administrator",
    phone: "+972 50-123-4567",
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">
      {/* כותרת העמוד */}
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings.</p>
      </div>

      <div className="profile-grid">
        {/* כרטיס פרופיל שמאלי/עליון */}
        <div className="profile-card summary-card">
          <div className="avatar-container">
            <span className="profile-avatar">👤</span>
          </div>
          <h2>{formData.fullName}</h2>
          <span className="role-badge">{formData.role}</span>
          <p className="profile-email">{formData.email}</p>
        </div>

        {/* טופס עריכת פרטים ימני */}
        <div className="profile-card form-card">
          <h3>Account Details</h3>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
              />
              <label htmlFor="notifications">Receive email notifications</label>
            </div>

            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
