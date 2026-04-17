"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/store";
import { getSettings, defaultSettings } from "@/lib/settings";
import type { Product } from "@/lib/products";

export default function ProductsClient({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [s, setS] = useState(defaultSettings);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const all = getProducts();
    setCategories([...new Set(all.map((p) => p.category))]);
    setProducts(category ? all.filter((p) => p.category === category) : all);
    setS(getSettings());
  }, [category]);

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Başlık */}
      <div className="mb-12">
        {s.productsPageBadge && (
          <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">{s.productsPageBadge}</p>
        )}
        <h1 className="text-5xl font-black text-brand-text">{s.productsPageTitle}</h1>
        <p className="text-brand-sub mt-2">{products.length} ürün</p>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
        {/* Kategori */}
        <div className="flex flex-wrap gap-2">
          <a href="/urunler"
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              !category ? "bg-brand-accent text-brand-dark border-brand-accent" : "border-brand-border text-brand-sub hover:border-brand-border2 hover:text-brand-text"
            }`}>
            Tümü
          </a>
          {categories.map((cat) => (
            <a key={cat} href={`/urunler?kategori=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                category === cat ? "bg-brand-accent text-brand-dark border-brand-accent" : "border-brand-border text-brand-sub hover:border-brand-border2 hover:text-brand-text"
              }`}>
              {cat}
            </a>
          ))}
        </div>

        {/* Sıralama */}
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="bg-brand-card border border-brand-border rounded-xl px-4 py-2 text-sm text-brand-sub focus:outline-none focus:border-brand-accent transition-colors">
          <option value="default">Varsayılan</option>
          <option value="price-asc">Fiyat: Düşük → Yüksek</option>
          <option value="price-desc">Fiyat: Yüksek → Düşük</option>
          <option value="name">İsme Göre</option>
        </select>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-brand-muted text-lg">Bu kategoride ürün bulunamadı.</p>
          <a href="/urunler" className="text-brand-accent text-sm mt-3 inline-block hover:underline">Tüm ürünlere dön</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
