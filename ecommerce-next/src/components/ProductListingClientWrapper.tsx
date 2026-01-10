// /src/components/products/ProductListingClientWrapper.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
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
    categoryId?: number | null;
    categoryName?: string | null;
}

interface Category {
  id: number;
  name: string;
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true;
        fetch('/api/categories')
            .then(r => r.json())
            .then(data => {
                if (!mounted) return;
                if (Array.isArray(data)) setCategories(data.map((c: any) => ({ id: c.id, name: c.name })));
            })
            .catch(() => {});
        return () => { mounted = false };
    }, []);

    const filtered = useMemo(() => {
        if (!selectedCategory) return products;
        return products.filter(p => p.categoryId === selectedCategory);
    }, [products, selectedCategory]);
    return (
        <section className="product-listing-section">
            {/* 1. Replaced inline style with global CSS class for max-width and centering */}
            <div className="page-shell"> 
                {/* 2. Used h1 and the global CSS animation (fadeSlideUp) is assumed to be handled globally by h1 selector */}
                <h1 className="heading-main">
                    All Products
                </h1>
                
                {/* 3. Replaced Tailwind grid with custom CSS class name */}
                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                    <label style={{alignSelf: 'center', marginRight: 8}}>Category:</label>
                    <select value={selectedCategory ?? ''} onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}>
                        <option value="">All</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="product-grid">
                    {filtered.map((p) => {
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