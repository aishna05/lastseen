// /src/components/products/ProductDataFetcher.tsx
import { prisma } from "@/lib/prisma";
import ProductListingClient from "./ProductListingClientWrapper";
import { Product, User } from "@prisma/client";

// Define the type for the product data fetched with the seller relation
type ProductWithSeller = Product & {
  seller: User;
  discount: number | null; 
  imageUrls: string;
};

export default async function ProductDataFetcher() {
  // 1. Fetch data on the server (Server Component)
  const products: ProductWithSeller[] = await prisma.product.findMany({
    include: { 
        seller: true,
    }, 
    orderBy: { createdAt: "desc" },
  }) as ProductWithSeller[];

  // 2. Process data on the server
  const productsForDisplay = products.map(p => {
    const finalPrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    
    return {
        id: p.id,
        title: p.title,
        price: finalPrice, 
        originalPrice: p.price,
        discount: p.discount,
        imageUrls: p.imageUrls,
        sellerName: p.seller.name,
    };
  });

  // 3. Pass *only* the static data to the client component
  return <ProductListingClient products={productsForDisplay} />;
}