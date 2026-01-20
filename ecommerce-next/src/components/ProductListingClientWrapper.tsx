// /src/components/products/ProductListingClientWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard"; 
import { Buffer } from "buffer";
// import { useRouter } from "next/navigation"; // Unused

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
    // router removed as we are filtering in-place
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | string>("");
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => {
                if (!mounted) return;
                if (Array.isArray(data)) {
                    const cats = data.map((c: any) => ({ id: c.id, name: c.name }));
                    setCategories(cats);
                    setSelectedCategory(""); // Show all products by default
                }
            })
            .catch(() => {})
            .finally(() => { if (mounted) setLoadingCategories(false); });

        return () => { mounted = false };
    }, []);

    // Handle category selection (IN-PLACE FILTERING)
    const handleCategoryClick = (categoryId: number | string) => {
        setSelectedCategory(categoryId);
        // Removed router.push to keep filtering on the same page
    };

    // Filter products by selected category
    const filtered = selectedCategory 
        ? products.filter((p) => p.categoryId === Number(selectedCategory))
        : products;

    return (
        <section className="product-listing-section">
            <div className="page-shell"> 
                <h1 className="heading-main">
                    All Products
                </h1>

                {/* ✅ NEW: Category Navigation Bar */}
                <div className="category-nav-container" style={{ 
                    marginBottom: "2rem", 
                    overflowX: "auto", 
                    whiteSpace: "nowrap",
                    display: "flex",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    // Hide scrollbar for cleaner look
                    scrollbarWidth: "none", 
                    msOverflowStyle: "none"
                }}>
                    {/* "All" Option */}
                    <button 
                        onClick={() => handleCategoryClick("")}
                        className={`category-nav-item ${selectedCategory === "" ? "active" : ""}`}
                        style={{
                            padding: "0.5rem 1.5rem",
                            borderRadius: "30px",
                            border: selectedCategory === "" ? "none" : "1px solid var(--border-subtle)",
                            backgroundColor: selectedCategory === "" ? "var(--primary)" : "transparent",
                            color: selectedCategory === "" ? "white" : "var(--text-main)",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            transition: "all 0.3s ease",
                            whiteSpace: "nowrap"
                        }}
                    >
                        All
                    </button>

                    {/* Dynamic Categories */}
                    {categories.map((c) => (
                        <button 
                            key={c.id}
                            onClick={() => handleCategoryClick(c.id)}
                            className={`category-nav-item ${selectedCategory === c.id ? "active" : ""}`}
                            style={{
                                padding: "0.5rem 1.5rem",
                                borderRadius: "30px",
                                border: selectedCategory === c.id ? "none" : "1px solid var(--border-subtle)",
                                backgroundColor: selectedCategory === c.id ? "var(--primary)" : "transparent",
                                color: selectedCategory === c.id ? "white" : "var(--text-main)",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                transition: "all 0.3s ease",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
                
                <div className="product-grid">
                    {filtered.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: "3rem" }}>
                            <p style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>No products found in this category.</p>
                            <button 
                                onClick={() => setSelectedCategory("")}
                                style={{ marginTop: "1rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                            >
                                View all products
                            </button>
                        </div>
                    ) : (
                        filtered.map((p) => {
                            // Map to ProductCard props
                            const cardProps = {
                                title: p.title,
                                price: p.price,
                                imageUrls: Buffer.from(p.imageUrls).toString("base64"),
                                id: p.id,
                            };
                            return (
                                <ProductCard
                                    key={p.id}
                                    product={cardProps}
                                    onAddToCart={handleAddToCart}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductListingClientWrapper;