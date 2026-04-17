// Shopier API entegrasyonu
// Dökümantasyon: https://www.shopier.com/ShowProduct/api_pay4.php

export interface ShopierOrder {
  order_id: string;
  product_name: string;
  buyer_name: string;
  buyer_surname: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_address: string;
  buyer_city: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface ShopierPaymentPayload {
  API_key: string;
  website_index: string;
  platform: string;
  product_name: string;
  product_type: number; // 0 = fiziksel, 1 = dijital
  buyer_name: string;
  buyer_surname: string;
  buyer_email: string;
  buyer_account_age: number;
  buyer_id_nr: string;
  buyer_phone: string;
  billing_address: string;
  billing_city: string;
  billing_country: string;
  billing_postcode: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postcode: string;
  total_order_value: string;
  currency: string;
  platform_order_id: string;
  is_in_frame: number;
  current_language: string;
  modul_version: string;
  random_nr: string;
  signature: string;
}

// Shopier ödeme formu için imza oluşturur
export function createShopierSignature(
  randomNr: string,
  platformOrderId: string,
  totalOrderValue: string,
  currency: string,
  apiKey: string,
  apiSecret: string
): string {
  // HMAC-SHA256 imzası - server-side'da kullanılır
  const data = randomNr + platformOrderId + totalOrderValue + currency;
  // Bu fonksiyon API route'da çağrılmalı (crypto modülü gerektirir)
  return data; // placeholder - gerçek imza API route'da oluşturulur
}

// Shopier sipariş durumu Türkçe
export function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    waiting: "Bekliyor",
    approved: "Onaylandı",
    declined: "Reddedildi",
    refunded: "İade Edildi",
    cancelled: "İptal",
    completed: "Tamamlandı",
  };
  return map[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    waiting: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    approved: "text-green-400 bg-green-400/10 border-green-400/20",
    completed: "text-green-400 bg-green-400/10 border-green-400/20",
    declined: "text-red-400 bg-red-400/10 border-red-400/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
    refunded: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  };
  return map[status] || "text-brand-muted bg-brand-border/10 border-brand-border";
}
