"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth"; // ✅ your actual auth system

export default function RequireSeller({ children }: { children: ReactNode }) {
  const { user } = useAuth();   // ✅ NOT useSession
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "SELLER") {
      router.replace("/"); // or /unauthorized
    }
  }, [user, router]);

  if (!user) return <p className="p-4">Loading...</p>;

  return <>{children}</>;
}