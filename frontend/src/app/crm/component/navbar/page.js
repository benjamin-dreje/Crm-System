"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.css";
import { authUtils } from "../../../../utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    console.log("🚪 Logout clicked");

    setIsOpen(false);

    await authUtils.clearToken();

    console.log("➡️ Redirecting");

    window.location.href = "/login";
  };

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Dark Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-brand">
          <span className="brand-icon">logo</span>
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
              <span className="link-icon">logo</span>
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
              <span className="link-icon">logo</span>
              <span>Customers</span>
            </Link>
          </li>

          <li>
            <Link
              href="/crm/profile"
              onClick={() => setIsOpen(false)}
              className={`menu-link ${
                pathname === "/crm/profile" ? "active" : ""
              }`}
            >
              <span className="link-icon">logo</span>
              <span>Profile</span>
            </Link>
          </li>

          <li>
            <Link
              href="/crm/settings"
              onClick={() => setIsOpen(false)}
              className={`menu-link ${
                pathname === "/crm/settings" ? "active" : ""
              }`}
            >
              <span className="link-icon">logo</span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="logout-link"
            onClick={() => {
              alert("BUTTON WORKS");
              handleLogout();
            }}
          ></button>
        </div>
      </div>
    </>
  );
}
