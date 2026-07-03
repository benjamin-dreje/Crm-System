"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Benjamin CRM",
    language: "en",
    theme: "dark-blue",
    twoFactor: false,
    emailAlerts: true,
    smsAlerts: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      {/* כותרת העמוד */}
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Configure and customize your CRM platform preferences.</p>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* קטגוריה 1: הגדרות כלליות */}
        <div className="settings-section">
          <h3>General Configuration</h3>
          <div className="section-grid">
            <div className="form-group">
              <label>System Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <option value="en">English (LTR)</option>
                <option value="he">Hebrew (RTL)</option>
              </select>
            </div>
          </div>
        </div>

        {/* קטגוריה 2: התראות */}
        <div className="settings-section">
          <h3>Notifications Preferences</h3>
          <p className="section-desc">
            Choose how you want to receive system updates.
          </p>
          <div className="checkbox-list">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="emailAlerts"
                name="emailAlerts"
                checked={settings.emailAlerts}
                onChange={handleChange}
              />
              <label htmlFor="emailAlerts">Enable Email Notifications</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="smsAlerts"
                name="smsAlerts"
                checked={settings.smsAlerts}
                onChange={handleChange}
              />
              <label htmlFor="smsAlerts">Enable SMS Text Alerts</label>
            </div>
          </div>
        </div>

        {/* קטגוריה 3: אבטחה */}
        <div className="settings-section">
          <h3>Security & Privacy</h3>
          <div className="checkbox-list">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="twoFactor"
                name="twoFactor"
                checked={settings.twoFactor}
                onChange={handleChange}
              />
              <label htmlFor="twoFactor">
                Require Two-Factor Authentication (2FA)
              </label>
            </div>
          </div>
        </div>

        {/* כפתור שמירה תחתון */}
        <div className="form-actions">
          <button type="submit" className="btn-save-settings">
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
