"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { useEffect, useState, useContext } from "react";
import { User } from "@/utils/interfaces/models";
import { NavbarContext } from "@/components/contexts/navbar.context";

export default function Users() {
  const [users, setUsers] = useState<User[] | null>(null);
  const { setTitle } = useContext(NavbarContext);

  setTitle("Users");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  return (
    <AuthLayout>
      {users ? (
        users.map((user: User) => (
          <div key={user.id}>
            {user.firstName}
            {user.lastName}
            {user.email}
            {user.phoneNumber}
            {user.department.name}
          </div>
        ))
      ) : (
        <Loading />
      )}
    </AuthLayout>
  );
}
