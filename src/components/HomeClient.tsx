"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import FeaturedProducts from "./FeaturedProducts";
import { getSettings, defaultSettings } from "@/lib/settings";
import { initializeDemoData } from "@/lib/demo-data";
import type { SiteSettings } from "@/lib/settings";

export default function HomeClient() {
  const [s, setS] = useState<SiteSettings>(defaultSettings);
  useEffect(() => { 
    initializeDemoData(); // Demo ürünleri yükle
    setS(getSettings()); 
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Arka plan katmanları */}
        <div className="absolute inset-0 bg-brand-deeper" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, #00d4ff0d 0%, transparent 70%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 80% 80%, #7c3aed0a 0%, transparent 60%)",
        }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, #080810 100%)",
        }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto fade-up">
          {s.heroBadge && (
            <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              {s.heroBadge}
            </div>
          )}

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
            <span className="gradient-text">{s.heroTitle}</span>
          </h1>

          <p className="text-brand-sub text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
            {s.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/urunler"
              className="group relative bg-brand-accent text-brand-dark font-bold px-10 py-4 rounded-2xl text-sm tracking-wide overflow-hidden transition-all hover:shadow-2xl hover:shadow-brand-accent/30 hover:scale-105">
              <span className="relative z-10">{s.heroBtn1Text}</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>
            <Link href="/hakkimizda"
              className="border border-brand-border2 text-brand-sub font-semibold px-10 py-4 rounded-2xl text-sm tracking-wide hover:border-brand-accent/40 hover:text-brand-text transition-all backdrop-blur">
              {s.heroBtn2Text}
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-brand-muted">
            <span className="text-xs tracking-widest uppercase">Keşfet</span>
            <div className="w-px h-12 bg-gradient-to-b from-brand-muted to-transparent" />
          </div>
        </div>
      </section>

      {/* ── ÖZELLIKLER BANT ── */}
      <div className="border-y border-brand-border bg-brand-card/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-x-12 gap-y-3">
          {[
            { icon: "✦", text: "El Yapımı & Özgün" },
            { icon: "✦", text: "Türkiye Geneli Kargo" },
            { icon: "✦", text: "Shopier Güvenceli Ödeme" },
            { icon: "✦", text: "Özel Sipariş Mümkün" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-brand-sub text-sm">
              <span className="text-brand-accent text-xs">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── ÖNE ÇIKAN ÜRÜNLER ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            {s.featuredBadge && (
              <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">{s.featuredBadge}</p>
            )}
            <h2 className="text-4xl md:text-5xl font-black text-brand-text leading-tight">
              {s.featuredTitle}
            </h2>
          </div>
          <Link href="/urunler"
            className="hidden sm:flex items-center gap-2 text-brand-sub text-sm hover:text-brand-accent transition-colors group">
            {s.featuredLinkText}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <FeaturedProducts />
        <div className="mt-10 text-center sm:hidden">
          <Link href="/urunler" className="text-brand-accent text-sm hover:underline">Tüm ürünleri gör →</Link>
        </div>
      </section>

      {/* ── NEDEN BİZ ── */}
      <section className="bg-brand-card border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">Fark</p>
            <h2 className="text-3xl md:text-4xl font-black text-brand-text">Neden racc10art?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: s.feature1Icon, title: s.feature1Title, desc: s.feature1Desc },
              { icon: s.feature2Icon, title: s.feature2Title, desc: s.feature2Desc },
              { icon: s.feature3Icon, title: s.feature3Title, desc: s.feature3Desc },
            ].map((f, i) => (
              <div key={i} className="bg-brand-deeper border border-brand-border rounded-2xl p-8 text-center hover:border-brand-accent/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-accent/15 transition-all">
                  <span className="text-3xl">{f.icon}</span>
                </div>
                <h3 className="font-bold text-brand-text text-lg mb-2">{f.title}</h3>
                <p className="text-brand-sub text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANT ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden border border-brand-border bg-brand-card p-12 text-center">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 70% 80% at 50% 50%, #00d4ff08 0%, transparent 70%)",
          }} />
          <div className="relative z-10">
            <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-4">Özel Sipariş</p>
            <h2 className="text-3xl md:text-4xl font-black text-brand-text mb-4">
              Hayalindeki Tasarımı Yap
            </h2>
            <p className="text-brand-sub text-lg mb-8 max-w-xl mx-auto">
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
      </section>
    </>
  );
}
