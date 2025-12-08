// /src/components/products/ProductListingClient.tsx
'use client';

import React from 'react';
import ProductCard from './ProductCard'; // Assuming ProductCard is in the same directory

// Define the expected prop type based on what the server component passes
interface ProductListingClientProps {
    products: Array<{
        id: number;
        title: string;
        price: number;
        imageUrls: string;
        // ... any other static data
    }>;
}

// Define the client-side event handler here
const handleAddToCart = (productId: number) => {
    // This function can use state, context, or client-side API calls
    console.log(`[CLIENT ACTION]: Add Product ${productId} to cart.`);
    alert(`Product ${productId} added to cart! (Placeholder action)`);
    // In a real app, you would dispatch a cart context update or call an API route.
};

const ProductListingClient: React.FC<ProductListingClientProps> = ({ products }) => {
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
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddToCart} // Now, this function is defined within a Client Component!
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductListingClient;