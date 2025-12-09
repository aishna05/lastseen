"use client";

import React from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Header from "@/components/Header"; 
import SellerHeader from "@/components/SellerHeader";
// If you ever use SellerHeader in future, import it similarly.

export default function RoleBasedHeader() {
  const { user, isLoading } = useAuth();

  // While loading, keep header space to prevent layout shift
  if (isLoading) {
    return (
      <div className="site-header" style={{ height: "75px" }} />
    );
  }

  // If unified Header handles all roles:
  // return <Header />;

  
  // If you want to switch based on role in the future:

  if (user) {
    if (user.role === "SELLER" || user.role === "ADMIN") {
      return <SellerHeader />;
    }
    return <Header />; // Customer
  }

  // Not logged in → public header
  return <Header />;
  
}
