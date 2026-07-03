"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.css"; // טעינת ה-CSS הרגיל מאותה תיקייה
import { useRouter } from "next/navigation";
import { authUtils } from "../../../../utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authUtils.clearToken();

    // עושה רענון קשיח ומעביר לדף לוגין - מנקה את הזיכרון של הדפדפן לגמרי
    window.location.href = "/login";
  };
  return (
    <div className="sidebar-container">
      {/* Logo/Brand Section */}
      <div className="sidebar-brand">
        <span className="brand-icon">💼</span>
        <span>CRM System</span>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-menu">
        <li>
          <Link
            href="/crm"
            className={`menu-link ${pathname === "/crm" ? "active" : ""}`}
          >
            <span className="link-icon">🏠</span>
            <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            href="/crm/customers"
            className={`menu-link ${pathname === "/crm/customers" ? "active" : ""}`}
          >
            <span className="link-icon">👥</span>
            <span>Customers</span>
          </Link>
        </li>

        <li>
          <Link
            href="/crm/profile"
            className={`menu-link ${pathname === "/crm/profile" ? "active" : ""}`}
          >
            <span className="link-icon">✉️</span>
            <span>profile</span>
          </Link>
        </li>

        <li>
          <Link
            href="/crm/settings"
            className={`menu-link ${pathname === "/crm/settings" ? "active" : ""}`}
          >
            <span className="link-icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </li>
      </ul>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <Link href="/login" className="logout-link" onClick={handleLogout}>
          <span className="link-icon">🚪</span>
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}
