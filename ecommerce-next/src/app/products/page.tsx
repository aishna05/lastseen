// /src/app/products/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import React from "react";
// Import the necessary types from Prisma for strong typing
import { Product, User } from "@prisma/client";

// Define the type for the product data fetched with the seller relation
type ProductWithSeller = Product & {
  seller: User;
  // Ensure the type includes 'discount' and 'imageUrls' as expected in your schema/logic
  discount: number | null; 
  imageUrls: string; // Adjusted to match your previous card component prop
};

// Placeholder for the client-side cart function.
// This function must be passed down and will be called by the ProductCard.
// NOTE: This file is a Server Component, so the function must be defined 
// in a Client Component or passed down from one. For simplicity here, 
// we'll keep the handler logic simple as if it were a Client Component.
const handleAddToCart = (productId: number) => {
    // In a real application, this would trigger a client-side API call
    console.log(`[CLIENT ACTION]: Add Product ${productId} to cart.`);
};
// /src/app/products/page.tsx (Now very clean and simple)

import ProductDataFetcher from "@/components/ProductDataFetcher";


// This file remains a Server Component, focusing only on rendering the fetcher.
export default function ProductsPage() {
  return (
    <ProductDataFetcher />
  );
}

