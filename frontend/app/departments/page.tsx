"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { Department } from "@/utils/interfaces/models";

export default function Departments() {
  const [departments, setDepartments] = useState<Department[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/departments`)
      .then((response) => response.json())
      .then((data: Department[]) => setDepartments(data));
  }, []);

  return (
    <AuthLayout>
      {departments ? (
        departments.map((department: Department) => (
          <div key={department.id}>{department.name}</div>
        ))
      ) : (
        <Loading />
      )}
    </AuthLayout>
  );
}
