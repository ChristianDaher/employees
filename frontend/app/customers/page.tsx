"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { Customer } from "@/utils/interfaces/models";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customers`)
      .then((response) => response.json())
      .then((data: Customer[]) => setCustomers(data));
  }, []);

  return (
    <AuthLayout>
      {customers ? (
        customers.map((customer: Customer) => (
          <div key={customer.id}>
            {customer.name}
            {customer.phoneNumber}
            {customer.note}
            {customer.customerCode}
            {customer.accountNumber}
            {customer.region.name}
          </div>
        ))
      ) : (
        <Loading />
      )}
    </AuthLayout>
  );
}
