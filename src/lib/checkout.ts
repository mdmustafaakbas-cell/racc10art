export interface CheckoutForm {
  // Müşteri bilgileri
  fullName: string;
  email: string;
  phone: string;
  
  // Adres bilgileri
  address: string;
  city: string;
  district: string;
  postalCode: string;
  
  // Sipariş bilgileri
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  
  // Özelleştirme (opsiyonel)
  customNote?: string;
  customImages?: string[];
  
  // Ödeme
  paymentMethod: "havale" | "kapida";
  
  // Sistem
  orderDate: number;
  orderNumber: string;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
}

const CHECKOUT_KEY = "racc10art_checkouts";

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `RA${year}${month}${day}${random}`;
}

export function saveCheckout(checkout: CheckoutForm): void {
  if (typeof window === "undefined") return;
  const existing = getCheckouts();
  existing.push(checkout);
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(existing));
}

export function getCheckouts(): CheckoutForm[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHECKOUT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function updateCheckoutStatus(orderNumber: string, status: CheckoutForm["status"]): void {
  if (typeof window === "undefined") return;
  const checkouts = getCheckouts();
  const updated = checkouts.map((c) => 
    c.orderNumber === orderNumber ? { ...c, status } : c
  );
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(updated));
}

export function deleteCheckout(orderNumber: string): void {
  if (typeof window === "undefined") return;
  const checkouts = getCheckouts();
  const filtered = checkouts.filter((c) => c.orderNumber !== orderNumber);
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(filtered));
}

export function getCheckoutStats(checkouts: CheckoutForm[]) {
  return {
    total: checkouts.length,
    pending: checkouts.filter((c) => c.status === "pending").length,
    confirmed: checkouts.filter((c) => c.status === "confirmed").length,
    preparing: checkouts.filter((c) => c.status === "preparing").length,
    shipped: checkouts.filter((c) => c.status === "shipped").length,
    delivered: checkouts.filter((c) => c.status === "delivered").length,
    cancelled: checkouts.filter((c) => c.status === "cancelled").length,
    revenue: checkouts
      .filter((c) => c.status !== "cancelled")
      .reduce((sum, c) => sum + c.productPrice * c.quantity, 0),
  };
}

export function getStatusLabel(status: CheckoutForm["status"]): string {
  const labels: Record<CheckoutForm["status"], string> = {
    pending: "Onay Bekliyor",
    confirmed: "Onaylandı",
    preparing: "Hazırlanıyor",
    shipped: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal Edildi",
  };
  return labels[status];
}

export function getStatusColor(status: CheckoutForm["status"]): string {
  const colors: Record<CheckoutForm["status"], string> = {
    pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
    preparing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    shipped: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    delivered: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
  };
  return colors[status];
}
