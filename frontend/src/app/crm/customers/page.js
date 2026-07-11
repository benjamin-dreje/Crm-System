"use client";

import "./customers.css";
import { useState } from "react";
import { useCustomers } from "../../../hook/useCustomers";
import CardCustomers from "../component/cardcustomers/page";
import TableCustomers from "../component/cardTable/page";
import Loading from "../component/loading/loading";

export default function CustomersPage() {
  const {
    customers,
    isLoadingCustomers,
    createCustomer,
    isCreating,
    deleteCustomer,
  } = useCustomers();
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

  if (isLoadingCustomers) {
    return <Loading />;
  }
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
        {customers?.map((customer) => (
          <CardCustomers
            customer={customer}
            handleDeleteButton={handleDeleteButton}
            key={customer._id}
          />
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
            {customers?.map((customer) => (
              <TableCustomers
                customer={customer}
                handleDeleteButton={handleDeleteButton}
                key={customer._id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
