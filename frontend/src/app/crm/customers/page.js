"use client";

import "./customers.css";
import { useState } from "react";
import { useCustomers } from "../../../hook/useCustomers";
import CardCustomers from "../component/cardcustomers/CardCustomers";
import TableCustomers from "../component/cardTable/cardTable";
import Loading from "../component/loading/loading";

export default function CustomersPage() {
  const {
    customers,
    isLoadingCustomers,
    createCustomer,
    isCreating,
    deleteCustomer,
  } = useCustomers();

  // States
  const [button, setButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");

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

  // פונקציות עזר להצגת הודעות ואיפוסן אוטומטית
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const filteredCustomers = customers?.filter((cust) => {
    const searchValue = search.toLowerCase();
    return (
      cust.firstName?.toLowerCase().includes(searchValue) ||
      cust.lastName?.toLowerCase().includes(searchValue) ||
      cust.email?.toLowerCase().includes(searchValue) ||
      cust.phone?.includes(searchValue) ||
      cust.idNumber?.includes(searchValue)
    );
  });

  if (isLoadingCustomers) {
    return <Loading />;
  }

  // הוספת לקוח
  const handleCreateCustomer = async () => {
    try {
      await createCustomer(customer);
      showSuccess("Customer created successfully!");

      // איפוס הטופס
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

      // סגירת טופס ההוספה לאחר שנייה וחצי
      setTimeout(() => {
        setButton(false);
      }, 1500);
    } catch (error) {
      showError(error.message || "Failed to create customer");
    }
  };

  // מחיקת לקוח
  const handleDeleteButton = async (id) => {
    try {
      const response = await deleteCustomer(id);
      showSuccess(response?.message || "Customer deleted successfully");
    } catch (error) {
      showError(error.message || "Failed to delete customer");
    }
  };

  // ---------------------------------------------------------------------------
  // 1. מסך טופס הוספת לקוח
  // ---------------------------------------------------------------------------
  if (button) {
    return (
      <div className="add-customer-form">
        {/* הודעות הצלחה ושגיאה בתוך הטופס */}
        {successMessage && (
          <div className="alert-message alert-success">
            <i className="fa-solid fa-circle-check"></i> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert-message alert-error">
            <i className="fa-solid fa-triangle-exclamation"></i> {errorMessage}
          </div>
        )}

        <h2>Add New Customer</h2>

        <div className="form-container">
          {/* פרטים אישיים */}
          <div className="form-section">
            <input
              placeholder="First Name"
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({ ...customer, firstName: e.target.value })
              }
            />
            <input
              placeholder="Last Name"
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({ ...customer, lastName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
            <input
              placeholder="ID Number"
              value={customer.idNumber}
              onChange={(e) =>
                setCustomer({ ...customer, idNumber: e.target.value })
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
                  address: { ...customer.address, city: e.target.value },
                })
              }
            />
            <input
              placeholder="Street"
              value={customer.address.street}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: { ...customer.address, street: e.target.value },
                })
              }
            />
            <input
              placeholder="House Number"
              value={customer.address.houseNumber}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: { ...customer.address, houseNumber: e.target.value },
                })
              }
            />
            <input
              placeholder="Apartment"
              value={customer.address.apartment}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: { ...customer.address, apartment: e.target.value },
                })
              }
            />
            <input
              placeholder="Entrance"
              value={customer.address.entrance}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: { ...customer.address, entrance: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="form-actions">
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
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. מסך רשימת הלקוחות הראשית
  // ---------------------------------------------------------------------------
  return (
    <div className="customers-page">
      {/* הודעות הצלחה ושגיאה בראש העמוד */}
      {successMessage && (
        <div className="alert-message alert-success">
          <i className="fa-solid fa-circle-check"></i> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert-message alert-error">
          <i className="fa-solid fa-triangle-exclamation"></i> {errorMessage}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Customers Management</h1>
          <p>View, add and manage customers.</p>
        </div>

        <button className="btn-add" onClick={() => setButton(true)}>
          + Add Customer
        </button>
      </div>

      {/* חיפוש */}
      <div className="search-container">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          placeholder="Search customers by name, email or phone number..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* כרטיסיות */}
      <div className="customers-cards">
        {filteredCustomers?.map((cust) => (
          <CardCustomers
            customer={cust}
            handleDeleteButton={handleDeleteButton}
            key={cust._id}
          />
        ))}
      </div>

      {/* טבלה */}
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
            {filteredCustomers?.map((cust) => (
              <TableCustomers
                customer={cust}
                handleDeleteButton={handleDeleteButton}
                key={cust._id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
