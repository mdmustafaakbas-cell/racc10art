"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

interface CustomOrder {
  productId: string;
  productName: string;
  customNote: string;
  customImages: string[];
  timestamp: number;
}

export default function OzelSiparislerPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) {
      router.push("/admin");
      return;
    }
    loadOrders();
  }, [router]);

  const loadOrders = () => {
    const data = JSON.parse(localStorage.getItem("custom_orders") || "[]");
    setOrders(data.reverse()); // En yeni önce
  };

  const deleteOrder = (timestamp: number) => {
    if (!confirm("Bu özel siparişi silmek istediğinize emin misiniz?")) return;
    const filtered = orders.filter((o) => o.timestamp !== timestamp);
    localStorage.setItem("custom_orders", JSON.stringify(filtered.reverse()));
    loadOrders();
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <div className="md:ml-56 pt-14">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-brand-text">Özel Sipariş Talepleri</h1>
              <p className="text-brand-muted text-sm mt-0.5">
                Müşterilerin özelleştirme talepleri ve referans fotoğrafları
              </p>
            </div>
            <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-4 py-2 rounded-xl text-sm font-bold">
              {orders.length} Talep
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-brand-muted">Henüz özel sipariş talebi yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste */}
              <div className="lg:col-span-1 space-y-3">
                {orders.map((order) => (
                  <button
                    key={order.timestamp}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left bg-brand-card border rounded-2xl p-4 transition-all hover:border-brand-accent/40 ${
                      selectedOrder?.timestamp === order.timestamp
                        ? "border-brand-accent"
                        : "border-brand-border"
                    }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-brand-text text-sm line-clamp-1">
                        {order.productName}
                      </h3>
                      {order.customImages.length > 0 && (
                        <span className="text-xs bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                          {order.customImages.length} 📷
                        </span>
                      )}
                    </div>
                    <p className="text-brand-muted text-xs line-clamp-2 mb-2">
                      {order.customNote || "Not yok"}
                    </p>
                    <p className="text-brand-muted text-xs">
                      {new Date(order.timestamp).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </button>
                ))}
              </div>

              {/* Detay */}
              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-black text-brand-text mb-1">
                          {selectedOrder.productName}
                        </h2>
                        <p className="text-brand-muted text-sm">
                          Sipariş ID: {selectedOrder.timestamp}
                        </p>
                        <p className="text-brand-muted text-xs mt-1">
                          {new Date(selectedOrder.timestamp).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteOrder(selectedOrder.timestamp)}
                        className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-all">
                        Sil
                      </button>
                    </div>

                    {/* Not */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-brand-text mb-2">
                        Müşteri Notları
                      </h3>
                      <div className="bg-brand-deeper border border-brand-border rounded-xl p-4">
                        <p className="text-brand-sub text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedOrder.customNote || "Müşteri not eklememiş."}
                        </p>
                      </div>
                    </div>

                    {/* Fotoğraflar */}
                    {selectedOrder.customImages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-brand-text mb-3">
                          Referans Fotoğraflar ({selectedOrder.customImages.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedOrder.customImages.map((img, i) => (
                            <a
                              key={i}
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative aspect-square rounded-xl overflow-hidden border border-brand-border hover:border-brand-accent transition-all">
                              <img
                                src={img}
                                alt={`Referans ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center">
                    <p className="text-brand-muted">Detayları görmek için bir talep seçin.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
