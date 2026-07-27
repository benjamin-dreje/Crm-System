"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hook/useAuth";
import { useSales } from "../../../hook/useSales";
import Loading from "../component/loading/loading";
import "./employees.css";

export default function EmployeesPage() {
  const router = useRouter();
  const { user } = useAuth(); // וודא ש-useAuth מחזיר גם isLoadingUser במידת הצורך
  const { sales, isLoadingSales, isErrorSales } = useSales();

  // נרמול ה-Role לאותיות קטנות למניעת בעיות של Case-Sensitivity
  const normalizedRole = user?.role?.toLowerCase()?.trim();
  const isAdmin = normalizedRole === "admin" || normalizedRole === "manager";

  // הדפסה לדיבאג - פתח את ה-Console (F12) בדפדפן ובדוק מה מודפס כאן!
  useEffect(() => {
    if (user) {
      console.log("👤 Current User Data:", user);
      console.log(
        "🏷️ Detected Role:",
        user.role,
        "-> Normalized:",
        normalizedRole,
      );
      console.log("🛡️ Is Admin/Manager?", isAdmin);

      if (!isAdmin) {
        console.warn("⛔ User is NOT admin/manager. Redirecting to /crm...");
        router.replace("/crm");
      }
    }
  }, [user, isAdmin, normalizedRole, router]);

  // 1. אם המשתמש טרם נטען, מציגים Loading
  if (!user) {
    return <Loading />;
  }

  // 2. חסימה מידית! אם המשתמש אינו מנהל - עצור רנדור מיד (ללא תלות ב-Sales)
  if (!isAdmin) {
    return null;
  }

  // 3. רק עבור מנהלים - בודקים טעינת נתוני Sales
  if (isLoadingSales || !sales) {
    return <Loading />;
  }

  if (isErrorSales) {
    return (
      <div className="employees-container">
        <h2 className="error-message">Failed to load employees data</h2>
      </div>
    );
  }

  const employees = sales?.employeesAnalytics || [];

  return (
    <div className="employees-container">
      <div className="employees-header">
        <div className="title-e">
          <h1>Employees sales</h1>
          <p className="track">
            Manage your team performance and track employee sales activity.
          </p>
        </div>
        <div className="ep1">
          <span className="total-badge">{employees.length} Employees</span>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="no-data">No employee data found</div>
      ) : (
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Sales Count</th>
                <th>Total Sales</th>
                <th>Average Sale</th>
                <th>Last Sale</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.user?._id || employee._id || index}>
                  <td data-label="Name" className="font-semibold">
                    {employee.user?.name ||
                      employee.user?.fullName ||
                      "No name"}
                  </td>
                  <td data-label="Email">{employee.user?.email || "-"}</td>
                  <td data-label="Role">
                    <span className="role-badge">
                      {employee.user?.role || "User"}
                    </span>
                  </td>
                  <td data-label="Sales Count">{employee.salesCount ?? 0}</td>
                  <td data-label="Total Sales" className="amount-text">
                    ${(employee.totalAmount || 0).toLocaleString()}
                  </td>
                  <td data-label="Average Sale" className="amount-text">
                    ${(employee.averageSale || 0).toLocaleString()}
                  </td>
                  <td data-label="Last Sale">
                    {employee.lastSale
                      ? new Date(employee.lastSale).toLocaleDateString("en-US")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
