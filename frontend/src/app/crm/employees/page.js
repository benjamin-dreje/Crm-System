"use client";

import { useSales } from "../../../hook/useSales";

export default function EmployeesPage() {
  const { sales, isLoadingSales, isErrorSales } = useSales();
  console.log("SALES DATA:", sales);
  if (isLoadingSales) {
    return <h2>Loading...</h2>;
  }

  if (isErrorSales) {
    return <h2>Failed to load employees data</h2>;
  }

  const employees = sales?.employeesAnalytics || [];

  return (
    <div>
      <h1>Employees</h1>

      <table>
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
          {employees.map((employee) => (
            <tr key={employee.user._id}>
              <td>{employee.user.name || "No name"}</td>

              <td>{employee.user.email}</td>

              <td>{employee.user.role}</td>

              <td>{employee.salesCount}</td>

              <td>${employee.totalAmount}</td>

              <td>${employee.averageSale}</td>

              <td>{new Date(employee.lastSale).toLocaleDateString("en-US")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
