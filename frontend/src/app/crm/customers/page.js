"use client";

import Link from "next/link";
import "./customers.css";

export default function CustomersPage() {
  const dummyCustomers = [
    {
      id: "6a508dbc22005d5c979ccdd0",
      name: "Alex Johnson",
      email: "alex@example.com",
      status: "Active",
      phone: "054545181",
    },
    {
      id: "2",
      name: "Sarah Miller",
      email: "sarah@example.com",
      status: "Pending",
      phone: "556565656",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      status: "Active",
      phone: "556566665656",
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma@example.com",
      status: "Inactive",
      phone: "556562335656",
    },
  ];

  return (
    <div className="customers-page">
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

      {/* Mobile Cards */}
      <div className="customers-cards">
        {dummyCustomers.map((customer) => (
          <div className="customer-card" key={customer.id}>
            <div className="customer-card-header">
              <div className="avatar">{customer.name.charAt(0)}</div>

              <div>
                <h3>{customer.name}</h3>

                <p>{customer.email}</p>
              </div>
            </div>

            <div className="customer-card-info">
              <div>
                <span>phone</span>

                <strong>{customer.phone}</strong>
              </div>

              <div>
                <span>Status</span>

                <span
                  className={`status-badge ${customer.status.toLowerCase()}`}
                >
                  {customer.status}
                </span>
              </div>
            </div>

            <Link href={`/crm/customer/${customer.id}`} className="btn-view">
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {dummyCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="customer-name">{customer.name}</td>

                <td>{customer.phone}</td>

                <td>{customer.email}</td>

                <td>
                  <span
                    className={`status-badge ${customer.status.toLowerCase()}`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td>
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
