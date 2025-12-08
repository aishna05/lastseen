// /src/components/products/ProductListingClientWrapper.tsx
'use client';

import React from 'react';
import ProductCard from "./ProductCard"; 
import { User, Product } from "@prisma/client";

// Define the expected structure for the product data from the server
type ProductWithSeller = Product & {
    seller: User;
    discount: number | null; 
    imageUrls: string;
};

interface ProductListingProps {
    products: ProductWithSeller[];
}

// Client-side function that makes the POST request to the API
const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        alert("Please log in to add items to your cart.");
        window.location.href = '/login'; 
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ productId: productId, quantity: 1 }), 
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Success! Item added to cart.`);
        } else {
            alert(`Failed to add item: ${data.message || data.error}`);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An unexpected error occurred.');
    }
};


const ProductListingClientWrapper: React.FC<ProductListingProps> = ({ products }) => {
    return (
        // Apply the same section styling from your original code
        <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 6vw, 10.5rem)' }}>
            <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                <h1 className="text-3xl font-semibold mb-6" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
                    All Products
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((p) => {
                        // Calculate final price on the client (or keep it on the server if possible)
                        const finalPrice = p.discount
                            ? p.price * (1 - (p.discount || 0) / 100)
                            : p.price;

                        // Map the full Prisma product object to the expected ProductCard props
                        const cardProps = {
                            id: p.id,
                            title: p.title,
                            price: finalPrice,
                            imageUrls: p.imageUrls.split(',')[0] || '', // Assuming you want the first image
                            // Note: ProductCard only shows price/name/cart button, not seller info
                        };
                        return (
                            <ProductCard
                                key={p.id}
                                product={cardProps}
                                onAddToCart={handleAddToCart} // Now correctly passed from a client component!
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductListingClientWrapper;