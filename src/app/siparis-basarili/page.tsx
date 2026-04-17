"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCheckouts } from "@/lib/checkout";
import type { CheckoutForm } from "@/lib/checkout";

export default function SiparisBasariliPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<CheckoutForm | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    const checkouts = getCheckouts();
    const found = checkouts.find((c) => c.orderNumber === orderNumber);
    setOrder(found || null);
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-brand-muted mb-4">Sipariş bulunamadı</p>
          <Link href="/" className="text-brand-accent hover:underline">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Başarı animasyonu */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-400/10 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-brand-text mb-3">Siparişiniz Alındı!</h1>
          <p className="text-brand-sub text-lg">Teşekkür ederiz, en kısa sürede size dönüş yapacağız.</p>
        </div>

        {/* Sipariş detayları */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-brand-border">
            <div>
              <p className="text-brand-muted text-sm mb-1">Sipariş Numarası</p>
              <p className="text-2xl font-black text-brand-accent">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-brand-muted text-sm mb-1">Tarih</p>
              <p className="text-brand-text font-semibold">
                {new Date(order.orderDate).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-brand-muted text-xs mb-2">ÜRÜN</p>
              <p className="text-brand-text font-bold">{order.productName}</p>
              <p className="text-brand-sub text-sm">
                {order.quantity} adet × {order.productPrice.toLocaleString("tr-TR")} ₺
              </p>
            </div>

            {order.customNote && (
              <div>
                <p className="text-brand-muted text-xs mb-2">ÖZEL TASARIM NOTU</p>
                <p className="text-brand-sub text-sm bg-brand-deeper border border-brand-border rounded-xl p-3">
                  {order.customNote}
                </p>
              </div>
            )}

            <div>
              <p className="text-brand-muted text-xs mb-2">TESLİMAT ADRESİ</p>
              <p className="text-brand-text text-sm">
                {order.fullName}<br />
                {order.address}<br />
                {order.district}, {order.city} {order.postalCode && `- ${order.postalCode}`}
              </p>
            </div>

            <div>
              <p className="text-brand-muted text-xs mb-2">İLETİŞİM</p>
              <p className="text-brand-text text-sm">
                {order.email}<br />
                {order.phone}
              </p>
            </div>

            <div>
              <p className="text-brand-muted text-xs mb-2">ÖDEME YÖNTEMİ</p>
              <p className="text-brand-text text-sm font-semibold">
                {order.paymentMethod === "havale" ? "Havale / EFT" : "Kapıda Ödeme"}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-border flex justify-between items-center">
            <span className="text-brand-muted">Toplam Tutar</span>
            <span className="text-3xl font-black text-brand-accent">
              {(order.productPrice * order.quantity).toLocaleString("tr-TR")} ₺
            </span>
          </div>
        </div>

        {/* Ödeme bilgisi */}
        {order.paymentMethod === "havale" && (
          <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Havale Bilgileri
            </h3>
            <p className="text-brand-sub text-sm mb-4">
              Siparişiniz onaylandıktan sonra size e-posta ile banka hesap bilgileri gönderilecektir.
              Ödemenizi yaptıktan sonra dekont/makbuzunu bize iletmeniz gerekmektedir.
            </p>
          </div>
        )}

        {/* Aksiyonlar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/urunler"
            className="flex-1 text-center bg-brand-card border border-brand-border text-brand-text font-bold py-4 rounded-2xl hover:border-brand-accent/40 transition-all">
            Alışverişe Devam Et
          </Link>
          <Link href="/"
            className="flex-1 text-center bg-brand-accent text-brand-dark font-bold py-4 rounded-2xl hover:bg-brand-accent/90 transition-all">
            Ana Sayfaya Dön
          </Link>
        </div>

        <p className="text-brand-muted text-xs text-center mt-6">
          Sipariş durumunuzu e-posta adresinize gönderilen bildirimlerden takip edebilirsiniz.
        </p>
      </div>
    </div>
  );
}
