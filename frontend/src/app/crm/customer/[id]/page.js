"use client";

import { useState } from "react";
import Loading from "../../component/loading/loading";
import { useParams } from "next/navigation";
import { useCustomers } from "../../../../hook/useCustomers";
import "./customer.css";
import TableActivity from "../../component/tableactivity/page";
import { useActivities } from "../../../../hook/useActivities";

export default function CustomerPage() {
  const { id } = useParams();

  const { customer, isLoadingDetail, updateCustomer, isUpdating } =
    useCustomers(id);

  const { activities } = useActivities(customer?._id);
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

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
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
      <div className="customer-info-section">
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
              {isEditing ? (
                <input
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                />
              ) : (
                <span>{customer.firstName || "-"}</span>
              )}
            </div>

            <div className="customer-info-item">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                />
              ) : (
                <span>{customer.lastName || "-"}</span>
              )}
            </div>

            <div className="customer-info-item">
              <label>Email</label>
              {isEditing ? (
                <input
                  value={formData.email}
                  onChange={handleChange("email")}
                />
              ) : (
                <span>{customer.email || "-"}</span>
              )}
            </div>

            <div className="customer-info-item">
              <label>Phone</label>
              {isEditing ? (
                <input
                  value={formData.phone}
                  onChange={handleChange("phone")}
                />
              ) : (
                <span>{customer.phone || "-"}</span>
              )}
            </div>

            <div className="customer-info-item">
              <label>ID Number</label>
              {isEditing ? (
                <input
                  value={formData.idNumber}
                  onChange={handleChange("idNumber")}
                />
              ) : (
                <span>{customer.idNumber || "-"}</span>
              )}
            </div>
          </div>
          <div className="address-section">
            <div className="section-title">
              <h2>Address</h2>
            </div>

            <div className="customer-info-wrapper">
              <div className="customer-info-item">
                <label>City</label>
                {isEditing ? (
                  <input
                    value={formData.address.city}
                    onChange={handleAddressChange("city")}
                  />
                ) : (
                  <span>{customer.address?.city || "-"}</span>
                )}
              </div>

              <div className="customer-info-item">
                <label>Street</label>
                {isEditing ? (
                  <input
                    value={formData.address.street}
                    onChange={handleAddressChange("street")}
                  />
                ) : (
                  <span>{customer.address?.street || "-"}</span>
                )}
              </div>

              <div className="customer-info-item">
                <label>House Number</label>
                {isEditing ? (
                  <input
                    value={formData.address.houseNumber}
                    onChange={handleAddressChange("houseNumber")}
                  />
                ) : (
                  <span>{customer.address?.houseNumber || "-"}</span>
                )}
              </div>

              <div className="customer-info-item">
                <label>Apartment</label>
                {isEditing ? (
                  <input
                    value={formData.address.apartment}
                    onChange={handleAddressChange("apartment")}
                  />
                ) : (
                  <span>{customer.address?.apartment || "-"}</span>
                )}
              </div>

              <div className="customer-info-item">
                <label>Entrance</label>
                {isEditing ? (
                  <input
                    value={formData.address.entrance}
                    onChange={handleAddressChange("entrance")}
                  />
                ) : (
                  <span>{customer.address?.entrance || "-"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="customer-activities">
          <div className="header-activity">
            <div className="title-activity">
              <h2>customer avtivity</h2>
            </div>
            <div className="add-activity-btn">
              <button> add activity</button>
            </div>
          </div>
          <div className="table-container-two">
            <table className="customers-table activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {activities?.length > 0 ? (
                  activities.map((activity) => (
                    <TableActivity customer={activity} key={activity._id} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-table">
                      No activities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
