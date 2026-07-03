"use client";

import Link from "next/link";
import "./customers.css";
// ייבוא ה-Hook שלך (אם הוא מחזיר את כל הלקוחות, או שנשתמש ברשימה זמנית)
// import { useCustomers } from "@/hook/useCustomers";

export default function CustomersPage() {
  // רשימת לקוחות לדוגמה (במציאות זה יגיע מה-Hook או ה-API שלך)
  const dummyCustomers = [
    {
      id: "6a35a72d4aeb7cd0d4ec4ba7",
      name: "Alex Johnson",
      email: "alex@example.com",
      status: "Active",
      company: "TechCorp",
    },
    {
      id: "2",
      name: "Sarah Miller",
      email: "sarah@example.com",
      status: "Pending",
      company: "DesignStudio",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      status: "Active",
      company: "LogiChain",
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma@example.com",
      status: "Inactive",
      company: "FinTech",
    },
  ];

  return (
    <div className="customers-page">
      {/* כותרת העמוד ופעולות מהירות */}
      <div className="page-header">
        <div>
          <h1>Customers Management</h1>
          <p>View, edit and manage all your CRM customers.</p>
        </div>
        <button className="btn-add">+ Add Customer</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search customers by name, email or phone number..."
          className="search-input"
        />
      </div>

      {/* טבלת הלקוחות */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="customer-name">{customer.name}</td>
                <td>{customer.company}</td>
                <td>{customer.email}</td>
                <td>
                  <span
                    className={`status-badge ${customer.status.toLowerCase()}`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td>
                  {/* ניתוב דינמי לעמוד הלקוח הספציפי לפי ה-ID שלו */}
                  <Link
                    href={`/crm/customer/${customer.id}`}
                    className="btn-view"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
