import Link from "next/link";

export default function CardCustomersPage({ customer, handleDeleteButton }) {
  return (
    <>
      <div className="customer-card" key={customer._id}>
        <div className="customer-card-header">
          <div className="avatar">{customer.firstName?.charAt(0) ?? "?"}</div>

          <div>
            <h3>
              {customer.firstName} {customer.lastName}
            </h3>

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

            <span className="status-badge">unknown</span>
          </div>

          <div>
            <span>
              {" "}
              <button
                className="btn-delete"
                onClick={() => handleDeleteButton(customer._id)}
              >
                delete
              </button>
            </span>
          </div>
        </div>

        <Link href={`/crm/customer/${customer._id}`} className="btn-view">
          View Profile
        </Link>
      </div>
    </>
  );
}
