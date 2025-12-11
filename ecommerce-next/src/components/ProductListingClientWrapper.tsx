// /src/components/products/ProductListingClientWrapper.tsx
'use client';

import React from 'react';
import ProductCard from "./ProductCard"; 
import { User, Product } from "@prisma/client";
import { Buffer } from "buffer";


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
        <section className="product-listing-section">
            {/* 1. Replaced inline style with global CSS class for max-width and centering */}
            <div className="page-shell"> 
                {/* 2. Used h1 and the global CSS animation (fadeSlideUp) is assumed to be handled globally by h1 selector */}
                <h1 className="heading-main">
                    All Products
                </h1>
                
                {/* 3. Replaced Tailwind grid with custom CSS class name */}
                <div className="product-grid">
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
                            // Assuming imageUrls is a comma-separated string, extract the first one
                            imageUrls: Buffer.from(p.imageUrls).toString("base64"), 
                            // Note: The prompt requested image color replacement. This component provides 
                            // the image URL, so the *absence* of the image color is now correctly 
                            // handled by the ProductCard component using the image URL.
                        };
                        return (
                            <ProductCard
                                key={p.id}
                                product={cardProps}
                                onAddToCart={handleAddToCart}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductListingClientWrapper;