"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push("/departments");
  }, []);

  return (
    <main className="min-h-screen flex justify-center items-center">
      <Loading />
    </main>
  );
}
