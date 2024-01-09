'use client';

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { Region } from "@/utils/interfaces";

export default function Departments() {
  const [regions, setRegions] = useState<Region[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regions`)
      .then((response) => response.json())
      .then((data: Region[]) => setRegions(data));
  }, []);

  return (
    <AuthLayout>
      {regions ? (
        regions.map((region: Region) => (
          <div key={region.id}>{region.name}</div>
        ))
      ) : (
        <Loading />
      )}
    </AuthLayout>
  );
}
