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

  const { activities, count, addActivity, isAddingActivity } = useActivities(
    customer?._id,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // States חדשים לטיפול בהוספת Activity בלבד
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({
    statusAtTime: "in_progress",
    prices: "",
    notes: "",
  });

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

  // פונקציית השליחה החדשה להוספת Activity
  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await addActivity({
        customerId: customer._id,
        activityData: {
          statusAtTime: activityForm.statusAtTime,
          prices: Number(activityForm.prices) || 0,
          notes: activityForm.notes,
        },
      });

      setSuccessMessage("Activity added successfully!");
      setShowAddActivity(false); // סגירת הטופס
      setActivityForm({ statusAtTime: "in_progress", prices: "", notes: "" }); // איפוס הטופס

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to add activity");
      setTimeout(() => setErrorMessage(""), 3000);
    }
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
              <h2>Customer Activity</h2>
              <p className="total-activities">Total activities: {count || 0}</p>
            </div>
            <div className="add-activity-btn">
              <button
                className={showAddActivity ? "cancel-btn" : ""}
                onClick={() => setShowAddActivity((prev) => !prev)}
              >
                {showAddActivity ? "Cancel" : "+ Add Activity"}
              </button>
            </div>
          </div>

          {/* טופס הוספה שנפתח רק בלחיצה על הכפתור */}
          {showAddActivity && (
            <form
              onSubmit={handleAddActivitySubmit}
              className="add-activity-form"
            >
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={activityForm.statusAtTime}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      statusAtTime: e.target.value,
                    })
                  }
                >
                  <option value="lead">lead</option>
                  <option value="pending">pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="reject">reject</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  placeholder="Price / Amount"
                  value={activityForm.prices}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, prices: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Notes:</label>
                <input
                  type="text"
                  placeholder="Notes"
                  value={activityForm.notes}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, notes: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="save-btn"
                disabled={isAddingActivity}
              >
                {isAddingActivity ? "Saving..." : "Save Activity"}
              </button>
            </form>
          )}

          <div className="table-container-two">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Notes</th>
                  <th>performedBy</th>
                </tr>
              </thead>

              <tbody>
                {activities?.length > 0 ? (
                  activities.map((activity) => (
                    <TableActivity customer={activity} key={activity._id} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
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
