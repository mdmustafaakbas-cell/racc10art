"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SESSION_KEY } from "@/lib/auth";
import { getProducts } from "@/lib/store";
import { getOrders, getOrderStats } from "@/lib/orders";
import type { Product } from "@/lib/products";
import type { Order } from "@/lib/orders";
import AdminSidebar from "@/components/AdminSidebar";
import ToastContainer from "@/components/Toast";
import { getOrderStatusLabel, getOrderStatusColor } from "@/lib/shopier";

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) { router.push("/admin"); return; }
    setProducts(getProducts());
    setOrders(getOrders());
  }, [router]);

  const stats = getOrderStats(orders);
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => !p.inStock);
  const featuredCount = products.filter((p) => p.featured).length;

  const statCards = [
    { label: "Toplam Ürün", value: products.length, sub: `${featuredCount} öne çıkan`, color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20" },
    { label: "Toplam Sipariş", value: stats.total, sub: `${stats.waiting} bekliyor`, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    { label: "Onaylanan", value: stats.approved, sub: "sipariş", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
    { label: "Toplam Gelir", value: `${stats.revenue.toLocaleString("tr-TR")} ₺`, sub: "onaylı siparişler", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  ];

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <ToastContainer />
      <div className="md:ml-56 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-brand-text">Genel Bakış</h1>
              <p className="text-brand-muted text-sm mt-0.5">{new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <Link href="/admin/urun/yeni"
              className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-4 py-2.5 rounded-xl hover:bg-brand-accent/90 transition-all text-sm shadow-lg shadow-brand-accent/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün
            </Link>
          </div>

          {/* Stat kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className={`bg-brand-card border ${s.border} rounded-2xl p-5`}>
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <div className={`w-2 h-2 rounded-full ${s.color.replace("text-", "bg-")}`} />
                </div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-brand-text text-sm font-semibold mt-0.5">{s.label}</p>
                <p className="text-brand-muted text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Son Siparişler */}
            <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                <h2 className="font-bold text-brand-text text-sm">Son Siparişler</h2>
                <Link href="/admin/siparisler" className="text-xs text-brand-accent hover:underline">Tümünü Gör →</Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-brand-muted text-sm">Henüz sipariş yok.</div>
              ) : (
                <div className="divide-y divide-brand-border/50">
                  {recentOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between px-5 py-3 hover:bg-brand-dark/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-text text-sm font-medium truncate">{o.buyerName}</p>
                        <p className="text-brand-muted text-xs truncate">{o.productName}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-3">
                        <span className="text-brand-accent font-bold text-sm whitespace-nowrap">{o.amount.toLocaleString("tr-TR")} ₺</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getOrderStatusColor(o.status)}`}>
                          {getOrderStatusLabel(o.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ panel */}
            <div className="space-y-4">
              {/* Hızlı aksiyonlar */}
              <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
                <h2 className="font-bold text-brand-text text-sm mb-4">Hızlı İşlemler</h2>
                <div className="space-y-2">
                  {[
                    { href: "/admin/urun/yeni", label: "Yeni Ürün Ekle", icon: "+" },
                    { href: "/admin/siparisler", label: "Siparişleri Gör", icon: "→" },
                    { href: "/admin/ayarlar", label: "Site Ayarları", icon: "⚙" },
                    { href: "/", label: "Siteyi Görüntüle", icon: "↗", target: "_blank" },
                  ].map((a) => (
                    <Link key={a.href} href={a.href} target={a.target}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-brand-border hover:border-brand-accent/40 hover:bg-brand-dark/50 transition-all group">
                      <span className="text-sm text-brand-muted group-hover:text-brand-text transition-colors">{a.label}</span>
                      <span className="text-brand-accent text-sm">{a.icon}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stok uyarısı */}
              {lowStockProducts.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                  <h2 className="font-bold text-red-400 text-sm mb-3">Stok Uyarısı</h2>
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 3).map((p) => (
                      <Link key={p.id} href={`/admin/urun/${p.id}`}
                        className="flex items-center justify-between text-xs hover:text-brand-accent transition-colors">
                        <span className="text-brand-muted truncate">{p.name}</span>
                        <span className="text-red-400 ml-2 whitespace-nowrap">Stok Yok</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bekleyen siparişler */}
              {stats.waiting > 0 && (
                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <h2 className="font-bold text-yellow-400 text-sm">{stats.waiting} Bekleyen Sipariş</h2>
                  </div>
                  <p className="text-brand-muted text-xs mb-3">Onay bekleyen siparişler var.</p>
                  <Link href="/admin/siparisler?filter=waiting"
                    className="text-xs text-yellow-400 hover:underline">İncele →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
