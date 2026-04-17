"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSettings, defaultSettings } from "@/lib/settings";
import type { SiteSettings } from "@/lib/settings";

export default function AboutClient() {
  const [s, setS] = useState<SiteSettings>(defaultSettings);
  useEffect(() => { setS(getSettings()); }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="max-w-3xl mb-20">
        <p className="text-brand-accent text-xs font-semibold tracking-[0.25em] uppercase mb-4">Biz Kimiz</p>
        <h1 className="text-5xl md:text-6xl font-black text-brand-text leading-tight mb-6">{s.aboutTitle}</h1>
        <div className="w-16 h-1 bg-brand-accent rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        <div className="space-y-6 text-brand-sub leading-relaxed text-lg">
          {s.aboutText1 && <p><span className="text-brand-accent font-bold">{s.siteName}</span>, {s.aboutText1}</p>}
          {s.aboutText2 && <p>{s.aboutText2}</p>}
          {s.aboutText3 && <p>{s.aboutText3}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "100%", label: "El Yapımı" },
            { value: "TR", label: "Türkiye Kargo" },
            { value: "∞", label: "Özel Tasarım" },
            { value: "✦", label: "Özgün Sanat" },
          ].map((stat) => (
            <div key={stat.label} className="bg-brand-card border border-brand-border rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-accent/30 transition-all">
              <p className="text-3xl font-black text-brand-accent mb-2">{stat.value}</p>
              <p className="text-brand-sub text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative bg-brand-card border border-brand-border rounded-3xl p-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, #00d4ff08 0%, transparent 60%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-brand-text mb-2">{s.aboutCtaTitle}</h2>
            <p className="text-brand-sub">{s.aboutCtaDesc}</p>
          </div>
          <Link href="/urunler"
            className="flex-shrink-0 bg-brand-accent text-brand-dark font-bold px-8 py-4 rounded-2xl text-sm hover:bg-brand-accent/90 transition-all hover:shadow-xl hover:shadow-brand-accent/20 whitespace-nowrap">
            Özel Sipariş Ver
          </Link>
        </div>
      </div>
    </div>
  );
}
