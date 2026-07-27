"use client";

import { useSales } from "../../../hook/useSales";
import Loading from "../component/loading/loading";
import "./employees.css";

export default function EmployeesPage() {
  const { sales, isLoadingSales, isErrorSales } = useSales();

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
          {" "}
          <h1>Employees sales</h1>
          <p className="track">Manage your team performance and track employee sales activity.</p>
        </div>
        <div className="ep1">
          {" "}
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
