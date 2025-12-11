// /src/components/products/ProductListingClientWrapper.tsx
'use client';

import React from 'react';
import ProductCard from "./ProductCard"; 
import { Buffer } from "buffer";

// Simplified product display type
interface ProductDisplay {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    discount: number | null;
    imageUrls: string;
    sellerName: string;
}

interface ProductListingProps {
    products: ProductDisplay[];
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
                        // Map to ProductCard props
                        const cardProps = {
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            imageUrls: Buffer.from(p.imageUrls).toString("base64"), 
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