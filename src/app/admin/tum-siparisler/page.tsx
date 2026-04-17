"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";
import { getCheckouts, updateCheckoutStatus, deleteCheckout, getStatusLabel, getStatusColor } from "@/lib/checkout";
import type { CheckoutForm } from "@/lib/checkout";
import AdminSidebar from "@/components/AdminSidebar";

export default function TumSiparislerPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CheckoutForm[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CheckoutForm | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!localStorage.getItem(SESSION_KEY)) {
      router.push("/admin");
      return;
    }
    loadOrders();
  }, [router]);

  const loadOrders = () => {
    const data = getCheckouts();
    setOrders(data.reverse()); // En yeni önce
  };

  const handleStatusChange = (orderNumber: string, status: CheckoutForm["status"]) => {
    updateCheckoutStatus(orderNumber, status);
    loadOrders();
    if (selectedOrder?.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleDelete = (orderNumber: string) => {
    if (!confirm("Bu siparişi silmek istediğinize emin misiniz?")) return;
    deleteCheckout(orderNumber);
    loadOrders();
    setSelectedOrder(null);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <div className="md:ml-56 pt-14">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-brand-text">Tüm Siparişler</h1>
              <p className="text-brand-muted text-sm mt-0.5">
                Site üzerinden gelen siparişler
              </p>
            </div>
            <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-4 py-2 rounded-xl text-sm font-bold">
              {filteredOrders.length} Sipariş
            </div>
          </div>

          {/* Filtreler */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: "all", label: "Tümü", count: orders.length },
              { value: "pending", label: "Bekleyen", count: orders.filter((o) => o.status === "pending").length },
              { value: "confirmed", label: "Onaylanan", count: orders.filter((o) => o.status === "confirmed").length },
              { value: "preparing", label: "Hazırlanan", count: orders.filter((o) => o.status === "preparing").length },
              { value: "shipped", label: "Kargoda", count: orders.filter((o) => o.status === "shipped").length },
              { value: "delivered", label: "Teslim", count: orders.filter((o) => o.status === "delivered").length },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  filterStatus === filter.value
                    ? "bg-brand-accent text-brand-dark border-brand-accent"
                    : "border-brand-border text-brand-sub hover:border-brand-border2 hover:text-brand-text"
                }`}>
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-brand-muted">Henüz sipariş yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste */}
              <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredOrders.map((order) => (
                  <button
                    key={order.orderNumber}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left bg-brand-card border rounded-2xl p-4 transition-all hover:border-brand-accent/40 ${
                      selectedOrder?.orderNumber === order.orderNumber
                        ? "border-brand-accent"
                        : "border-brand-border"
                    }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-text text-sm truncate">
                          {order.fullName}
                        </p>
                        <p className="text-brand-muted text-xs truncate">{order.productName}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ml-2 flex-shrink-0 ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-accent font-bold text-sm">
                        {(order.productPrice * order.quantity).toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="text-brand-muted text-xs">
                        {new Date(order.orderDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
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
                          Sipariş #{selectedOrder.orderNumber}
                        </h2>
                        <p className="text-brand-muted text-sm">
                          {new Date(selectedOrder.orderDate).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(selectedOrder.orderNumber)}
                        className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-all">
                        Sil
                      </button>
                    </div>

                    {/* Durum değiştirme */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-brand-text mb-2">
                        Sipariş Durumu
                      </label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder.orderNumber, e.target.value as CheckoutForm["status"])}
                        className="w-full bg-brand-deeper border border-brand-border rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:border-brand-accent transition-colors">
                        <option value="pending">Onay Bekliyor</option>
                        <option value="confirmed">Onaylandı</option>
                        <option value="preparing">Hazırlanıyor</option>
                        <option value="shipped">Kargoda</option>
                        <option value="delivered">Teslim Edildi</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </div>

                    {/* Ürün bilgisi */}
                    <div className="bg-brand-deeper border border-brand-border rounded-xl p-4 mb-6">
                      <h3 className="text-sm font-bold text-brand-text mb-3">Ürün Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-brand-muted">Ürün</span>
                          <span className="text-brand-text font-semibold">{selectedOrder.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-brand-muted">Adet</span>
                          <span className="text-brand-text font-semibold">{selectedOrder.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-brand-muted">Birim Fiyat</span>
                          <span className="text-brand-text font-semibold">{selectedOrder.productPrice.toLocaleString("tr-TR")} ₺</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-brand-border">
                          <span className="text-brand-text font-bold">Toplam</span>
                          <span className="text-brand-accent font-black text-lg">
                            {(selectedOrder.productPrice * selectedOrder.quantity).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Özel tasarım notu */}
                    {selectedOrder.customNote && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-brand-text mb-2">Özel Tasarım Notu</h3>
                        <div className="bg-brand-deeper border border-brand-border rounded-xl p-4">
                          <p className="text-brand-sub text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedOrder.customNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Referans fotoğraflar */}
                    {selectedOrder.customImages && selectedOrder.customImages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-brand-text mb-3">
                          Referans Fotoğraflar ({selectedOrder.customImages.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
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
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Müşteri bilgileri */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-bold text-brand-text mb-3">Müşteri Bilgileri</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-brand-muted block">Ad Soyad</span>
                            <span className="text-brand-text">{selectedOrder.fullName}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">E-posta</span>
                            <span className="text-brand-text">{selectedOrder.email}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Telefon</span>
                            <span className="text-brand-text">{selectedOrder.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-brand-text mb-3">Teslimat Bilgileri</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-brand-muted block">Adres</span>
                            <span className="text-brand-text">{selectedOrder.address}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">İl / İlçe</span>
                            <span className="text-brand-text">{selectedOrder.city} / {selectedOrder.district}</span>
                          </div>
                          {selectedOrder.postalCode && (
                            <div>
                              <span className="text-brand-muted block">Posta Kodu</span>
                              <span className="text-brand-text">{selectedOrder.postalCode}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-brand-muted block">Ödeme</span>
                            <span className="text-brand-text font-semibold">
                              {selectedOrder.paymentMethod === "havale" ? "Havale / EFT" : "Kapıda Ödeme"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center">
                    <p className="text-brand-muted">Detayları görmek için bir sipariş seçin.</p>
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
