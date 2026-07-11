export default function TableActivity({ customer }) {
  return (
    <tr>
      <td className="createdAt">
        {new Date(customer?.createdAt).toLocaleDateString() ?? "-"}
      </td>

      <td>
        <span className={`status-badge ${customer?.statusAtTime}`}>
          {customer?.statusAtTime ?? "-"}
        </span>
      </td>

      <td className="customer-name">
        {`${customer?.customerId?.firstName ?? ""} ${
          customer?.customerId?.lastName ?? ""
        }`.trim() || "-"}
      </td>

      <td className="notes-cell">{customer?.notes ?? "-"}</td>
    </tr>
  );
}
