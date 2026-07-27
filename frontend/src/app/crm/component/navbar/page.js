"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../../hook/useAuth"; // וודא שהנתיב ל-Hook נכון
import "./sidebar.css";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // שליפת המשתמש ופונקציית ההתנתקות מתוך ה-Hook
  const { user, logout } = useAuth();

  // בדיקה אם המשתמש הוא מנהל (או לפי role שמתאים אצלכם, למשל 'ADMIN' או 'MANAGER')
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  const handleLogout = async () => {
    console.log("🚪 Logout clicked");
    setIsOpen(false);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Top Bar / Hamburger + Brand - Mobile Only */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <div className="mobile-brand">
          <span className="brand-icon">
            <i className="fa-solid fa-chart-pie"></i>
          </span>
          <span className="brand-name-orange">CRM System</span>
        </div>
      </div>

      {/* Dark Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-brand">
          <span className="brand-icon">
            <i className="fa-solid fa-chart-pie"></i>
          </span>
          <span>CRM System</span>
        </div>

        {/* Navigation */}
        <ul className="sidebar-menu">
          <li>
            <Link
              href="/crm"
              onClick={() => setIsOpen(false)}
              className={`menu-link ${pathname === "/crm" ? "active" : ""}`}
            >
              <span className="link-icon">
                <i className="fa-solid fa-chart-line"></i>
              </span>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/crm/customers"
              onClick={() => setIsOpen(false)}
              className={`menu-link ${
                pathname === "/crm/customers" ? "active" : ""
              }`}
            >
              <span className="link-icon">
                <i className="fa-solid fa-users"></i>
              </span>
              <span>Customers</span>
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link
                href="/crm/employees"
                onClick={() => setIsOpen(false)}
                className={`menu-link ${
                  pathname === "/crm/employees" ? "active" : ""
                }`}
              >
                <span className="link-icon">
                  <i className="fa-solid fa-user-group"></i>
                </span>
                <span>Employees</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              href="/crm/profile"
              onClick={() => setIsOpen(false)}
              className={`menu-link ${
                pathname === "/crm/profile" ? "active" : ""
              }`}
            >
              <span className="link-icon">
                <i className="fa-solid fa-user"></i>
              </span>
              <span>Profile</span>
            </Link>
          </li>
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="logout-link" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
