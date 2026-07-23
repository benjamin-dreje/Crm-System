"use client";
import React, { useState } from "react";
// יבוא ההוק המרכזי שלך
import { useActivities } from "../../../../hook/useActivities"; // וודא שהנתיב נכון

export default function TableActivity({
  customer,
  statusesList,
  onUpdateSuccess,
}) {
  // חילוץ ה-IDs מתוך ה-customer
  const customerId = customer?.customerId?._id || customer?.customerId;
  const activityId = customer?._id;

  // שימוש בהוק שלך
  const { updateCustomerStatus, isUpdatingStatus } = useActivities(customerId);

  // ניהול State מקומי לתצוגה ופופ-אפ
  const [status, setStatus] = useState(customer?.statusAtTime || "");
  const [pendingStatus, setPendingStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closedAmount, setClosedAmount] = useState("");

  const availableStatuses = statusesList || [
    { value: "lead", label: "Lead" },
    { value: "in_progress", label: "In Progress" },
    { value: "pending", label: "Pending" },
    { value: "closed_won", label: "Closed Won" },
    { value: "rejected", label: "Rejected" },
  ];

  // שינוי הסטטוס ב-Select
  const handleStatusChange = async (e) => {
    const selectedStatus = e.target.value;

    if (selectedStatus === "closed_won" || selectedStatus === "closed") {
      setPendingStatus(selectedStatus);
      setIsModalOpen(true);
    } else {
      try {
        await updateCustomerStatus({
          customerId,
          activityId,
          status: selectedStatus,
        });
        setStatus(selectedStatus);
        if (onUpdateSuccess) onUpdateSuccess();
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("Failed to update status");
      }
    }
  };

  // שמירת הסכום מהמודאל
  const handleSaveAmount = async () => {
    if (!closedAmount || Number(closedAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const targetStatus = pendingStatus || "closed_won";

    try {
      await updateCustomerStatus({
        customerId,
        activityId,
        status: targetStatus,
        amount: Number(closedAmount),
      });

      setStatus(targetStatus);
      setIsModalOpen(false);
      setPendingStatus("");
      setClosedAmount("");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  // ביטול בחלון הקופץ
  const handleCancel = () => {
    setPendingStatus("");
    setIsModalOpen(false);
    setClosedAmount("");
  };

  return (
    <tr style={{ opacity: isUpdatingStatus ? 0.6 : 1 }}>
      <td className="createdAt">
        {customer?.createdAt ? (
          <>
            <div>
              {new Date(customer.createdAt).toLocaleDateString("he-IL")}
            </div>
            <span className="activity-time">
              {new Date(customer.createdAt).toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        ) : (
          "-"
        )}
      </td>

      {/* בחירת סטטוס */}
      <td>
        <select
          value={pendingStatus || status}
          onChange={handleStatusChange}
          disabled={isUpdatingStatus}
          className={`status-badge ${pendingStatus || status}`}
        >
          {!availableStatuses.some((s) => s.value === status) && status && (
            <option value={status}>{status}</option>
          )}

          {availableStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label || item.value}
            </option>
          ))}
        </select>
      </td>

      <td className="customer-name">
        {`${customer?.customerId?.firstName ?? ""} ${
          customer?.customerId?.lastName ?? ""
        }`.trim() || "-"}
      </td>

      <td className="notes-cell">{customer?.notes ?? "-"}</td>

      <td className="notes-cell">
        {customer?.performedBy ?? "-"}

        {/* 🔧 המודאל מוכנס ישירות בתוך ה-td כדי למנוע את השגיאה ב-tbody */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Close Deal</h3>
              <p>How much was the deal closed for?</p>

              <input
                type="number"
                placeholder="Enter deal amount..."
                value={closedAmount}
                onChange={(e) => setClosedAmount(e.target.value)}
                disabled={isUpdatingStatus}
                autoFocus
              />

              <div className="modal-actions">
                <button
                  onClick={handleSaveAmount}
                  disabled={isUpdatingStatus}
                  className="btn-confirm"
                >
                  {isUpdatingStatus ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isUpdatingStatus}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
