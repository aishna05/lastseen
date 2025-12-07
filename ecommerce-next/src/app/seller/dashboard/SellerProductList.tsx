"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

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
      // update
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
      // create
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
    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Products</h2>
        <ul className="space-y-2">
          {Array.isArray(products) && products.map((p) => (
            <li
              key={p.id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm">
                  Price: ₹{p.price}{" "}
                  {p.discount
                    ? `(Discount: ${p.discount}% → Final: ₹${
                        p.price * (1 - p.discount / 100)
                      })`
                    : null}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm underline"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600 underline"
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
        <h2 className="text-xl font-semibold mb-2">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded space-y-3"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
            value={form.price}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Discount (%) - optional"
            className="w-full border px-3 py-2 rounded"
            value={form.discount}
            onChange={(e) =>
              setForm((f) => ({ ...f, discount: e.target.value }))
            }
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-black text-white font-medium"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
