export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // TL
  category: string;
  images: string[]; // ürün görselleri /public/products/ altında
  shopierUrl: string; // Shopier ödeme linki
  inStock: boolean;
  featured: boolean;
  dimensions?: string;
  material?: string;
}

// Ürünlerini buraya ekle. shopierUrl'yi Shopier panelinden al.
export const products: Product[] = [
  {
    id: "1",
    slug: "glock-17-galaxy-tablo",
    name: "Glock 17 Galaxy Tablo",
    description:
      "Siyah epoksi zemin üzerine galaksi dokulu, Glock 17 silüeti. Minimal form, maksimum etki. Duvarına güç katıyor.",
    price: 850,
    category: "Silah Serisi",
    images: ["/products/glock-17.jpg"],
    shopierUrl: "https://www.shopier.com/urun-linkin-buraya",
    inStock: true,
    featured: true,
    dimensions: "30x40 cm",
    material: "Epoksi Reçine, MDF",
  },
  {
    id: "2",
    slug: "ak47-3d-tablo",
    name: "AK-47 3D Duvar Tablosu",
    description:
      "Gerçekçi 3D efektiyle AK-47 silüeti. Güç, denge ve estetiğin birleştiği iddialı bir duvar sanatı.",
    price: 950,
    category: "Silah Serisi",
    images: ["/products/ak47.jpg"],
    shopierUrl: "https://www.shopier.com/urun-linkin-buraya",
    inStock: true,
    featured: true,
    dimensions: "40x50 cm",
    material: "Epoksi Reçine, MDF",
  },
  {
    id: "3",
    slug: "aura-kaligrafi-ayna",
    name: "Aura Kaligrafi Ayna",
    description:
      "Sadece bir ayna değil, enerjini yansıtan özel bir obje. Kaligrafi desenli yuvarlak ayna.",
    price: 1200,
    category: "Ayna Serisi",
    images: ["/products/kaligrafi-ayna.jpg"],
    shopierUrl: "https://www.shopier.com/urun-linkin-buraya",
    inStock: true,
    featured: true,
    dimensions: "60x60 cm",
    material: "Ayna, Lazer Kesim Metal",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.inStock);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export const categories = [...new Set(products.map((p) => p.category))];
