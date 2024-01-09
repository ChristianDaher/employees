"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { Contact, Customer } from "@/utils/interfaces";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contacts`)
      .then((response) => response.json())
      .then((data: Contact[]) => setContacts(data));
  }, []);

  return (
    <AuthLayout>
      {contacts ? (
        contacts.map((contact: Contact) => (
          <div key={contact.id}>
            {contact.firstName}
            {contact.lastName}
            {contact.KOL}
            {contact.phoneNumber}
            {contact.email}
            {contact.title}
            {contact.note}
            {contact.department.name}
            {contact.customers
              ? contact.customers.map((customer: Customer) => (
                  <div key={customer.id}>{customer.name}</div>
                ))
              : null}
          </div>
        ))
      ) : (
        <Loading />
      )}
    </AuthLayout>
  );
}
