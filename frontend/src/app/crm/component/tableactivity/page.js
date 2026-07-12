export default function TableActivity({ customer }) {
  return (
    <tr>
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
      <td className="notes-cell">{customer?.performedBy ?? "-"}</td>
    </tr>
  );
}
