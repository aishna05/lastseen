"use client";

import SellerProductForm from "@/components/SellerProductForm";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  discount?: number | null;
};

export default function SellerProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ CREATE
  async function handleCreate(payload: any) {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchProducts();
      setEditing(null);
    } else {
      alert("Create failed");
    }
  }

  // ✅ UPDATE
  async function handleUpdate(payload: any) {
    if (!editing) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/product/${editing.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchProducts();
      setEditing(null);
    } else {
      alert("Update failed");
    }
  }

  // ✅ DELETE
  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) fetchProducts();
    else alert("Delete failed");
  }

  return (
    <div className="seller-dashboard-grid">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Your Products</h2>
          <button
            className="btn-ghost"
            onClick={() => setEditing(null)}   // ✅ FIXED
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="product-list-container">
            {products.map((p) => (
              <li key={p.id} className="product-list-item card-soft">
                <div>
                  <p className="product-item-title">{p.title}</p>
                  <p className="product-item-price-info">₹{p.price}</p>
                </div>

                <div className="flex gap-2">
                  <button className="btn-link" onClick={() => setEditing(p)}>
                    Edit
                  </button>

                  <button
                    className="btn-link-delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="section-title">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>

        <SellerProductForm
          initial={editing ? { ...editing, discount: editing.discount ?? undefined } as any : undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
        />
      </div>
    </div>
  );
}
