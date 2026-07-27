"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hook/useAuth";
import { useSales } from "../../../hook/useSales";
import Loading from "../component/loading/loading";
import "./employees.css";

export default function EmployeesPage() {
  const router = useRouter();
  const {
    user,
    users = [],
    isLoadingUsers,
    createNewUser,
    isCreatingUser,
    deleteUser,
  } = useAuth();
  const { sales, isLoadingSales, isErrorSales } = useSales();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "employee",
  });

  const normalizedRole = user?.role?.toLowerCase()?.trim();
  const isAdmin = normalizedRole === "admin" || normalizedRole === "manager";

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/crm");
    }
  }, [user, isAdmin, router]);

  if (!user) return <Loading />;
  if (!isAdmin) return null;
  if (isLoadingSales || !sales || isLoadingUsers) return <Loading />;

  if (isErrorSales) {
    return (
      <div className="employees-container">
        <h2 className="error-message">Failed to load employees data</h2>
      </div>
    );
  }

  // 🔍 1. סינון טבלת ה-Sales Analytics לפי שם
  const allSalesEmployees = sales?.employeesAnalytics || [];
  const filteredSalesEmployees = allSalesEmployees.filter((emp) => {
    const name = emp.user?.name || emp.user?.fullName || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 🔍 2. סינון טבלת ניהול המשתמשים למטה לפי שם
  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // הוספת עובד חדש
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    try {
      await createNewUser(newUser);

      // איפוס הטופס
      setNewUser({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "employee",
      });

      // ✅ הצגת הודעת הצלחה מעוצבת
      setSuccessMessage("Employee added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setFormError(err.message || "Failed to add employee");
    }
  };

  // מחיקת עובד
  const handleDeleteUser = async (userId) => {
    setFormError("");
    setSuccessMessage("");
    try {
      await deleteUser(userId);
      setSuccessMessage("Employee deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setFormError(err.message || "Failed to delete employee");
    }
  };

  return (
    <div className="employees-container">
      {/* Header */}
      <div className="employees-header">
        <div className="title-e">
          <h1>Employees sales</h1>
          <p className="track">Manage your team performance</p>
        </div>
        <div className="ep1">
          <span className="total-badge">
            {filteredSalesEmployees.length} Employees
          </span>
        </div>
      </div>

      {/* 🔍 Search Input Top */}
      <div className="search-bar-wrapper" style={{ marginBottom: "20px" }}>
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          placeholder="Search employee by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Top Table - Employees Sales Analytics */}
      {filteredSalesEmployees.length === 0 ? (
        <div className="no-data">No employee data found</div>
      ) : (
        <div className="table-wrapper">
          <h3> sales</h3>
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
              {filteredSalesEmployees.map((employee, index) => (
                <tr key={employee.user?._id || employee._id || index}>
                  <td data-label="Name" className="font-semibold">
                    {employee.user?.name ||
                      employee.user?.fullName ||
                      "No name"}
                  </td>
                  <td data-label="Email">{employee.user?.email || "-"}</td>
                  <td data-label="Role">
                    <span className="role-badge">
                      {employee.user?.role || "employee"}
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

      <div className="bottom-sections-grid">
        {/* קוביה 1: ניהול עובדים */}
        <div className="manage-card">
          <h3>Employees Management</h3>
          <p className="sub-title">Quick management of employees </p>

          <div className="mini-table-wrapper">
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td data-label="Name" className="font-semibold">
                        {u.name}
                      </td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Role">
                        <span className="mini-role-badge">
                          {u.role || "employee"}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* קוביה 2: הוספת עובד חדש */}
        <div className="add-card">
          <h3>Add New Employee</h3>
          <p className="sub-title">Create new employees </p>

          <form onSubmit={handleCreateUser} className="add-employee-form">
            {/* הודעת הצלחה/שגיאה מעוצבת בתוך הטאב */}
            {successMessage && (
              <p
                className="success-text"
                style={{ color: "green", fontWeight: "bold" }}
              >
                {successMessage}
              </p>
            )}
            {formError && <p className="error-text">{formError}</p>}

            <input
              type="text"
              placeholder="Full Name"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="submit-btn"
              disabled={isCreatingUser}
            >
              {isCreatingUser ? "Adding..." : "+ Add Employee"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
