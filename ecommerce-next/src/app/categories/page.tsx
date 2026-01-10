"use client";

import React, { useEffect, useState } from "react";

type Category = { id: number; name: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number | string>("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => ({ id: c.id, name: c.name })));
          if (data.length > 0) setSelected(data[0].id);
        }
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  return (
    <main style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: 1100, width: '100%' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontSize: '1rem', color: 'var(--text-main)', marginRight: 8 }}>Category:</label>
          <select
            className="category-select large"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            aria-label="Select category"
          >
            {categories.length === 0 && <option value="">Loading…</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </main>
  );
}
