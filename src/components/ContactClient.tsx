"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSettings, defaultSettings } from "@/lib/settings";
import type { SiteSettings } from "@/lib/settings";

export default function ContactClient() {
  const [s, setS] = useState<SiteSettings>(defaultSettings);
  useEffect(() => { setS(getSettings()); }, []);

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      title: "Instagram",
      desc: s.instagramUrl.replace("https://instagram.com/", "@"),
      href: s.instagramUrl,
      color: "from-purple-500 to-pink-500",
      show: !!s.instagramUrl,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      title: "WhatsApp",
      desc: `+${s.whatsappNumber}`,
      href: `https://wa.me/${s.whatsappNumber}`,
      color: "from-green-500 to-emerald-500",
      show: !!s.whatsappNumber,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Shopier",
      desc: "Güvenli online ödeme",
      href: "https://www.shopier.com",
      color: "from-brand-accent to-blue-500",
      show: true,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: "Kargo",
      desc: s.cargoInfo,
      href: null,
      color: "from-orange-500 to-red-500",
      show: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="max-w-3xl mb-16">
        <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-4">Ulaş</p>
        <h1 className="text-5xl md:text-6xl font-black text-brand-text leading-tight mb-6">{s.contactTitle}</h1>
        <p className="text-brand-sub text-lg leading-relaxed">{s.contactSubtitle}</p>
      </div>

      {/* İletişim kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {contactMethods.filter((m) => m.show).map((method) => (
          <div key={method.title} className="group">
            {method.href ? (
              <a href={method.href} target="_blank" rel="noopener noreferrer"
                className="block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent/40 transition-all card-hover">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} bg-opacity-10 flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform`}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{method.title}</h3>
                <p className="text-brand-sub">{method.desc}</p>
              </a>
            ) : (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} bg-opacity-10 flex items-center justify-center mb-5 text-white`}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-2">{method.title}</h3>
                <p className="text-brand-sub">{method.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative bg-brand-card border border-brand-border rounded-3xl p-12 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, #00d4ff08 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-4">Özel Tasarım</p>
          <h2 className="text-3xl font-black text-brand-text mb-4">Hayalindeki Tabloyu Tasarla</h2>
          <p className="text-brand-sub mb-8 max-w-xl mx-auto">
            Boyut, renk, motif — her şeyi özelleştirebiliriz. Ürün sayfasından özel sipariş verin.
          </p>
          <Link href="/urunler"
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-8 py-4 rounded-2xl text-sm hover:bg-brand-accent/90 transition-all hover:shadow-xl hover:shadow-brand-accent/20">
            Ürünleri Keşfet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
