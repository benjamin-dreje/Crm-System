"use client";

import Link from "next/link";
import "./customers.css";
import { useState } from "react";
import { useCustomers } from "../../../hook/useCustomers";

export default function CustomersPage() {
  const { createCustomer, isCreating, deleteCustomer } = useCustomers();
  const [button, setButton] = useState(false);
  const [createdMessage, setCreatedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",

    address: {
      city: "",
      street: "",
      houseNumber: "",
      apartment: "",
      entrance: "",
    },
  });

  const dummyCustomers = [
    {
      id: "6a50bfac6e73ed95540993e7",
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

  const handleCreateCustomer = async () => {
    try {
      await createCustomer(customer);
      setCreatedMessage(true);

      setCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",

        address: {
          city: "",
          street: "",
          houseNumber: "",
          apartment: "",
          entrance: "",
        },
      });

      setTimeout(() => {
        setCreatedMessage(false);
        setButton(false);
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteButton = async (id) => {
    try {
      const response = await deleteCustomer(id);

      setSuccessMessage(response.message || "Customer deleted successfully");

      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  if (button) {
    return (
      <div className="add-customer-form">
        {createdMessage && (
          <div className="userIsCreatedMessage">
            {"Customer created successfully"}
          </div>
        )}

        {errorMessage && <div className="error">{errorMessage} </div>}

        <h2>Add New Customer</h2>

        <div className="form-container">
          {/* פרטים אישיים */}
          <div className="form-section">
            <input
              placeholder="First Name"
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  firstName: e.target.value,
                })
              }
            />

            <input
              placeholder="Last Name"
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  lastName: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="ID Number"
              value={customer.idNumber}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  idNumber: e.target.value,
                })
              }
            />
          </div>

          {/* כתובת */}
          <div className="address-section-two">
            <input
              placeholder="City"
              value={customer.address.city}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: {
                    ...customer.address,
                    city: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="Street"
              value={customer.address.street}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: {
                    ...customer.address,
                    street: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="House Number"
              value={customer.address.houseNumber}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: {
                    ...customer.address,
                    houseNumber: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="Apartment"
              value={customer.address.apartment}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: {
                    ...customer.address,
                    apartment: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="Entrance"
              value={customer.address.entrance}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: {
                    ...customer.address,
                    entrance: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        <button
          className="btn-save"
          onClick={handleCreateCustomer}
          disabled={isCreating}
        >
          {isCreating ? "Saving..." : "Save Customer"}
        </button>

        <button className="btn-back" onClick={() => setButton(false)}>
          Back
        </button>
      </div>
    );
  }
  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Customers Management</h1>

          <p>View, edit and manage all your CRM customers.</p>
        </div>

        <button className="btn-add" onClick={() => setButton(true)}>
          + Add Customer
        </button>
      </div>
      {successMessage && (
        <div className="userIsCreatedMessage">{successMessage}</div>
      )}
      {errorMessage && <div className="error">{errorMessage}</div>}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search customers by name, email or phone number..."
          className="search-input"
        />
      </div>

      {/* cards */}
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
                <span>Phone</span>

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

              <div>
                <span>
                  {" "}
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteButton(customer.id)}
                  >
                    delete
                  </button>
                </span>
              </div>
            </div>

            <Link href={`/crm/customer/${customer.id}`} className="btn-view">
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Phone</th>

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

                <td>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      handleDeleteButton(customer.id);
                    }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
