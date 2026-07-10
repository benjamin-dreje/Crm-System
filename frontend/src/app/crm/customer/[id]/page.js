"use client";

import { useState } from "react";
import Loading from "../../component/loading/loading";
import { useParams } from "next/navigation";
import { useCustomers } from "../../../../hook/useCustomers";
import "./customer.css";

export default function CustomerPage() {
  const { id } = useParams();

  const { customer, isLoadingDetail, updateCustomer, isUpdating } =
    useCustomers(id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  if (isLoadingDetail) return <Loading />;

  if (!customer) {
    return <div className="not-found">Customer not found</div>;
  }

  const handleEdit = () => {
    setFormData({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      idNumber: customer.idNumber || "",
      address: {
        city: customer.address?.city || "",
        street: customer.address?.street || "",
        houseNumber: customer.address?.houseNumber || "",
        apartment: customer.address?.apartment || "",
        entrance: customer.address?.entrance || "",
      },
    });

    setIsEditing(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateCustomer({
        id,
        customerData: formData,
      });

      setSuccessMessage(response.message || "Client updated successfully");

      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(false);
    }
  };
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddressChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: e.target.value,
      },
    }));
  };

  return (
    <div className="customer-details">
      <div className="customer-details-header">
        <div>
          <h1>Customer Details</h1>
          <p>Manage customer information</p>
        </div>

        {isEditing ? (
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        ) : (
          <button className="save-btn" onClick={handleEdit}>
            Edit Customer
          </button>
        )}
      </div>

      <div className="customer-card-page ">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="section-title">
          <h2>Customer Information</h2>
        </div>

        <div className="customer-info-wrapper">
          <div className="customer-info-item">
            <label>First Name</label>
            <input
              value={isEditing ? formData.firstName : customer.firstName}
              readOnly={!isEditing}
              onChange={handleChange("firstName")}
            />
          </div>

          <div className="customer-info-item">
            <label>Last Name</label>
            <input
              value={isEditing ? formData.lastName : customer.lastName}
              readOnly={!isEditing}
              onChange={handleChange("lastName")}
            />
          </div>

          <div className="customer-info-item">
            <label>Email</label>
            <input
              value={isEditing ? formData.email : customer.email}
              readOnly={!isEditing}
              onChange={handleChange("email")}
            />
          </div>

          <div className="customer-info-item">
            <label>Phone</label>
            <input
              value={isEditing ? formData.phone : customer.phone}
              readOnly={!isEditing}
              onChange={handleChange("phone")}
            />
          </div>

          <div className="customer-info-item">
            <label>ID Number</label>
            <input
              value={isEditing ? formData.idNumber : customer.idNumber}
              readOnly={!isEditing}
              onChange={handleChange("idNumber")}
            />
          </div>
        </div>

        <div className="address-section">
          <div className="section-title">
            <h2>Address</h2>
          </div>

          <div className="customer-info-wrapper">
            <div className="customer-info-item">
              <label>City</label>
              <input
                value={
                  isEditing
                    ? formData.address.city
                    : customer.address?.city || ""
                }
                readOnly={!isEditing}
                onChange={handleAddressChange("city")}
              />
            </div>

            <div className="customer-info-item">
              <label>Street</label>
              <input
                value={
                  isEditing
                    ? formData.address.street
                    : customer.address?.street || ""
                }
                readOnly={!isEditing}
                onChange={handleAddressChange("street")}
              />
            </div>

            <div className="customer-info-item">
              <label>House Number</label>
              <input
                value={
                  isEditing
                    ? formData.address.houseNumber
                    : customer.address?.houseNumber || ""
                }
                readOnly={!isEditing}
                onChange={handleAddressChange("houseNumber")}
              />
            </div>

            <div className="customer-info-item">
              <label>Apartment</label>
              <input
                value={
                  isEditing
                    ? formData.address.apartment
                    : customer.address?.apartment || ""
                }
                readOnly={!isEditing}
                onChange={handleAddressChange("apartment")}
              />
            </div>

            <div className="customer-info-item">
              <label>Entrance</label>
              <input
                value={
                  isEditing
                    ? formData.address.entrance
                    : customer.address?.entrance || ""
                }
                readOnly={!isEditing}
                onChange={handleAddressChange("entrance")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
