import type { Product } from "./products";

export const demoProducts: Product[] = [
  {
    id: "1",
    name: "Glock 19 Epoksi Tablo",
    slug: "glock-19-epoksi-tablo",
    description: "Glock 19 silueti ile galaksi efektli epoksi reçine duvar tablosu. Mavi-mor tonlarında 3D derinlik efekti.",
    price: 2500,
    category: "Silah Siluetleri",
    images: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230a0a1a;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%231a1a3e;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232d1b4e;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='500' fill='url(%23g1)'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='60' fill='%2300d4ff' text-anchor='middle' dominant-baseline='middle'%3E🔫%3C/text%3E%3Ctext x='200' y='320' font-family='Arial' font-size='16' fill='%2300d4ff' text-anchor='middle' opacity='0.7'%3EGlock 19%3C/text%3E%3C/svg%3E"
    ],
    featured: true,
    inStock: true,
    dimensions: "80x60 cm",
    material: "Epoksi Reçine, Ahşap",
    shopierUrl: "#",
  },
  {
    id: "2",
    name: "AK-47 Kaligrafi Ayna",
    slug: "ak-47-kaligrafi-ayna",
    description: "AK-47 silueti üzerine Osmanlı kaligrafi yazısı ile özel tasarım ayna. Siyah-altın detaylar.",
    price: 3200,
    category: "Silah Siluetleri",
    images: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%231a1a1a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23332200;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='500' fill='url(%23g2)'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='60' fill='%23f0c040' text-anchor='middle' dominant-baseline='middle'%3E🔫%3C/text%3E%3Ctext x='200' y='320' font-family='Arial' font-size='16' fill='%23f0c040' text-anchor='middle' opacity='0.7'%3EAK-47%3C/text%3E%3C/svg%3E"
    ],
    featured: true,
    inStock: true,
    dimensions: "100x70 cm",
    material: "Ayna, Epoksi Reçine",
    shopierUrl: "#",
  },
  {
    id: "3",
    name: "Galaksi Efekt Duvar Sanatı",
    slug: "galaksi-efekt-duvar-sanati",
    description: "Mor, mavi ve pembe tonlarında galaksi temalı epoksi reçine tablo. 3D derinlik efekti ile.",
    price: 1800,
    category: "Galaksi & Uzay",
    images: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Cdefs%3E%3CradialGradient id='g3'%3E%3Cstop offset='0%25' style='stop-color:%23ff00ff;stop-opacity:0.8' /%3E%3Cstop offset='50%25' style='stop-color:%230066ff;stop-opacity:0.6' /%3E%3Cstop offset='100%25' style='stop-color:%23000033;stop-opacity:1' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='400' height='500' fill='url(%23g3)'/%3E%3Ccircle cx='200' cy='250' r='80' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='150' cy='200' r='3' fill='%23ffffff'/%3E%3Ccircle cx='250' cy='280' r='2' fill='%23ffffff'/%3E%3Ccircle cx='180' cy='320' r='2' fill='%23ffffff'/%3E%3Ccircle cx='280' cy='220' r='3' fill='%23ffffff'/%3E%3Ctext x='200' y='450' font-family='Arial' font-size='16' fill='%2300d4ff' text-anchor='middle' opacity='0.7'%3EGalaksi%3C/text%3E%3C/svg%3E"
    ],
    featured: true,
    inStock: true,
    dimensions: "70x50 cm",
    material: "Epoksi Reçine, Ahşap",
    shopierUrl: "#",
  },
  {
    id: "4",
    name: "Minimal Geometrik Tablo",
    slug: "minimal-geometrik-tablo",
    description: "Siyah-beyaz geometrik desenli minimal epoksi tablo. Modern mekanlar için ideal.",
    price: 1500,
    category: "Minimal & Geometrik",
    images: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23ffffff'/%3E%3Cpolygon points='200,100 300,250 200,400 100,250' fill='none' stroke='%23000000' stroke-width='3'/%3E%3Ccircle cx='200' cy='250' r='60' fill='none' stroke='%23000000' stroke-width='2'/%3E%3Cline x1='100' y1='250' x2='300' y2='250' stroke='%23000000' stroke-width='1'/%3E%3Cline x1='200' y1='100' x2='200' y2='400' stroke='%23000000' stroke-width='1'/%3E%3Ctext x='200' y='450' font-family='Arial' font-size='16' fill='%23666666' text-anchor='middle'%3EMinimal%3C/text%3E%3C/svg%3E"
    ],
    featured: false,
    inStock: true,
    dimensions: "60x80 cm",
    material: "Epoksi Reçine, MDF",
    shopierUrl: "#",
  },
  {
    id: "5",
    name: "Kaligrafi Ayna - Besmele",
    slug: "kaligrafi-ayna-besmele",
    description: "Besmele yazısı ile özel tasarım kaligrafi ayna. Altın varak detaylar.",
    price: 2800,
    category: "Kaligrafi",
    images: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Cdefs%3E%3ClinearGradient id='g5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f0f0f0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23e0e0e0;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='500' fill='url(%23g5)'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='80' fill='%23f0c040' text-anchor='middle' dominant-baseline='middle'%3E✍%3C/text%3E%3Ctext x='200' y='350' font-family='Arial' font-size='16' fill='%23666666' text-anchor='middle'%3EKaligrafi%3C/text%3E%3C/svg%3E"
    ],
    featured: false,
    inStock: true,
    dimensions: "90x60 cm",
    material: "Ayna, Altın Varak",
    shopierUrl: "#",
  },
  {
    id: "6",
    name: "Okyanus Dalgası Epoksi",
    slug: "okyanus-dalgasi-epoksi",
    description: "Turkuaz ve beyaz tonlarında okyanus dalgası efektli epoksi masa. Gerçek deniz kabuğu detayları.",
    price: 4500,
    category: "Okyanus & Deniz",
    images: [
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Cdefs%3E%3ClinearGradient id='g6' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300d4ff;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%230088cc;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23004466;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='500' fill='url(%23g6)'/%3E%3Cpath d='M 0 250 Q 100 200 200 250 T 400 250' fill='none' stroke='%23ffffff' stroke-width='3' opacity='0.5'/%3E%3Cpath d='M 0 280 Q 100 230 200 280 T 400 280' fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.3'/%3E%3Ctext x='200' y='450' font-family='Arial' font-size='16' fill='%23ffffff' text-anchor='middle' opacity='0.8'%3EOkyanus%3C/text%3E%3C/svg%3E"
    ],
    featured: false,
    inStock: false,
    dimensions: "120x80 cm",
    material: "Epoksi Reçine, Ceviz Ahşap",
    shopierUrl: "#",
  },
];

export function initializeDemoData() {
  if (typeof window === "undefined") return;
  
  // Eğer ürün yoksa demo ürünleri ekle
  const existing = localStorage.getItem("racc10art_products");
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem("racc10art_products", JSON.stringify(demoProducts));
    console.log("✅ Demo ürünler yüklendi!");
  }
}
