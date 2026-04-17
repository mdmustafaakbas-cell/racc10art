"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";
import { getSettings, saveSettings, defaultSettings } from "@/lib/settings";
import type { SiteSettings } from "@/lib/settings";
import AdminSidebar from "@/components/AdminSidebar";

type Tab = "icerik" | "shopier" | "site" | "guvenlik";

export default function AyarlarPage() {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("icerik");
  const [showSecret, setShowSecret] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [testMsg, setTestMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) { router.push("/admin"); return; }
    setS(getSettings());
  }, [router]);

  const set = (field: keyof SiteSettings, value: string) => {
    setS((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const testShopierApi = async () => {
    if (!s.shopierApiKey || !s.shopierApiSecret) {
      setTestStatus("error"); setTestMsg("API Key ve Secret girilmeli."); return;
    }
    setTestStatus("loading");
    try {
      const res = await fetch(`/api/shopier-webhook?orderId=test&amount=1&currency=TRY`);
      if (res.ok) { setTestStatus("ok"); setTestMsg("Bağlantı başarılı!"); }
      else { const d = await res.json(); setTestStatus("error"); setTestMsg(d.error || "Hata."); }
    } catch { setTestStatus("error"); setTestMsg("Sunucuya ulaşılamadı."); }
  };

  const inp = "w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2.5 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors";
  const lbl = "block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5";
  const ta = `${inp} resize-none`;

  const tabs: { key: Tab; label: string }[] = [
    { key: "icerik", label: "İçerik" },
    { key: "shopier", label: "Shopier API" },
    { key: "site", label: "Site" },
    { key: "guvenlik", label: "Güvenlik" },
  ];

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <div className="md:ml-56 pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-xl font-black text-brand-text mb-6">Ayarlar</h1>

          {/* Tab bar */}
          <div className="flex gap-1 mb-6 bg-brand-card border border-brand-border rounded-xl p-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === t.key ? "bg-brand-accent text-brand-dark" : "text-brand-muted hover:text-brand-text"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-4">

            {/* ─── İÇERİK ─── */}
            {activeTab === "icerik" && (
              <div className="space-y-4">

                {/* Hero */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">Ana Sayfa — Hero</h2>
                  <div>
                    <label className={lbl}>Üst Rozet Yazısı</label>
                    <input type="text" value={s.heroBadge} onChange={(e) => set("heroBadge", e.target.value)} className={inp} placeholder="Özgün Duvar Sanatı" />
                  </div>
                  <div>
                    <label className={lbl}>Ana Başlık</label>
                    <input type="text" value={s.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} className={inp} placeholder="racc10art" />
                  </div>
                  <div>
                    <label className={lbl}>Alt Başlık</label>
                    <textarea rows={3} value={s.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} className={ta} placeholder="Epoksi reçine..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>1. Buton</label>
                      <input type="text" value={s.heroBtn1Text} onChange={(e) => set("heroBtn1Text", e.target.value)} className={inp} placeholder="Koleksiyonu Keşfet" />
                    </div>
                    <div>
                      <label className={lbl}>2. Buton</label>
                      <input type="text" value={s.heroBtn2Text} onChange={(e) => set("heroBtn2Text", e.target.value)} className={inp} placeholder="Hakkımızda" />
                    </div>
                  </div>
                </div>

                {/* Öne Çıkan */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">Ana Sayfa — Öne Çıkan Ürünler</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Rozet</label>
                      <input type="text" value={s.featuredBadge} onChange={(e) => set("featuredBadge", e.target.value)} className={inp} placeholder="Koleksiyon" />
                    </div>
                    <div>
                      <label className={lbl}>Başlık</label>
                      <input type="text" value={s.featuredTitle} onChange={(e) => set("featuredTitle", e.target.value)} className={inp} placeholder="Öne Çıkan Ürünler" />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Link Metni</label>
                    <input type="text" value={s.featuredLinkText} onChange={(e) => set("featuredLinkText", e.target.value)} className={inp} placeholder="Tümünü Gör" />
                  </div>
                </div>

                {/* Özellikler */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-5">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">Ana Sayfa — Özellikler (3 Kart)</h2>
                  {([1, 2, 3] as const).map((n) => (
                    <div key={n} className="space-y-2">
                      <p className="text-xs text-brand-muted font-semibold">{n}. Kart</p>
                      <div className="grid grid-cols-5 gap-2">
                        <input type="text" value={s[`feature${n}Icon`]} onChange={(e) => set(`feature${n}Icon`, e.target.value)}
                          className={`${inp} col-span-1 text-center`} placeholder="🎨" />
                        <input type="text" value={s[`feature${n}Title`]} onChange={(e) => set(`feature${n}Title`, e.target.value)}
                          className={`${inp} col-span-2`} placeholder="Başlık" />
                        <input type="text" value={s[`feature${n}Desc`]} onChange={(e) => set(`feature${n}Desc`, e.target.value)}
                          className={`${inp} col-span-2`} placeholder="Açıklama" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ürünler sayfası */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">Ürünler Sayfası</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Rozet</label>
                      <input type="text" value={s.productsPageBadge} onChange={(e) => set("productsPageBadge", e.target.value)} className={inp} placeholder="Koleksiyon" />
                    </div>
                    <div>
                      <label className={lbl}>Başlık</label>
                      <input type="text" value={s.productsPageTitle} onChange={(e) => set("productsPageTitle", e.target.value)} className={inp} placeholder="Tüm Ürünler" />
                    </div>
                  </div>
                </div>

                {/* Hakkımızda */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">Hakkımızda Sayfası</h2>
                  <div>
                    <label className={lbl}>Sayfa Başlığı</label>
                    <input type="text" value={s.aboutTitle} onChange={(e) => set("aboutTitle", e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>1. Paragraf</label>
                    <textarea rows={2} value={s.aboutText1} onChange={(e) => set("aboutText1", e.target.value)} className={ta} />
                  </div>
                  <div>
                    <label className={lbl}>2. Paragraf</label>
                    <textarea rows={2} value={s.aboutText2} onChange={(e) => set("aboutText2", e.target.value)} className={ta} />
                  </div>
                  <div>
                    <label className={lbl}>3. Paragraf</label>
                    <textarea rows={2} value={s.aboutText3} onChange={(e) => set("aboutText3", e.target.value)} className={ta} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>CTA Başlık</label>
                      <input type="text" value={s.aboutCtaTitle} onChange={(e) => set("aboutCtaTitle", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>CTA Buton</label>
                      <input type="text" value={s.aboutCtaBtn} onChange={(e) => set("aboutCtaBtn", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>CTA Açıklama</label>
                    <input type="text" value={s.aboutCtaDesc} onChange={(e) => set("aboutCtaDesc", e.target.value)} className={inp} />
                  </div>
                </div>

                {/* İletişim */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">İletişim Sayfası</h2>
                  <div>
                    <label className={lbl}>Başlık</label>
                    <input type="text" value={s.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Alt Başlık</label>
                    <textarea rows={2} value={s.contactSubtitle} onChange={(e) => set("contactSubtitle", e.target.value)} className={ta} />
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-brand-text border-b border-brand-border pb-2">Footer</h2>
                  <div>
                    <label className={lbl}>Açıklama Metni</label>
                    <textarea rows={2} value={s.footerDesc} onChange={(e) => set("footerDesc", e.target.value)} className={ta} />
                  </div>
                  <div>
                    <label className={lbl}>Telif Hakkı Metni</label>
                    <input type="text" value={s.footerCopyright} onChange={(e) => set("footerCopyright", e.target.value)} className={inp} placeholder="racc10art. Tüm hakları saklıdır." />
                    <p className="text-xs text-brand-muted mt-1">Başına otomatik © {new Date().getFullYear()} eklenir.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SHOPİER ─── */}
            {activeTab === "shopier" && (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-brand-text">Shopier API</h2>
                  <a href="https://www.shopier.com" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline">Shopier Paneli ↗</a>
                </div>
                <div className="bg-brand-dark border border-brand-border rounded-xl p-4 text-xs text-brand-muted space-y-1">
                  <p className="text-brand-text font-semibold mb-1">Nasıl Alınır?</p>
                  <p>1. Shopier → Hesabım → API Entegrasyonu</p>
                  <p>2. API Key ve Secret'ı kopyala</p>
                  <p>3. Website Index genellikle 1</p>
                </div>
                <div>
                  <label className={lbl}>API Key</label>
                  <input type="text" value={s.shopierApiKey} onChange={(e) => set("shopierApiKey", e.target.value)} className={inp} placeholder="Shopier API Key" />
                </div>
                <div>
                  <label className={lbl}>API Secret</label>
                  <div className="relative">
                    <input type={showSecret ? "text" : "password"} value={s.shopierApiSecret}
                      onChange={(e) => set("shopierApiSecret", e.target.value)} className={`${inp} pr-16`} placeholder="Shopier API Secret" />
                    <button type="button" onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-muted hover:text-brand-accent">
                      {showSecret ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Website Index</label>
                  <input type="text" value={s.shopierWebsiteIndex} onChange={(e) => set("shopierWebsiteIndex", e.target.value)} className={inp} placeholder="1" />
                </div>
                <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-brand-accent mb-2">Webhook URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-brand-dark px-3 py-2 rounded text-xs text-brand-text font-mono overflow-x-auto">
                      https://siteadresi.com/api/shopier-webhook
                    </code>
                    <button type="button" onClick={() => navigator.clipboard.writeText("https://siteadresi.com/api/shopier-webhook")}
                      className="text-xs text-brand-muted hover:text-brand-accent px-2 py-2 border border-brand-border rounded-lg whitespace-nowrap">
                      Kopyala
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={testShopierApi} disabled={testStatus === "loading"}
                    className="px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-brand-muted hover:text-brand-accent hover:border-brand-accent/50 transition-all">
                    {testStatus === "loading" ? "Test ediliyor..." : "Bağlantıyı Test Et"}
                  </button>
                  {testStatus !== "idle" && testStatus !== "loading" && (
                    <p className={`text-xs ${testStatus === "ok" ? "text-green-400" : "text-red-400"}`}>{testMsg}</p>
                  )}
                </div>
              </div>
            )}

            {/* ─── SİTE ─── */}
            {activeTab === "site" && (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-brand-text mb-2">Genel Site Bilgileri</h2>
                <div>
                  <label className={lbl}>Site Adı</label>
                  <input type="text" value={s.siteName} onChange={(e) => set("siteName", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>SEO Açıklaması</label>
                  <textarea rows={2} value={s.siteDescription} onChange={(e) => set("siteDescription", e.target.value)} className={ta} />
                </div>
                <div>
                  <label className={lbl}>Instagram URL</label>
                  <input type="url" value={s.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>WhatsApp (905xxxxxxxxx)</label>
                  <input type="tel" value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} className={inp} placeholder="905xxxxxxxxx" />
                </div>
                <div>
                  <label className={lbl}>Kargo Bilgisi</label>
                  <textarea rows={2} value={s.cargoInfo} onChange={(e) => set("cargoInfo", e.target.value)} className={ta} />
                </div>
              </div>
            )}

            {/* ─── GÜVENLİK ─── */}
            {activeTab === "guvenlik" && (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-brand-text mb-2">Admin Şifresi</h2>
                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 text-xs text-yellow-400">
                  ⚠️ Şifreyi değiştirdikten sonra not al.
                </div>
                <div>
                  <label className={lbl}>Yeni Şifre</label>
                  <input type="password" value={s.adminPassword} onChange={(e) => set("adminPassword", e.target.value)} className={inp} />
                </div>
                <div className="bg-brand-dark border border-brand-border rounded-xl p-4 text-xs text-brand-muted">
                  Mevcut şifre: <code className="text-brand-accent">{s.adminPassword}</code>
                </div>
              </div>
            )}

            <button type="submit"
              className={`w-full font-bold py-4 rounded-xl transition-all text-sm ${
                saved ? "bg-green-500 text-white" : "bg-brand-accent text-brand-dark hover:bg-brand-accent/90 hover:shadow-lg hover:shadow-brand-accent/20"
              }`}>
              {saved ? "✓ Kaydedildi! Siteye yansıdı." : "Kaydet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
