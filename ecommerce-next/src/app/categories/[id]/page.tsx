"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useParams, useRouter } from "next/navigation";
import { Buffer } from "buffer";

interface Product {
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

const handleAddToCart = async (productId: number) => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    alert("Please log in to add items to your cart.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    console.error("Error adding to cart:", error);
    alert("An unexpected error occurred.");
  }
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fetch category details
    fetch(`/api/categories/${categoryId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setCategory(data);
      })
      .catch((err) => {
        console.error("Error fetching category:", err);
      });

    // Fetch all products
    fetch("/api/product")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          // Filter products for this category
          const filtered = data.filter(
            (p: Product) => p.categoryId === Number(categoryId)
          );
          setProducts(filtered);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return (
    <main className="category-page-shell">
      <div className="page-shell">
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1.5rem",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h1 className="heading-main">
          {category ? category.name : "Loading..."}
        </h1>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Loading products...
          </p>
        ) : (
          <section className="product-grid" aria-live="polite">
            {products.length === 0 ? (
              <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
                No products found in this category.
              </p>
            ) : (
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    imageUrls: Buffer.from(p.imageUrls).toString("base64"),
                  }}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}
