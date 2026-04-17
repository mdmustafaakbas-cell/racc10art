"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Koleksiyon" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-brand-deeper/95 backdrop-blur-xl border-b border-brand-border shadow-xl shadow-black/40"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: "72px" }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent/30 to-purple-500/20 border border-brand-accent/30 flex items-center justify-center group-hover:border-brand-accent/60 transition-all">
            <span className="text-brand-accent font-black text-sm">R</span>
          </div>
          <span className="font-black text-lg tracking-widest text-brand-text group-hover:text-brand-accent transition-colors">
            racc10art
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "text-brand-accent bg-brand-accent/10"
                    : "text-brand-sub hover:text-brand-text hover:bg-white/5"
                }`}>
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* CTA + mobile */}
        <div className="flex items-center gap-3">
          <Link href="/urunler"
            className="hidden md:flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20">
            Satın Al
          </Link>
          <button className="md:hidden text-brand-sub hover:text-brand-text p-2" onClick={() => setOpen(!open)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-card border-t border-brand-border px-6 py-4 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-brand-sub hover:text-brand-text hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}
          <Link href="/urunler" onClick={() => setOpen(false)}
            className="block mt-3 text-center bg-brand-accent text-brand-dark font-bold px-4 py-3 rounded-xl text-sm">
            Koleksiyonu Keşfet
          </Link>
        </div>
      )}
    </nav>
  );
}
