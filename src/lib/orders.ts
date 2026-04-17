// Sipariş yönetimi - Shopier webhook + manuel kayıt

export interface Order {
  id: string;
  productName: string;
  productId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCity: string;
  amount: number;
  status: "waiting" | "approved" | "completed" | "declined" | "cancelled" | "refunded";
  shopierOrderId?: string;
  note?: string;
  createdAt: string;
}

const ORDERS_KEY = "racc10art_orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addOrder(order: Order): void {
  const all = getOrders();
  saveOrders([order, ...all]);
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  const all = getOrders();
  saveOrders(all.map((o) => (o.id === id ? { ...o, status } : o)));
}

export function deleteOrder(id: string): void {
  const all = getOrders();
  saveOrders(all.filter((o) => o.id !== id));
}

export function getOrderStats(orders: Order[]) {
  return {
    total: orders.length,
    waiting: orders.filter((o) => o.status === "waiting").length,
    approved: orders.filter((o) => o.status === "approved" || o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled" || o.status === "declined").length,
    revenue: orders
      .filter((o) => o.status === "approved" || o.status === "completed")
      .reduce((sum, o) => sum + o.amount, 0),
  };
}
