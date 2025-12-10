// File: components/SellerProductForm.tsx
"use client";

import React, { useState, useEffect } from "react";

export type SizeStock = Record<string, number>;

type Props = {
  initial?: any;
  onSubmit: (payload: any) => Promise<void>;
  onCancel?: () => void;
};
type Category = {
  id: number;
  name: string;
  description: string | null;
  subcategories: {
    id: number;
    name: string;
    description: string | null;
  }[];
};


const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function SellerProductForm({ initial = {}, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    price: initial.price ?? "",
    discount: initial.discount ?? "",
    brand: initial.brand || "",
    gender: initial.gender || "UNISEX",
    material: initial.material || "",
    fabricCare: initial.fabricCare || "",
    occasion: initial.occasion || "",
    modelNumber: initial.modelNumber || "",
    sku: initial.sku || "",
    availableSizes: initial.availableSizes || [],
    sizeStock: initial.sizeStock || {},
    colors: initial.colors || [],
    imageUrls: initial.imageUrls || [],
    weight: initial.weight ?? "",
    dimensions: initial.dimensions || "",
    returnPolicy: initial.returnPolicy || "",
    sellerNotes: initial.sellerNotes || "",
    categoryId: initial.categoryId ?? "",
    subcategoryId: initial.subcategoryId ?? "",
  });

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setError(null);
  }, [form]);

  function toggleSize(size: string) {
    setForm((f: any) => {
      const has = (f.availableSizes || []).includes(size);
      const nextSizes = has
        ? f.availableSizes.filter((s: string) => s !== size)
        : [...f.availableSizes, size];
      const nextStock = { ...(f.sizeStock || {}) };
      if (!has && nextStock[size] === undefined) nextStock[size] = 0;
      if (has) delete nextStock[size];
      return { ...f, availableSizes: nextSizes, sizeStock: nextStock };
    });
  }

  function setStock(size: string, qty: number) {
    setForm((f: any) => ({
      ...f,
      sizeStock: { ...(f.sizeStock || {}), [size]: qty },
    }));
  }

  function addColor(color: string) {
    if (!color) return;
    setForm((f: any) => ({
      ...f,
      colors: Array.from(new Set([...(f.colors || []), color])),
    }));
  }

  function removeColor(color: string) {
    setForm((f: any) => ({
      ...f,
      colors: (f.colors || []).filter((c: string) => c !== color),
    }));
  }

  async function handleUploadImages() {
    if (newImageFiles.length === 0) return [];
    setUploading(true);
    try {
      const formData = new FormData();
      newImageFiles.forEach((f) => formData.append("images", f));
      const res = await fetch("/api/product", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((f: any) => ({
        ...f,
        imageUrls: [...(f.imageUrls || []), ...data.urls],
      }));
      setNewImageFiles([]);
      return data.urls;
    } catch (err: any) {
      setError(err.message || "Upload error");
      return [];
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.price) {
      setError("Please provide product title and price.");
      return;
    }

    const payload: any = {
      ...form,
      price: Number(form.price),
      discount:
        form.discount === "" || form.discount == null
          ? 0
          : Number(form.discount),
      weight: form.weight === "" ? null : Number(form.weight),
    };

    if (newImageFiles.length) {
      await handleUploadImages();
    }

    await onSubmit(payload);
  }
   const selectedCategory =
    form.categoryId &&
    categories.find((c) => c.id === Number(form.categoryId));

  const availableSubcategories = selectedCategory?.subcategories ?? [];

  return (
    <form onSubmit={submit} className="card product-form seller-product-form-card">
      <h2 className="section-title">Product Details</h2>

      {error && <p className="form-error">{error}</p>}

      {/* Title */}
      <div className="form-field">
        <label className="form-label">Title</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, title: e.target.value }))
          }
          placeholder="Classic linen shirt"
        />
      </div>

      {/* Description */}
      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, description: e.target.value }))
          }
          placeholder="Describe fabric, fit, and styling notes…"
          rows={3}
        />
      </div>

      {/* Price + Discount */}
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Price (INR)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, price: e.target.value }))
            }
            placeholder="1999"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Discount (%)</label>
          <input
            type="number"
            step="0.01"
            value={form.discount}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, discount: e.target.value }))
            }
            placeholder="10"
          />
        </div>
      </div>

      {/* Brand + Gender */}
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Brand</label>
          <input
            value={form.brand}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, brand: e.target.value }))
            }
            placeholder="Your brand name"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Gender</label>
          <select
            value={form.gender}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, gender: e.target.value }))
            }
          >
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>
      </div>

      {/* Material + Fabric care */}
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Material</label>
          <input
            value={form.material}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, material: e.target.value }))
            }
            placeholder="100% cotton, linen blend..."
          />
        </div>
        <div className="form-field">
          <label className="form-label">Fabric care</label>
          <input
            value={form.fabricCare}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, fabricCare: e.target.value }))
            }
            placeholder="Machine wash cold, dry flat..."
          />
        </div>
      </div>

      {/* Occasion */}
      <div className="form-field">
        <label className="form-label">Occasion</label>
        <input
          value={form.occasion}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, occasion: e.target.value }))
          }
          placeholder="Casual, formal, party wear…"
        />
      </div>

      {/* Model & SKU */}
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Model Number</label>
          <input
            value={form.modelNumber}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, modelNumber: e.target.value }))
            }
            placeholder="Internal model reference"
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="form-field">
        <label className="form-label">Available Sizes</label>
        <div className="size-checkbox-group">
          {defaultSizes.map((s) => (
            <label key={s} className="size-pill">
              <input
                type="checkbox"
                checked={(form.availableSizes || []).includes(s)}
                onChange={() => toggleSize(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock per size */}
      {(form.availableSizes || []).length > 0 && (
        <div className="form-field">
          <label className="form-label">Size-wise stock</label>
          <div className="size-stock-list">
            {(form.availableSizes || []).map((s: string) => (
              <div key={s} className="stock-row">
                <span className="stock-size-label">{s}</span>
                <input
                  type="number"
                  min={0}
                  value={form.sizeStock?.[s] ?? 0}
                  onChange={(e) => setStock(s, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      <div className="form-field">
        <label className="form-label">Colors</label>
        <div className="color-input-row">
          <input
            id="colorInput"
            placeholder="Add color (e.g. Black)"
          />
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("colorInput") as
                | HTMLInputElement
                | null;
              if (!el) return;
              addColor(el.value.trim());
              el.value = "";
            }}
            className="btn-ghost color-add-btn"
          >
            Add
          </button>
        </div>
        <div className="color-pill-row">
          {(form.colors || []).map((c: string) => (
            <span key={c} className="color-pill">
              <span>{c}</span>
              <button
                type="button"
                onClick={() => removeColor(c)}
                className="color-pill-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="form-field">
        <label className="form-label">
          Images {uploading && <span className="form-muted">Uploading…</span>}
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setNewImageFiles(Array.from(e.target.files || []))
          }
        />
        <div className="image-preview-grid">
          {(form.imageUrls || []).map((u: string) => (
            <img key={u} src={u} alt="preview" />
          ))}
        </div>
      </div>

      {/* --- Category + Subcategory --- */}
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((f: any) => ({
                ...f,
                categoryId: e.target.value,
                subcategoryId: "", // reset subcategory when category changes
              }))
            }
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Subcategory</label>
          <select
            value={form.subcategoryId}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, subcategoryId: e.target.value }))
            }
            disabled={!form.categoryId || availableSubcategories.length === 0}
          >
            <option value="">
              {form.categoryId
                ? availableSubcategories.length
                  ? "Select subcategory"
                  : "No subcategories for this category"
                : "Select category first"}
            </option>
            {availableSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Return policy
      <div className="form-field">
        <label className="form-label">Return policy</label>
        <input
          value={form.returnPolicy}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, returnPolicy: e.target.value }))
          }
          placeholder="10-day return, unused with tags…"
        />
      </div> */}

      {/* Seller notes */}
      <div className="form-field">
        <label className="form-label">Seller notes (internal)</label>
        <textarea
          value={form.sellerNotes}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, sellerNotes: e.target.value }))
          }
          placeholder="Notes only visible to you…"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save product
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost-cancel"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
