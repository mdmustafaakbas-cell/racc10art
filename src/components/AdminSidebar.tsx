"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";
import { useState, useEffect } from "react";
import { getOrders } from "@/lib/orders";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Genel Bakış",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/urunler",
    label: "Ürünler",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/tum-siparisler",
    label: "Tüm Siparişler",
    badge: "checkouts",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    href: "/admin/siparisler",
    label: "Shopier Siparişler",
    badge: "orders",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/ozel-siparisler",
    label: "Özel Siparişler",
    badge: "custom",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    href: "/admin/ayarlar",
    label: "Ayarlar",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [customOrderCount, setCustomOrderCount] = useState(0);
  const [checkoutCount, setCheckoutCount] = useState(0);

  useEffect(() => {
    const orders = getOrders();
    setWaitingCount(orders.filter((o) => o.status === "waiting").length);
    
    const customOrders = JSON.parse(localStorage.getItem("custom_orders") || "[]");
    setCustomOrderCount(customOrders.length);
    
    const checkouts = JSON.parse(localStorage.getItem("racc10art_checkouts") || "[]");
    setCheckoutCount(checkouts.filter((c: any) => c.status === "pending").length);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    router.push("/admin");
  };

  const isActive = (href: string) => {
    if (href === "/admin/urunler") return pathname === "/admin/urunler" || pathname.startsWith("/admin/urun");
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0d0d14] border-b border-brand-border px-4 h-14 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-brand-muted hover:text-brand-accent p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
              <span className="text-brand-accent text-xs font-black">R</span>
            </div>
            <span className="text-brand-text font-bold text-sm">racc10art</span>
            <span className="text-brand-muted text-xs hidden sm:block px-2 py-0.5 bg-brand-border/50 rounded-full">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-brand-muted text-xs hover:text-brand-accent transition-colors border border-brand-border hover:border-brand-accent/40 px-3 py-1.5 rounded-lg">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Siteyi Gör
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış
          </button>
        </div>
      </div>

      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 bg-[#0d0d14] border-r border-brand-border z-30 flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <nav className="flex-1 p-3 space-y-0.5 pt-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  active
                    ? "bg-brand-accent/10 text-brand-accent"
                    : "text-brand-muted hover:text-brand-text hover:bg-white/4"
                }`}>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-accent rounded-full" />}
                <span className={active ? "text-brand-accent" : "text-brand-muted"}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge === "orders" && waitingCount > 0 && (
                  <span className="ml-auto bg-yellow-400 text-black text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {waitingCount}
                  </span>
                )}
                {item.badge === "custom" && customOrderCount > 0 && (
                  <span className="ml-auto bg-brand-accent text-black text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {customOrderCount}
                  </span>
                )}
                {item.badge === "checkouts" && checkoutCount > 0 && (
                  <span className="ml-auto bg-green-400 text-black text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {checkoutCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-brand-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center text-xs font-bold text-brand-accent">A</div>
            <div>
              <p className="text-xs font-semibold text-brand-text">Admin</p>
              <p className="text-xs text-brand-muted">racc10art</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
