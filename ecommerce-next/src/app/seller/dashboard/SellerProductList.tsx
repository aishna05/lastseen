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
  const [form, setForm] = useState({
    title: "",
    price: "",
    discount: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchProducts() {
    const res = await fetch("/api/seller/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body: any = {
      title: form.title,
      price: parseFloat(form.price),
      discount: form.discount ? parseFloat(form.discount) : null,
    };

    if (editingId) {
      const res = await fetch(`/api/seller/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditingId(null);
        setForm({ title: "", price: "", discount: "" });
        fetchProducts();
      }
    } else {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setForm({ title: "", price: "", discount: "" });
        fetchProducts();
      }
    }
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      discount: p.discount != null ? String(p.discount) : "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/seller/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchProducts();
    }
  }

  return (
    <div className="seller-dashboard-grid">
      <div>
        <h2 className="section-title">Your Products</h2>

        <ul className="product-list-container">
          {Array.isArray(products) &&
            products.map((p) => (
              <li key={p.id} className="product-list-item card-soft">
                <div>
                  <p className="product-item-title">{p.title}</p>

                  <p className="product-item-price-info">
                    Price:{" "}
                    <span className="text-primary-dark">₹{p.price}</span>{" "}
                    {p.discount
                      ? `(Discount: ${p.discount}% → Final: ₹${(
                          p.price *
                          (1 - p.discount / 100)
                        ).toFixed(2)})`
                      : null}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="btn-link" onClick={() => handleEdit(p)}>
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
      </div>

      <div>
        <h2 className="section-title">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

      <SellerProductForm onSubmit={function (payload: any): Promise<void> {
          throw new Error("Function not implemented.");
        } } />
      </div>
    </div>
  );
}
