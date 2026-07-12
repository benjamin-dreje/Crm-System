import Link from "next/link";
export default function TableCustomersPage({ customer, handleDeleteButton }) {
  return (
    <tr>
      <td className="customer-name">
        {`${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim() ||
          "-"}
      </td>

      <td>{customer?.phone ?? "-"}</td>

      <td>{customer?.email ?? "-"}</td>

      <td>
        <span
          className={`status-badge ${customer?.status?.toLowerCase() ?? "lead"}`}
        >
          {customer?.status ?? "lead"}
        </span>
      </td>

      <td>
        <Link href={`/crm/customer/${customer?._id}`} className="btn-view">
          View Profile
        </Link>
      </td>

      <td>
        <button
          className="btn-delete"
          onClick={() => handleDeleteButton(customer?._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
