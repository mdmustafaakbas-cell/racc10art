"use client";
import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/urunler/${product.slug}`} className="group block card-hover">
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">

        {/* Görsel */}
        <div className="relative overflow-hidden bg-brand-deeper" style={{ aspectRatio: "4/5" }}>
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted text-5xl">🖼️</div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="text-xs font-semibold bg-brand-deeper/80 backdrop-blur text-brand-accent border border-brand-accent/30 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="text-xs font-semibold bg-red-500/80 backdrop-blur text-white px-2.5 py-1 rounded-full">
                Tükendi
              </span>
            )}
          </div>

          {/* Hover CTA */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="bg-brand-accent text-brand-dark font-bold text-sm py-2.5 rounded-xl text-center">
              İncele
            </div>
          </div>
        </div>

        {/* Bilgi */}
        <div className="p-4">
          <h3 className="font-bold text-brand-text text-sm leading-snug line-clamp-1 group-hover:text-brand-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-brand-muted text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-brand-accent font-black text-lg">
                {product.price.toLocaleString("tr-TR")} ₺
              </span>
            </div>
            {product.dimensions && (
              <span className="text-xs text-brand-muted bg-brand-border/50 px-2 py-1 rounded-lg">
                {product.dimensions}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
