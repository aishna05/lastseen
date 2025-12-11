"use client";

import { useEffect, useState } from "react";

// Product type definition
type Product = {
  id: number;
  title: string;
  price: number;
  discount?: number | null;
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    discount: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------
  // Fetch Products
  // ---------------------------------------------------
  async function fetchProducts() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/seller/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load products.");
        setProducts([]);
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError("Network error or server issue.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------------------------------------------
  // Create or Update Product
  // ---------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required.");
      setSaving(false);
      return;
    }

    const body: any = {
      title: form.title,
      price: parseFloat(form.price),
      discount: form.discount ? parseFloat(form.discount) : null,
    };

    if (!body.title || isNaN(body.price)) {
      setError("Please enter a valid title and price.");
      setSaving(false);
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/seller/products/${editingId}`
        : "/api/seller/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setEditingId(null);
        setForm({ title: "", price: "", discount: "" });
        fetchProducts();
      } else {
        setError(
          data.message ||
            `Failed to ${editingId ? "update" : "create"} product.`
        );
      }
    } catch (err) {
      setError("Operation failed due to network error.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------
  // Edit Handler
  // ---------------------------------------------------
  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      discount: p.discount != null ? String(p.discount) : "",
    });
    setError(null);
  }

  // ---------------------------------------------------
  // Delete Product
  // ---------------------------------------------------
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to permanently delete this product?"))
      return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required.");
      return;
    }

    try {
      const res = await fetch(`/api/seller/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        fetchProducts();
      } else {
        setError(data.message || "Failed to delete product.");
      }
    } catch (err) {
      setError("Delete operation failed.");
    }
  }

  // ---------------------------------------------------
  // Loading Screen
  // ---------------------------------------------------
  if (loading) {
    return (
      <div className="page-shell seller-dashboard-grid">
        <p className="text-main p-8 text-center">Loading products...</p>
      </div>
    );
  }

  // ---------------------------------------------------
  // Render UI
  // ---------------------------------------------------
  return (
    <div className="page-shell seller-dashboard-grid">
      <div>
        <h2 className="section-title">
          Your Products ({products.length})
        </h2>

        {error && <p className="profile-message error mb-4">{error}</p>}

        <ul className="product-list-container">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p) => (
              <li
                key={p.id}
                className={`product-list-item card-soft ${
                  editingId === p.id ? "editing-item" : ""
                }`}
              >
                <div>
                  <p className="product-item-title">{p.title}</p>

                  <p className="product-item-price-info">
                    Base Price:
                    <span className="text-primary-dark">
                      ₹{p.price.toFixed(2)}
                    </span>{" "}
                    {p.discount && p.discount > 0
                      ? `(Discount: ${p.discount}% → Final: ₹${(
                          p.price *
                          (1 - p.discount / 100)
                        ).toFixed(2)})`
                      : null}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn-link"
                    onClick={() => handleEdit(p)}
                    disabled={editingId === p.id}
                  >
                    {editingId === p.id ? "Editing..." : "Edit"}
                  </button>

                  <button
                    className="btn-link-delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-muted p-4 text-center">
              No products found. Use the form to add your first product.
            </p>
          )}
        </ul>
      </div>

      {/* FORM SIDE */}
      <div>
        <h2 className="section-title">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="card product-form">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
            disabled={saving}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: e.target.value }))
            }
            disabled={saving}
            required
          />

          <input
            type="number"
            placeholder="Discount (%) - optional"
            value={form.discount}
            onChange={(e) =>
              setForm((f) => ({ ...f, discount: e.target.value }))
            }
            disabled={saving}
          />

          <button type="submit" className="btn-primary mt-2" disabled={saving}>
            {saving
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Update Product"
              : "Create Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-ghost-cancel"
              onClick={() => setEditingId(null)}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
