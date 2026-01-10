  "use client";

  import React, { useEffect, useState } from "react";
  import ProductCard from "@/components/ProductCard";

  type Category = { id: number; name: string };
  type RawProduct = {
    id: number;
    title: string;
    price: number;
    imageUrls?: string[];
    category?: { id: number; name: string } | null;
  };

  export default function FilterPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selected, setSelected] = useState<number | string>("");
    const [products, setProducts] = useState<RawProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let mounted = true;
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => {
          if (!mounted) return;
          if (Array.isArray(data)) {
            const cats = data.map((c: any) => ({ id: c.id, name: c.name }));
            setCategories(cats);
            const pant = cats.find((c) => String(c.name).toLowerCase() === "pant");
            if (pant) setSelected(pant.id);
            else if (cats.length > 0) setSelected(cats[0].id);
          }
        })
        .catch(() => {});

      fetch('/api/product')
        .then(r => r.json())
        .then(data => {
          if (!mounted) return;
          if (Array.isArray(data)) setProducts(data as RawProduct[]);
        })
        .catch(() => {})
        .finally(() => { if (mounted) setLoading(false) });

      return () => { mounted = false };
    }, []);

    const filtered = selected ? products.filter((p: RawProduct) => p.category?.id === Number(selected)) : products;

    return (
      <main className="filter-page-shell">
        <div className="filter-inner">
          <div className="filter-row">
            <label className="filter-label">Category:</label>
            <select
              className="category-select large"
              value={selected}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}
              aria-label="Select category"
            >
              {categories.length === 0 && <option value="">Loading…</option>}
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', marginTop: 28 }}>Loading products…</p>
          ) : (
            <section className="product-grid" aria-live="polite">
              {filtered.length === 0 ? (
                <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No products found for this category.</p>
              ) : (
                filtered.map((p: RawProduct) => (
                  <ProductCard key={p.id} product={{ id: p.id, title: p.title, price: p.price, imageUrls: btoa(JSON.stringify(p.imageUrls || [])) }} />
                ))
              )}
            </section>
          )}
        </div>
      </main>
    );
  }


