"use client";

import React from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Header from "@/components/Header"; 
import SellerHeader from "@/components/SellerHeader";

export default function RoleBasedHeader() {
  const { user, isLoading } = useAuth();

  // While loading, keep header space to prevent layout shift
  if (isLoading) {
    return (
      <div className="site-header" style={{ height: "75px" }} />
    );
  }

  // Check if user is logged in and has SELLER or ADMIN role
  if (user?.isLoggedIn && (user.role === "SELLER" || user.role === "ADMIN")) {
    return <SellerHeader />;
  }

  // For customers and non-logged-in users, show regular header
  return <Header />;
}