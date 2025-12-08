
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function RequireSeller({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (!session || role !== "SELLER") {
      router.replace("/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <p className="p-4">Loading...</p>;
  const role = (session?.user as any)?.role;
  if (!session || role !== "SELLER") return null;
  return <>{children}</>;
}
