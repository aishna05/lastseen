"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Category = { id: number; name: string; };
type Product = {
  id: number;
  title: string;
  price: number;
  imageUrls: string[];
  category: { id: number; name: string } | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data.map((c: any) => ({ id: c.id, name: c.name })) : []))
      .catch(() => {});

    fetch('/api/product')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = selected ? products.filter(p => p.category?.id === selected) : products;

  return (
    <main className="page-shell" style={{ paddingBlock: '2.5rem' }}>
      <h1 className="heading-main">Browse By Category</h1>

      <div className="category-filter">
        <label>Category</label>
        <select className="category-select" value={selected ?? ''} onChange={(e) => setSelected(e.target.value ? Number(e.target.value) : null)}>
          <option value="">All</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading products…</p>
      ) : (
        <section className="product-grid">
          {filtered.map(p => (
            <ProductCard key={p.id} product={{ id: p.id, title: p.title, price: p.price, imageUrls: btoa(JSON.stringify(p.imageUrls)) }} onAddToCart={async () => { alert('Add to cart from categories page'); }} />
          ))}
        </section>
      )}
    </main>
  );
}
