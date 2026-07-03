"use client";

import { useParams } from "next/navigation";
export default function CustomerPage() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useCustomer(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <h1>{data.firstName}</h1>
      <p>{data.email}</p>
    </div>
  );
}
