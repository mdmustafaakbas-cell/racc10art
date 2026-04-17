"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SESSION_KEY } from "@/lib/auth";
import { getProducts, addProduct, updateProduct, generateId, generateSlug } from "@/lib/store";
import type { Product } from "@/lib/products";
import AdminSidebar from "@/components/AdminSidebar";

const empty: Omit<Product, "id"> = {
  slug: "", name: "", description: "", price: 0,
  category: "", images: [], shopierUrl: "",
  inStock: true, featured: false, dimensions: "", material: "",
};

export default function UrunFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "yeni";
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [productId, setProductId] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shopierStatus, setShopierStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [shopierMsg, setShopierMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) { router.push("/admin"); return; }
    if (!isNew) {
      const found = getProducts().find((p) => p.id === params.id);
      if (found) { const { id, ...rest } = found; setForm(rest); setProductId(id); }
    }
  }, [isNew, params.id, router]);

  const set = (field: keyof Omit<Product, "id">, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && isNew) next.slug = generateSlug(value as string);
      return next;
    });
  };

  // Görsel yükleme — base64 olarak images dizisine ekle
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    let loaded = 0;
    const newImages: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push(ev.target?.result as string);
        loaded++;
        if (loaded === files.length) {
          setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (from: number, to: number) => {
    const imgs = [...form.images];
    const [item] = imgs.splice(from, 1);
    imgs.splice(to, 0, item);
    setForm((prev) => ({ ...prev, images: imgs }));
  };

  // Shopier link doğrulama
  const checkShopierUrl = async () => {
    if (!form.shopierUrl) return;
    setShopierStatus("checking");
    try {
      // Basit URL format kontrolü
      const url = new URL(form.shopierUrl);
      if (url.hostname.includes("shopier.com")) {
        setShopierStatus("ok");
        setShopierMsg("Shopier linki geçerli görünüyor.");
      } else {
        setShopierStatus("error");
        setShopierMsg("Bu bir Shopier linki değil.");
      }
    } catch {
      setShopierStatus("error");
      setShopierMsg("Geçersiz URL formatı.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew) {
      addProduct({ id: generateId(), ...form });
    } else {
      updateProduct({ id: productId, ...form });
    }
    setSaved(true);
    setTimeout(() => router.push("/admin/dashboard"), 900);
  };

  const inputCls = "w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2.5 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors";
  const labelCls = "block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <div className="md:ml-56 pt-14">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Başlık */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/admin/dashboard" className="text-brand-muted hover:text-brand-accent text-sm transition-colors">← Geri</Link>
            <h1 className="text-xl font-black text-brand-text">
              {isNew ? "Yeni Ürün Ekle" : "Ürünü Düzenle"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GÖRSEL YÜKLEME */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-brand-text mb-4">Ürün Görselleri</h2>

              {/* Mevcut görseller */}
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-brand-border bg-brand-dark">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 text-xs bg-brand-accent text-brand-dark px-1.5 py-0.5 rounded font-bold">Ana</span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                        {idx > 0 && (
                          <button type="button" onClick={() => moveImage(idx, idx - 1)}
                            className="text-white text-xs bg-brand-accent/80 px-1.5 py-1 rounded hover:bg-brand-accent">←</button>
                        )}
                        <button type="button" onClick={() => removeImage(idx)}
                          className="text-white text-xs bg-red-500/80 px-1.5 py-1 rounded hover:bg-red-500">✕</button>
                        {idx < form.images.length - 1 && (
                          <button type="button" onClick={() => moveImage(idx, idx + 1)}
                            className="text-white text-xs bg-brand-accent/80 px-1.5 py-1 rounded hover:bg-brand-accent">→</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload butonu */}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-brand-border rounded-xl py-8 text-brand-muted hover:border-brand-accent/50 hover:text-brand-accent transition-all text-sm flex flex-col items-center gap-2"
              >
                {uploading ? (
                  <><div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" /><span>Yükleniyor...</span></>
                ) : (
                  <><span className="text-2xl">📁</span><span>Görsel seç veya sürükle</span><span className="text-xs">PNG, JPG, WEBP — Birden fazla seçebilirsin</span></>
                )}
              </button>
            </div>

            {/* TEMEL BİLGİLER */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-brand-text mb-2">Temel Bilgiler</h2>

              <div>
                <label className={labelCls}>Ürün Adı *</label>
                <input required type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                  className={inputCls} placeholder="Glock 17 Galaxy Tablo" />
              </div>

              <div>
                <label className={labelCls}>URL Slug</label>
                <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)}
                  className={`${inputCls} text-brand-muted`} placeholder="glock-17-galaxy-tablo" />
                <p className="text-xs text-brand-muted mt-1">Otomatik oluşturulur, değiştirebilirsin.</p>
              </div>

              <div>
                <label className={labelCls}>Açıklama *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
                  className={`${inputCls} resize-none`} placeholder="Ürün açıklaması..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Fiyat (₺) *</label>
                  <input required type="number" min={0} value={form.price || ""}
                    onChange={(e) => set("price", Number(e.target.value))}
                    className={inputCls} placeholder="850" />
                </div>
                <div>
                  <label className={labelCls}>Kategori *</label>
                  <input required type="text" value={form.category} onChange={(e) => set("category", e.target.value)}
                    className={inputCls} placeholder="Silah Serisi" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Boyut</label>
                  <input type="text" value={form.dimensions || ""} onChange={(e) => set("dimensions", e.target.value)}
                    className={inputCls} placeholder="30x40 cm" />
                </div>
                <div>
                  <label className={labelCls}>Malzeme</label>
                  <input type="text" value={form.material || ""} onChange={(e) => set("material", e.target.value)}
                    className={inputCls} placeholder="Epoksi Reçine, MDF" />
                </div>
              </div>

              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)}
                    className="w-4 h-4 accent-brand-accent" />
                  <span className="text-sm text-brand-text">Stokta Var</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
                    className="w-4 h-4 accent-brand-accent" />
                  <span className="text-sm text-brand-text">Öne Çıkan</span>
                </label>
              </div>
            </div>

            {/* SHOPİER ENTEGRASYONU */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-brand-text">Shopier Entegrasyonu</h2>
                <span className="text-xs text-brand-muted bg-brand-dark px-2 py-1 rounded-full border border-brand-border">
                  Ödeme Sistemi
                </span>
              </div>

              <div className="bg-brand-dark border border-brand-border rounded-xl p-4 text-xs text-brand-muted space-y-1">
                <p className="text-brand-text font-semibold text-sm mb-2">Shopier Ödeme Linki Nasıl Alınır?</p>
                <p>1. <a href="https://www.shopier.com" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">shopier.com</a>'a giriş yap</p>
                <p>2. Ürünler &gt; Yeni Ürün Ekle &gt; Ürünü oluştur</p>
                <p>3. Ürün sayfasındaki "Satın Al" butonunun linkini kopyala</p>
                <p>4. Aşağıya yapıştır</p>
              </div>

              <div>
                <label className={labelCls}>Shopier Ödeme Linki *</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="url"
                    value={form.shopierUrl}
                    onChange={(e) => { set("shopierUrl", e.target.value); setShopierStatus("idle"); }}
                    className={inputCls}
                    placeholder="https://www.shopier.com/ShowProduct/..."
                  />
                  <button
                    type="button"
                    onClick={checkShopierUrl}
                    className="px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs text-brand-muted hover:text-brand-accent hover:border-brand-accent/50 transition-all whitespace-nowrap"
                  >
                    Doğrula
                  </button>
                </div>
                {shopierStatus !== "idle" && (
                  <p className={`text-xs mt-1.5 ${shopierStatus === "ok" ? "text-green-400" : shopierStatus === "error" ? "text-red-400" : "text-brand-muted"}`}>
                    {shopierStatus === "checking" ? "Kontrol ediliyor..." : shopierMsg}
                  </p>
                )}
              </div>

              {/* Shopier API bilgisi */}
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4 text-xs text-brand-muted">
                <p className="text-brand-accent font-semibold mb-1">💡 Shopier API Entegrasyonu</p>
                <p>Sipariş bildirimlerini otomatik almak için Shopier panelinde webhook URL'ini ayarla:</p>
                <code className="block mt-2 bg-brand-dark px-3 py-2 rounded text-brand-text font-mono">
                  https://siteadresi.com/api/shopier-webhook
                </code>
                <p className="mt-2">API Key ve Secret için: <span className="text-brand-text">Ayarlar &gt; Shopier Ayarları</span></p>
              </div>
            </div>

            {/* KAYDET */}
            <button
              type="submit"
              className={`w-full font-bold py-4 rounded-xl transition-all text-sm ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-brand-accent text-brand-dark hover:bg-brand-accent/90 hover:shadow-lg hover:shadow-brand-accent/20"
              }`}
            >
              {saved ? "✓ Kaydedildi! Yönlendiriliyor..." : isNew ? "Ürünü Ekle" : "Değişiklikleri Kaydet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
