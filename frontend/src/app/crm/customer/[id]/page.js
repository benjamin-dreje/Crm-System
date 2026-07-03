"use client";
import Loading from "../../component/loading/loading";

import { useParams } from "next/navigation";
import { useCustomers } from "../../../../hook/useCustomers";

export default function CustomerPage() {
  const { id } = useParams();

  const { customer, isLoadingDetail } = useCustomers(id);

  if (isLoadingDetail) return <Loading />;

  if (!customer) return <div>Customer not found</div>;

  return (
    <div>
      <h1>{customer.firstName}</h1>
      <p>{customer.email}</p>
    </div>
  );
}
