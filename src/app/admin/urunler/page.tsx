"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SESSION_KEY } from "@/lib/auth";
import { getProducts, deleteProduct, updateProduct } from "@/lib/store";
import type { Product } from "@/lib/products";
import AdminSidebar from "@/components/AdminSidebar";
import ToastContainer, { showToast } from "@/components/Toast";

type ViewMode = "table" | "grid";
type SortKey = "name" | "price" | "category";

export default function UrunlerPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [view, setView] = useState<ViewMode>("table");
  const [sort, setSort] = useState<SortKey>("name");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) { router.push("/admin"); return; }
    setProducts(getProducts());
  }, [router]);

  const refresh = () => { setProducts(getProducts()); setSelected(new Set()); };

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchStock = stockFilter === "all" || (stockFilter === "in" ? p.inStock : !p.inStock);
      return matchSearch && matchCat && matchStock;
    })
    .sort((a, b) => {
      if (sort === "price") return b.price - a.price;
      if (sort === "category") return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const selectAll = () => setSelected(filtered.length === selected.size ? new Set() : new Set(filtered.map((p) => p.id)));

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" silinsin mi?`)) return;
    deleteProduct(id);
    showToast(`"${name}" silindi.`, "success");
    refresh();
  };

  const bulkDelete = () => {
    if (!confirm(`${selected.size} ürün silinsin mi?`)) return;
    selected.forEach((id) => deleteProduct(id));
    showToast(`${selected.size} ürün silindi.`, "success");
    refresh();
  };

  const bulkToggleStock = (inStock: boolean) => {
    selected.forEach((id) => {
      const p = products.find((x) => x.id === id);
      if (p) updateProduct({ ...p, inStock });
    });
    showToast(`${selected.size} ürün güncellendi.`, "success");
    refresh();
  };

  const toggleStock = (p: Product) => {
    updateProduct({ ...p, inStock: !p.inStock });
    showToast(p.inStock ? "Stok yok olarak işaretlendi." : "Stokta var olarak işaretlendi.", "info");
    refresh();
  };

  const toggleFeatured = (p: Product) => {
    updateProduct({ ...p, featured: !p.featured });
    showToast(p.featured ? "Öne çıkandan kaldırıldı." : "Öne çıkarıldı.", "info");
    refresh();
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <ToastContainer />
      <div className="md:ml-56 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-brand-text">Ürünler</h1>
              <p className="text-brand-muted text-sm mt-0.5">{products.length} ürün</p>
            </div>
            <Link href="/admin/urun/yeni"
              className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-4 py-2.5 rounded-xl hover:bg-brand-accent/90 transition-all text-sm shadow-lg shadow-brand-accent/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün
            </Link>
          </div>

          {/* Filtreler */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-center">
            {/* Arama */}
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-xl pl-9 pr-4 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-accent transition-colors" />
            </div>

            {/* Kategori */}
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-accent transition-colors">
              {categories.map((c) => <option key={c} value={c}>{c === "all" ? "Tüm Kategoriler" : c}</option>)}
            </select>

            {/* Stok */}
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
              className="bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-accent transition-colors">
              <option value="all">Tüm Stok</option>
              <option value="in">Stokta</option>
              <option value="out">Stok Yok</option>
            </select>

            {/* Sıralama */}
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-accent transition-colors">
              <option value="name">Ada Göre</option>
              <option value="price">Fiyata Göre</option>
              <option value="category">Kategoriye Göre</option>
            </select>

            {/* View toggle */}
            <div className="flex gap-1 bg-brand-dark border border-brand-border rounded-xl p-1 ml-auto">
              <button onClick={() => setView("table")}
                className={`p-1.5 rounded-lg transition-all ${view === "table" ? "bg-brand-accent/20 text-brand-accent" : "text-brand-muted hover:text-brand-text"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-brand-accent/20 text-brand-accent" : "text-brand-muted hover:text-brand-text"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Toplu işlem bar */}
          {selected.size > 0 && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
              <span className="text-brand-accent text-sm font-semibold">{selected.size} ürün seçildi</span>
              <div className="flex gap-2 ml-auto flex-wrap">
                <button onClick={() => bulkToggleStock(true)}
                  className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all">
                  Stokta İşaretle
                </button>
                <button onClick={() => bulkToggleStock(false)}
                  className="text-xs px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all">
                  Stok Yok İşaretle
                </button>
                <button onClick={bulkDelete}
                  className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all">
                  Seçilenleri Sil
                </button>
                <button onClick={() => setSelected(new Set())}
                  className="text-xs px-3 py-1.5 bg-brand-dark text-brand-muted border border-brand-border rounded-lg hover:text-brand-text transition-all">
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* TABLE VIEW */}
          {view === "table" && (
            <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-dark/50">
                      <th className="px-4 py-3 text-left">
                        <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                          onChange={selectAll} className="w-4 h-4 accent-brand-accent rounded" />
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">Ürün</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider hidden md:table-cell">Kategori</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">Fiyat</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">Stok</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider hidden sm:table-cell">Öne Çıkan</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="text-center text-brand-muted py-16 text-sm">
                        {search ? "Arama sonucu bulunamadı." : "Henüz ürün yok."}
                      </td></tr>
                    )}
                    {filtered.map((p) => (
                      <tr key={p.id} className={`border-b border-brand-border/40 hover:bg-brand-dark/30 transition-colors ${selected.has(p.id) ? "bg-brand-accent/5" : ""}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                            className="w-4 h-4 accent-brand-accent rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.images[0] && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-dark border border-brand-border flex-shrink-0">
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-brand-text">{p.name}</p>
                              <p className="text-brand-muted text-xs truncate max-w-[140px]">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-brand-accent whitespace-nowrap">{p.price.toLocaleString("tr-TR")} ₺</td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleStock(p)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
                              p.inStock ? "text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20" : "text-red-400 bg-red-400/10 border-red-400/20 hover:bg-red-400/20"
                            }`}>
                            {p.inStock ? "Stokta" : "Yok"}
                          </button>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <button onClick={() => toggleFeatured(p)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
                              p.featured ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" : "text-brand-muted border-brand-border hover:border-yellow-400/30"
                            }`}>
                            {p.featured ? "★ Öne Çıkan" : "☆ Normal"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/urunler/${p.slug}`} target="_blank"
                              className="p-1.5 text-brand-muted hover:text-brand-text border border-brand-border hover:border-brand-accent/40 rounded-lg transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                            <Link href={`/admin/urun/${p.id}`}
                              className="p-1.5 text-brand-accent border border-brand-accent/20 hover:border-brand-accent/50 rounded-lg transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-red-400 border border-red-400/20 hover:border-red-400/50 rounded-lg transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRID VIEW */}
          {view === "grid" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-brand-muted py-16 text-sm">Ürün bulunamadı.</div>
              )}
              {filtered.map((p) => (
                <div key={p.id} className={`bg-brand-card border rounded-2xl overflow-hidden group transition-all ${selected.has(p.id) ? "border-brand-accent/50" : "border-brand-border hover:border-brand-accent/30"}`}>
                  <div className="relative aspect-square bg-brand-dark cursor-pointer" onClick={() => toggleSelect(p.id)}>
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted text-3xl">🖼️</div>
                    )}
                    <div className={`absolute inset-0 transition-all ${selected.has(p.id) ? "bg-brand-accent/20" : "bg-transparent group-hover:bg-black/20"}`} />
                    {selected.has(p.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {!p.inStock && (
                      <div className="absolute bottom-2 left-2 text-xs bg-red-500/80 text-white px-2 py-0.5 rounded-full">Stok Yok</div>
                    )}
                    {p.featured && (
                      <div className="absolute top-2 left-2 text-xs bg-yellow-400/80 text-black px-2 py-0.5 rounded-full font-bold">★</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-brand-text text-sm truncate">{p.name}</p>
                    <p className="text-brand-accent font-bold text-sm mt-0.5">{p.price.toLocaleString("tr-TR")} ₺</p>
                    <div className="flex gap-1.5 mt-2">
                      <Link href={`/admin/urun/${p.id}`}
                        className="flex-1 text-center text-xs py-1.5 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 rounded-lg hover:bg-brand-accent/20 transition-all">
                        Düzenle
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="px-2 py-1.5 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/10 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
