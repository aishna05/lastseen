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


export default async function ProductsPage() {
  // 1. Fetch data on the server
  const products: ProductWithSeller[] = await prisma.product.findMany({
    // Include the related seller data
    include: { 
        seller: true,
        // Add categories/subcategories if needed for filtering/display
    }, 
    orderBy: { createdAt: "desc" },
  }) as ProductWithSeller[]; // Cast for type safety

  // 2. Map data for the ProductCard
  const productsForDisplay = products.map(p => {
    const finalPrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    
    // The ProductCard component expects an object with specific keys
    return {
        id: p.id,
        title: p.title,
        price: finalPrice, // Pass the final price to the card
        originalPrice: p.price,
        discount: p.discount,
        imageUrls: p.imageUrls.split(',')[0] || '', // Use the first image URL (if stored as comma-separated string)
        sellerName: p.seller.name,
    };
  });

  return (
    <div className="py-12">
      <h1 className="text-4xl mb-10" style={{color: 'var(--primary)'}}>
        All Discoveries
      </h1>
      
      {products.length === 0 ? (
        <p className="text-center mt-10" style={{color: 'var(--text-muted)'}}>
            No products found at this time. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Map over the processed data and render the reusable card */}
            {productsForDisplay.map((p) => (
                <ProductCard
                    // NOTE: Since the ProductCard contains a button and state (onAddToCart),
                    // you might need to wrap the entire mapping in a "use client" component 
                    // or pass the entire product data to a client component here.
                    // For now, we pass simple props.
                    key={p.id}
                    product={p}
                    onAddToCart={handleAddToCart} // Placeholder for the actual cart function
                />
            ))}
        </div>
      )}
    </div>
  );
}