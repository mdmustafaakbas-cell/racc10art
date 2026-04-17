"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/store";
import { saveCheckout, generateOrderNumber } from "@/lib/checkout";
import type { Product } from "@/lib/products";
import type { CheckoutForm } from "@/lib/checkout";

export default function UrunDetayPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);
  
  // Özelleştirme state'leri
  const [showCustomize, setShowCustomize] = useState(false);
  const [customNote, setCustomNote] = useState("");
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Checkout state'leri
  const [showCheckout, setShowCheckout] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    paymentMethod: "havale" as "havale" | "kapida",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const all = getProducts();
    const found = all.find((p) => p.slug === params.slug);
    setProduct(found || null);
    if (found) setRelated(all.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 3));
    setLoading(false);
  }, [params.slug]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const readers: Promise<string>[] = [];
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
      );
    }
    
    Promise.all(readers).then((results) => {
      setCustomImages((prev) => [...prev, ...results].slice(0, 5));
      setUploading(false);
    });
  };

  const removeImage = (index: number) => {
    setCustomImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (!product) return;
    setShowCheckout(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setSubmitting(true);
    
    const checkout: CheckoutForm = {
      ...formData,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity,
      customNote: showCustomize ? customNote : undefined,
      customImages: showCustomize ? customImages : undefined,
      orderDate: Date.now(),
      orderNumber: generateOrderNumber(),
      status: "pending",
    };
    
    saveCheckout(checkout);
    
    // Başarı sayfasına yönlendir
    setTimeout(() => {
      router.push(`/siparis-basarili?orderNumber=${checkout.orderNumber}`);
    }, 500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-black text-brand-accent/10 mb-4">404</p>
      <h1 className="text-2xl font-bold text-brand-text mb-2">Ürün bulunamadı</h1>
      <Link href="/urunler" className="text-brand-accent hover:underline text-sm mt-2">← Koleksiyona Dön</Link>
    </div>
  );

  // Checkout formu gösteriliyorsa
  if (showCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => setShowCheckout(false)}
          className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Ürüne Geri Dön
        </button>

        <div className="bg-brand-card border border-brand-border rounded-3xl p-8">
          <h1 className="text-3xl font-black text-brand-text mb-2">Sipariş Bilgileri</h1>
          <p className="text-brand-muted mb-8">Lütfen bilgilerinizi eksiksiz doldurun</p>

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Ürün Özeti */}
            <div className="bg-brand-deeper border border-brand-border rounded-2xl p-5">
              <div className="flex gap-4">
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-brand-text">{product.name}</h3>
                  <p className="text-brand-muted text-sm mt-1">{product.price.toLocaleString("tr-TR")} ₺</p>
                  {showCustomize && customNote && (
                    <p className="text-brand-accent text-xs mt-2">✨ Özel tasarım talebi var</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-brand-border hover:bg-brand-border2 rounded-lg text-brand-text transition-colors">
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-brand-text">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-brand-border hover:bg-brand-border2 rounded-lg text-brand-text transition-colors">
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border flex justify-between items-center">
                <span className="text-brand-muted text-sm">Toplam</span>
                <span className="text-2xl font-black text-brand-accent">
                  {(product.price * quantity).toLocaleString("tr-TR")} ₺
                </span>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h3 className="font-bold text-brand-text mb-4">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ad Soyad *"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                />
                <input
                  type="email"
                  placeholder="E-posta *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Telefon (5XX XXX XX XX) *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors md:col-span-2"
                />
              </div>
            </div>

            {/* Teslimat Adresi */}
            <div>
              <h3 className="font-bold text-brand-text mb-4">Teslimat Adresi</h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Adres (Mahalle, Sokak, Bina No, Daire No) *"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors resize-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="İl *"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="İlçe *"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Posta Kodu"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Ödeme Yöntemi */}
            <div>
              <h3 className="font-bold text-brand-text mb-4">Ödeme Yöntemi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center gap-4 bg-brand-deeper border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                  formData.paymentMethod === "havale" ? "border-brand-accent bg-brand-accent/5" : "border-brand-border hover:border-brand-border2"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="havale"
                    checked={formData.paymentMethod === "havale"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "havale" })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === "havale" ? "border-brand-accent" : "border-brand-border"
                  }`}>
                    {formData.paymentMethod === "havale" && <div className="w-3 h-3 rounded-full bg-brand-accent" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-text text-sm">Havale / EFT</p>
                    <p className="text-brand-muted text-xs mt-0.5">Banka hesabına havale</p>
                  </div>
                </label>

                <label className={`relative flex items-center gap-4 bg-brand-deeper border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                  formData.paymentMethod === "kapida" ? "border-brand-accent bg-brand-accent/5" : "border-brand-border hover:border-brand-border2"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="kapida"
                    checked={formData.paymentMethod === "kapida"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "kapida" })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === "kapida" ? "border-brand-accent" : "border-brand-border"
                  }`}>
                    {formData.paymentMethod === "kapida" && <div className="w-3 h-3 rounded-full bg-brand-accent" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-text text-sm">Kapıda Ödeme</p>
                    <p className="text-brand-muted text-xs mt-0.5">Teslimat sırasında nakit</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-accent text-brand-dark font-black py-5 rounded-2xl text-lg hover:bg-brand-accent/90 transition-all hover:shadow-2xl hover:shadow-brand-accent/30 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Sipariş Oluşturuluyor..." : "Siparişi Tamamla"}
            </button>

            <p className="text-brand-muted text-xs text-center">
              Siparişiniz onaylandıktan sonra size e-posta ile bilgilendirme yapılacaktır.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-brand-muted mb-10">
        <Link href="/" className="hover:text-brand-accent transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-brand-accent transition-colors">Koleksiyon</Link>
        <span>/</span>
        <span className="text-brand-sub">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Sol — Görseller */}
        <div className="space-y-4">
          {/* Ana görsel */}
          <div className="relative rounded-3xl overflow-hidden bg-brand-card border border-brand-border" style={{ aspectRatio: "1" }}>
            {product.images[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-muted text-6xl">🖼️</div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold px-6 py-3 rounded-2xl text-lg">Tükendi</span>
              </div>
            )}
          </div>
          {/* Thumbnail'lar */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-brand-accent" : "border-brand-border hover:border-brand-border2"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ — Bilgi */}
        <div className="flex flex-col">
          <div className="mb-3">
            <span className="text-xs font-semibold bg-brand-accent/10 text-brand-accent border border-brand-accent/20 px-3 py-1.5 rounded-full">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-brand-text leading-tight mb-4">
            {product.name}
          </h1>

          <p className="text-brand-sub leading-relaxed mb-8 text-base">{product.description}</p>

          {/* Özellikler */}
          {(product.dimensions || product.material) && (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-8 space-y-3">
              {product.dimensions && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-muted flex items-center gap-2">
                    <span className="text-brand-accent text-xs">✦</span> Boyut
                  </span>
                  <span className="text-brand-text font-semibold">{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-muted flex items-center gap-2">
                    <span className="text-brand-accent text-xs">✦</span> Malzeme
                  </span>
                  <span className="text-brand-text font-semibold">{product.material}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted flex items-center gap-2">
                  <span className="text-brand-accent text-xs">✦</span> Üretim
                </span>
                <span className="text-brand-text font-semibold">El Yapımı</span>
              </div>
            </div>
          )}

          {/* Fiyat */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-brand-muted text-xs mb-1">Fiyat</p>
              <p className="text-4xl font-black text-brand-accent">
                {product.price.toLocaleString("tr-TR")} ₺
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${
              product.inStock
                ? "text-green-400 bg-green-400/10 border-green-400/20"
                : "text-red-400 bg-red-400/10 border-red-400/20"
            }`}>
              <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-400" : "bg-red-400"}`} />
              {product.inStock ? "Stokta Var" : "Tükendi"}
            </div>
          </div>

          {/* Özelleştirme Toggle */}
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="w-full flex items-center justify-between bg-brand-card border border-brand-border hover:border-brand-accent/40 text-brand-text font-semibold py-4 px-5 rounded-2xl text-sm transition-all mb-4">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Özel Tasarım İste
            </span>
            <svg className={`w-5 h-5 text-brand-muted transition-transform ${showCustomize ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Özelleştirme Paneli */}
          {showCustomize && (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-4 space-y-4">
              <div>
                <label className="block text-brand-text text-sm font-semibold mb-2">
                  Tasarım Notlarınız
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Boyut, renk, motif gibi isteklerinizi yazın... (örn: 'Glock 19 silueti, mavi-mor galaksi efekti, 80x60 cm')"
                  className="w-full bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors resize-none"
                  rows={4}
                />
                <p className="text-brand-muted text-xs mt-2">
                  İstediğiniz tüm detayları belirtin. Size özel fiyat teklifi hazırlayacağız.
                </p>
              </div>

              <div>
                <label className="block text-brand-text text-sm font-semibold mb-2">
                  Referans Fotoğraflar (Opsiyonel)
                </label>
                
                {/* Yüklenen görseller */}
                {customImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {customImages.map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-brand-border">
                        <img src={img} alt={`Referans ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload butonu */}
                {customImages.length < 5 && (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-brand-border hover:border-brand-accent/40 rounded-xl py-6 cursor-pointer transition-all group">
                    <svg className="w-8 h-8 text-brand-muted group-hover:text-brand-accent transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-brand-muted text-sm group-hover:text-brand-text transition-colors">
                      {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
                    </span>
                    <span className="text-brand-muted text-xs mt-1">
                      {customImages.length}/5 fotoğraf
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
                
                <p className="text-brand-muted text-xs mt-2">
                  Beğendiğiniz tasarımların fotoğraflarını yükleyin. Maksimum 5 fotoğraf.
                </p>
              </div>

              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3">
                <p className="text-brand-accent text-xs leading-relaxed">
                  💡 <strong>Not:</strong> Özel sipariş taleplerinde önce size fiyat teklifi sunulur. Onayınız sonrası üretim başlar.
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          {product.inStock ? (
            <button
              onClick={handleCheckout}
              className="group relative w-full bg-brand-accent text-brand-dark font-black py-5 rounded-2xl text-center text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-brand-accent/30 hover:scale-[1.02]">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {showCustomize && (customNote || customImages.length > 0) ? "Özel Sipariş Ver" : "Satın Al"}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </button>
          ) : (
            <button disabled className="w-full bg-brand-border text-brand-muted font-bold py-5 rounded-2xl text-lg cursor-not-allowed">
              Stok Yok
            </button>
          )}

          {/* Güvenceler */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "🔒", text: "Güvenli Ödeme" },
              { icon: "🚚", text: "Türkiye Kargo" },
              { icon: "✦", text: "El Yapımı" },
            ].map((g) => (
              <div key={g.text} className="text-center p-3 bg-brand-card border border-brand-border rounded-xl">
                <p className="text-lg mb-1">{g.icon}</p>
                <p className="text-xs text-brand-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İlgili ürünler */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-black text-brand-text mb-8">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link key={p.id} href={`/urunler/${p.slug}`} className="group block card-hover">
                <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
                  <div className="relative overflow-hidden bg-brand-deeper" style={{ aspectRatio: "4/5" }}>
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted text-4xl">🖼️</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-brand-text text-sm line-clamp-1 group-hover:text-brand-accent transition-colors">{p.name}</p>
                    <p className="text-brand-accent font-black mt-1">{p.price.toLocaleString("tr-TR")} ₺</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
