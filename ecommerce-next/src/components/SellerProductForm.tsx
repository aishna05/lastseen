// File: components/SellerProductForm.tsx
"use client";

import React, { useState, useEffect } from "react";

export type SizeStock = Record<string, number>;

type Props = {
  initial?: any;
  onSubmit: (payload: any) => Promise<void>;
  onCancel?: () => void;
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
  });

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [form]);

  function toggleSize(size: string) {
    setForm((f: any) => {
      const has = (f.availableSizes || []).includes(size);
      const nextSizes = has ? f.availableSizes.filter((s: string) => s !== size) : [...f.availableSizes, size];
      const nextStock = { ...(f.sizeStock || {}) };
      if (!has && nextStock[size] === undefined) nextStock[size] = 0;
      if (has) delete nextStock[size];
      return { ...f, availableSizes: nextSizes, sizeStock: nextStock };
    });
  }

  function setStock(size: string, qty: number) {
    setForm((f: any) => ({ ...f, sizeStock: { ...(f.sizeStock || {}), [size]: qty } }));
  }

  function addColor(color: string) {
    if (!color) return;
    setForm((f: any) => ({ ...f, colors: Array.from(new Set([...(f.colors || []), color])) }));
  }

  function removeColor(color: string) {
    setForm((f: any) => ({ ...f, colors: (f.colors || []).filter((c: string) => c !== color) }));
  }

  async function handleUploadImages() {
    if (newImageFiles.length === 0) return [];
    setUploading(true);
    try {
      // simple multipart upload to /api/upload (server should return { url })
      const formData = new FormData();
      newImageFiles.forEach((f) => formData.append("images", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      // expect data.urls = ["/uploads/1.jpg", ...]
      setForm((f: any) => ({ ...f, imageUrls: [...(f.imageUrls || []), ...data.urls] }));
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

    // minimal validation
    if (!form.title || !form.price) {
      setError("Please provide product title and price.");
      return;
    }

    // ensure numeric fields
    const payload: any = {
      ...form,
      price: Number(form.price),
      discount: form.discount === "" || form.discount == null ? 0 : Number(form.discount),
      weight: form.weight === "" ? null : Number(form.weight),
    };

    // upload images first if any new files present
    if (newImageFiles.length) {
      await handleUploadImages();
    }

    await onSubmit(payload);
  }

  return (
    <form onSubmit={submit} className="border p-4 rounded space-y-3">
      {error && <p className="text-red-600">{error}</p>}

      <input
        value={form.title}
        onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))}
        placeholder="Title"
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))}
        placeholder="Description"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f: any) => ({ ...f, price: e.target.value }))}
          placeholder="Price (INR)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="0.01"
          value={form.discount}
          onChange={(e) => setForm((f: any) => ({ ...f, discount: e.target.value }))}
          placeholder="Discount (%)"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.brand}
          onChange={(e) => setForm((f: any) => ({ ...f, brand: e.target.value }))}
          placeholder="Brand"
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={form.gender}
          onChange={(e) => setForm((f: any) => ({ ...f, gender: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="MEN">Men</option>
          <option value="WOMEN">Women</option>
          <option value="KIDS">Kids</option>
          <option value="UNISEX">Unisex</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.material}
          onChange={(e) => setForm((f: any) => ({ ...f, material: e.target.value }))}
          placeholder="Material"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          value={form.fabricCare}
          onChange={(e) => setForm((f: any) => ({ ...f, fabricCare: e.target.value }))}
          placeholder="Fabric care"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <input
        value={form.occasion}
        onChange={(e) => setForm((f: any) => ({ ...f, occasion: e.target.value }))}
        placeholder="Occasion (casual, formal...)"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2 flex-wrap">
        {defaultSizes.map((s) => (
          <label key={s} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={(form.availableSizes || []).includes(s)}
              onChange={() => toggleSize(s)}
            />
            <span className="text-sm">{s}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        {(form.availableSizes || []).map((s: string) => (
          <div key={s} className="flex gap-2 items-center">
            <span className="w-16">{s}</span>
            <input
              type="number"
              min={0}
              value={form.sizeStock?.[s] ?? 0}
              onChange={(e) => setStock(s, Number(e.target.value))}
              className="border px-2 py-1 rounded w-24"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block mb-1">Colors</label>
        <div className="flex gap-2 items-center">
          <input id="colorInput" placeholder="Add color (e.g. Black)" className="border px-3 py-2 rounded" />
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("colorInput") as HTMLInputElement | null;
              if (!el) return;
              addColor(el.value.trim());
              el.value = "";
            }}
            className="px-3 py-1 rounded bg-gray-100"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {(form.colors || []).map((c: string) => (
            <span key={c} className="inline-flex items-center gap-2 px-2 py-1 border rounded">
              <span className="text-sm">{c}</span>
              <button type="button" onClick={() => removeColor(c)} className="text-red-500 text-xs">
                x
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setNewImageFiles(Array.from(e.target.files || []))}
          className="w-full"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {(form.imageUrls || []).map((u: string) => (
            <img key={u} src={u} alt="preview" className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={form.weight}
          onChange={(e) => setForm((f: any) => ({ ...f, weight: e.target.value }))}
          placeholder="Weight (grams)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          value={form.dimensions}
          onChange={(e) => setForm((f: any) => ({ ...f, dimensions: e.target.value }))}
          placeholder="Dimensions (LxWxH)"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <input
        value={form.returnPolicy}
        onChange={(e) => setForm((f: any) => ({ ...f, returnPolicy: e.target.value }))}
        placeholder="Return policy"
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        value={form.sellerNotes}
        onChange={(e) => setForm((f: any) => ({ ...f, sellerNotes: e.target.value }))}
        placeholder="Seller notes (internal)"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <button type="submit" className="py-2 px-4 bg-black text-white rounded">
          Save
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="py-2 px-4 border rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


