"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";
import { getOrders, updateOrderStatus, deleteOrder, addOrder, getOrderStats } from "@/lib/orders";
import { getOrderStatusLabel, getOrderStatusColor } from "@/lib/shopier";
import type { Order } from "@/lib/orders";
import AdminSidebar from "@/components/AdminSidebar";
import ToastContainer, { showToast } from "@/components/Toast";
import { generateId } from "@/lib/store";

export default function SiparislerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState<Omit<Order, "id" | "createdAt">>({
    productName: "", buyerName: "", buyerEmail: "", buyerPhone: "",
    buyerCity: "", amount: 0, status: "waiting", note: "",
  });

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) { router.push("/admin"); return; }
    setOrders(getOrders());
  }, [router]);

  const refresh = () => setOrders(getOrders());
  const stats = getOrderStats(orders);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = !search || o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleStatusChange = (id: string, status: Order["status"]) => {
    updateOrderStatus(id, status);
    showToast("Durum güncellendi.", "success");
    refresh();
    if (detailOrder?.id === id) setDetailOrder((prev) => prev ? { ...prev, status } : null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bu sipariş silinsin mi?")) return;
    deleteOrder(id);
    showToast("Sipariş silindi.", "success");
    setDetailOrder(null);
    refresh();
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({ id: generateId(), createdAt: new Date().toISOString(), ...newOrder });
    setShowAddModal(false);
    setNewOrder({ productName: "", buyerName: "", buyerEmail: "", buyerPhone: "", buyerCity: "", amount: 0, status: "waiting", note: "" });
    showToast("Sipariş eklendi.", "success");
    refresh();
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Müşteri", "E-posta", "Telefon", "Şehir", "Ürün", "Tutar", "Durum", "Tarih"],
      ...filtered.map((o) => [o.id, o.buyerName, o.buyerEmail, o.buyerPhone, o.buyerCity, o.productName, o.amount, getOrderStatusLabel(o.status), new Date(o.createdAt).toLocaleDateString("tr-TR")]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "siparisler.csv"; a.click();
    showToast("CSV indirildi.", "success");
  };

  const inp = "w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors";

  const filterTabs = [
    { key: "all", label: "Tümü", count: stats.total },
    { key: "waiting", label: "Bekleyen", count: stats.waiting },
    { key: "approved", label: "Onaylı", count: null },
    { key: "completed", label: "Tamamlandı", count: null },
    { key: "cancelled", label: "İptal", count: stats.cancelled },
  ];

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <ToastContainer />
      <div className="md:ml-56 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-brand-text">Siparişler</h1>
              <p className="text-brand-muted text-sm mt-0.5">{stats.total} sipariş · {stats.revenue.toLocaleString("tr-TR")} ₺ gelir</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV}
                className="flex items-center gap-2 text-sm text-brand-muted border border-brand-border px-3 py-2 rounded-xl hover:text-brand-text hover:border-brand-accent/40 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                CSV
              </button>
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-4 py-2 rounded-xl hover:bg-brand-accent/90 transition-all text-sm">
                + Manuel Sipariş
              </button>
            </div>
          </div>

          {/* Stat kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Toplam", value: stats.total, color: "text-brand-accent" },
              { label: "Bekleyen", value: stats.waiting, color: "text-yellow-400" },
              { label: "Onaylanan", value: stats.approved, color: "text-green-400" },
              { label: "Gelir", value: `${stats.revenue.toLocaleString("tr-TR")} ₺`, color: "text-brand-accent" },
            ].map((s) => (
              <div key={s.label} className="bg-brand-card border border-brand-border rounded-xl p-4">
                <p className="text-brand-muted text-xs mb-1">{s.label}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filtre tabs + arama */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 overflow-x-auto">
              {filterTabs.map((t) => (
                <button key={t.key} onClick={() => setFilter(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === t.key ? "bg-brand-accent text-brand-dark" : "text-brand-muted hover:text-brand-text"
                  }`}>
                  {t.label}
                  {t.count !== null && t.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-black ${filter === t.key ? "bg-brand-dark/30" : "bg-brand-border"}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Müşteri, ürün veya e-posta ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-4 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-accent transition-colors" />
            </div>
          </div>

          {/* Shopier webhook */}
          <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-brand-accent text-xs font-semibold">Shopier Otomatik Bildirim</p>
              <code className="text-brand-muted text-xs font-mono">https://siteadresi.com/api/shopier-webhook</code>
            </div>
            <button onClick={() => { navigator.clipboard.writeText("https://siteadresi.com/api/shopier-webhook"); showToast("Kopyalandı!", "info"); }}
              className="text-xs text-brand-accent border border-brand-accent/30 px-3 py-1.5 rounded-lg hover:bg-brand-accent/10 transition-all whitespace-nowrap">
              Kopyala
            </button>
          </div>

          {/* Tablo */}
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-dark/50">
                    {["Müşteri", "Ürün", "Tutar", "Durum", "Tarih", ""].map((h) => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider ${h === "" ? "text-right" : "text-left"} ${h === "Ürün" ? "hidden md:table-cell" : ""} ${h === "Tarih" ? "hidden sm:table-cell" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-brand-muted py-16 text-sm">Sipariş bulunamadı.</td></tr>
                  )}
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b border-brand-border/40 hover:bg-brand-dark/30 transition-colors cursor-pointer" onClick={() => setDetailOrder(o)}>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-brand-text">{o.buyerName}</p>
                        <p className="text-brand-muted text-xs">{o.buyerEmail}</p>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <p className="text-brand-text text-xs">{o.productName}</p>
                        {o.buyerCity && <p className="text-brand-muted text-xs">{o.buyerCity}</p>}
                      </td>
                      <td className="px-5 py-3 font-bold text-brand-accent whitespace-nowrap">{o.amount.toLocaleString("tr-TR")} ₺</td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value as Order["status"])}
                          className={`text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer ${getOrderStatusColor(o.status)}`}>
                          {["waiting", "approved", "completed", "declined", "cancelled", "refunded"].map((s) => (
                            <option key={s} value={s} className="bg-brand-card text-brand-text">{getOrderStatusLabel(s)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell text-brand-muted text-xs whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleDelete(o.id)} className="p-1.5 text-red-400 border border-red-400/20 hover:border-red-400/50 rounded-lg transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Sipariş Detay Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setDetailOrder(null)}>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-brand-text">Sipariş Detayı</h2>
              <button onClick={() => setDetailOrder(null)} className="text-brand-muted hover:text-brand-text w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-dark transition-all">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Müşteri", value: detailOrder.buyerName },
                { label: "E-posta", value: detailOrder.buyerEmail || "—" },
                { label: "Telefon", value: detailOrder.buyerPhone || "—" },
                { label: "Şehir", value: detailOrder.buyerCity || "—" },
                { label: "Ürün", value: detailOrder.productName },
                { label: "Tutar", value: `${detailOrder.amount.toLocaleString("tr-TR")} ₺` },
                { label: "Tarih", value: new Date(detailOrder.createdAt).toLocaleString("tr-TR") },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-brand-border/50">
                  <span className="text-brand-muted text-sm">{row.label}</span>
                  <span className="text-brand-text text-sm font-medium">{row.value}</span>
                </div>
              ))}
              {detailOrder.note && (
                <div className="py-2 border-b border-brand-border/50">
                  <p className="text-brand-muted text-sm mb-1">Not</p>
                  <p className="text-brand-text text-sm">{detailOrder.note}</p>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-brand-muted text-sm">Durum</span>
                <select value={detailOrder.status} onChange={(e) => handleStatusChange(detailOrder.id, e.target.value as Order["status"])}
                  className={`text-xs px-3 py-1.5 rounded-full border bg-transparent cursor-pointer ${getOrderStatusColor(detailOrder.status)}`}>
                  {["waiting", "approved", "completed", "declined", "cancelled", "refunded"].map((s) => (
                    <option key={s} value={s} className="bg-brand-card text-brand-text">{getOrderStatusLabel(s)}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={() => handleDelete(detailOrder.id)}
              className="w-full mt-5 py-2.5 text-sm text-red-400 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-all">
              Siparişi Sil
            </button>
          </div>
        </div>
      )}

      {/* Manuel Sipariş Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-brand-text">Manuel Sipariş</h2>
              <button onClick={() => setShowAddModal(false)} className="text-brand-muted hover:text-brand-text w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-dark transition-all">✕</button>
            </div>
            <form onSubmit={handleAddOrder} className="space-y-3">
              <input required type="text" placeholder="Ürün adı *" value={newOrder.productName}
                onChange={(e) => setNewOrder((p) => ({ ...p, productName: e.target.value }))} className={inp} />
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="Ad Soyad *" value={newOrder.buyerName}
                  onChange={(e) => setNewOrder((p) => ({ ...p, buyerName: e.target.value }))} className={inp} />
                <input type="text" placeholder="Şehir" value={newOrder.buyerCity}
                  onChange={(e) => setNewOrder((p) => ({ ...p, buyerCity: e.target.value }))} className={inp} />
              </div>
              <input type="email" placeholder="E-posta" value={newOrder.buyerEmail}
                onChange={(e) => setNewOrder((p) => ({ ...p, buyerEmail: e.target.value }))} className={inp} />
              <input type="tel" placeholder="Telefon" value={newOrder.buyerPhone}
                onChange={(e) => setNewOrder((p) => ({ ...p, buyerPhone: e.target.value }))} className={inp} />
              <input required type="number" min={0} placeholder="Tutar (₺) *" value={newOrder.amount || ""}
                onChange={(e) => setNewOrder((p) => ({ ...p, amount: Number(e.target.value) }))} className={inp} />
              <select value={newOrder.status} onChange={(e) => setNewOrder((p) => ({ ...p, status: e.target.value as Order["status"] }))} className={inp}>
                {["waiting", "approved", "completed", "declined", "cancelled"].map((s) => (
                  <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                ))}
              </select>
              <textarea placeholder="Not" rows={2} value={newOrder.note || ""}
                onChange={(e) => setNewOrder((p) => ({ ...p, note: e.target.value }))} className={`${inp} resize-none`} />
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-brand-border text-brand-muted py-2.5 rounded-xl text-sm hover:border-brand-accent/50 transition-all">İptal</button>
                <button type="submit"
                  className="flex-1 bg-brand-accent text-brand-dark font-bold py-2.5 rounded-xl text-sm hover:bg-brand-accent/90 transition-all">Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
