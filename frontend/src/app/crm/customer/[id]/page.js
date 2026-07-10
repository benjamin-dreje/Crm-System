"use client";

import Loading from "../../component/loading/loading";
import { useParams } from "next/navigation";
import { useCustomers } from "../../../../hook/useCustomers";
import "./customer.css";

export default function CustomerPage() {
  const { id } = useParams();

  const { customer, isLoadingDetail } = useCustomers(id);

  if (isLoadingDetail) return <Loading />;

  if (!customer) return <div className="not-found">Customer not found</div>;

  return (
    <div className="customer-details">
      <div className="customer-details-header">
        <div>
          <h1>Customer Details</h1>
          <p>Manage customer information</p>
        </div>

        <button className="save-btn">Save Changes</button>
      </div>

      <div className="customer-card">
        <div className="section-title">
          <h2>Customer Information</h2>
        </div>

        <div className="customer-info-wrapper">
          <div className="customer-info-item">
            <label>First Name</label>
            <input value={customer.firstName} readOnly />
          </div>

          <div className="customer-info-item">
            <label>Last Name</label>
            <input value={customer.lastName} readOnly />
          </div>

          <div className="customer-info-item">
            <label>Email</label>
            <input value={customer.email} readOnly />
          </div>

          <div className="customer-info-item">
            <label>Phone</label>
            <input value={customer.phone} readOnly />
          </div>
        </div>


        <div className="address-section">
          <div className="customer-info-wrapper">
            <div className="customer-info-item">
              <label>City</label>
              <input value={customer.address?.city || ""} readOnly />
            </div>

            <div className="customer-info-item">
              <label>Street</label>
              <input value={customer.address?.street || ""} readOnly />
            </div>

            <div className="customer-info-item">
              <label>House Number</label>
              <input value={customer.address?.houseNumber || ""} readOnly />
            </div>

            <div className="customer-info-item">
              <label>Apartment</label>
              <input value={customer.address?.apartment || ""} readOnly />
            </div>

            <div className="customer-info-item">
              <label>Entrance</label>
              <input value={customer.address?.entrance || ""} readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
