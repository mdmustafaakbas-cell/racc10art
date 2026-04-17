"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/store";
import type { Product } from "@/lib/products";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const featured = getProducts().filter((p) => p.featured && p.inStock);
    setProducts(featured);
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
