// File: components/SellerProductList.tsx
"use client";

import React, { useEffect, useState } from "react";
import SellerProductForm from "./SellerProductForm";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount?: number | null;
  imageUrls: string;
  categoryId: number;
  subcategoryId: number;
  sellerId: number;
  [key: string]: any;
}

export default function SellerProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/seller/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleCreate(payload: any) {
    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      fetchProducts();
      setEditing(null);
    } else {
      alert("Create failed");
    }
  }

  async function handleUpdate(payload: any) {
    if (!editing) return;
    const res = await fetch(`/api/seller/products/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      fetchProducts();
      setEditing(null);
    } else {
      alert("Update failed");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
    else alert("Delete failed");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <button className="text-sm underline" onClick={() => setEditing({})}>
            + Add
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p.id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm">
                    Price: ₹{p.price} {p.discount ? `(Disc ${p.discount}% → ₹${(p.price * (1 - p.discount/100)).toFixed(2)})` : null}
                  </p>
                  <p className="text-xs text-gray-600">Brand: {p.brand || "-"} • Gender: {p.gender}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm underline" onClick={() => setEditing(p)}>Edit</button>
                  <button className="text-sm text-red-600 underline" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">{editing?.id ? "Edit Product" : "Add Product"}</h2>
        <SellerProductForm
          initial={editing}
          onSubmit={editing?.id ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
        />
      </div>
    </div>
  );
}




