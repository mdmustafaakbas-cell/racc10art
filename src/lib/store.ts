import type { Product } from "./products";
import { products as defaultProducts } from "./products";

const STORE_KEY = "racc10art_products";

export function getProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return defaultProducts;
  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(products));
}

export function addProduct(product: Product): void {
  const all = getProducts();
  saveProducts([...all, product]);
}

export function updateProduct(updated: Product): void {
  const all = getProducts();
  saveProducts(all.map((p) => (p.id === updated.id ? updated : p)));
}

export function deleteProduct(id: string): void {
  const all = getProducts();
  saveProducts(all.filter((p) => p.id !== id));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
