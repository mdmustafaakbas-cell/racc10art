export interface SiteSettings {
  // Shopier
  shopierApiKey: string;
  shopierApiSecret: string;
  shopierWebsiteIndex: string;

  // Güvenlik
  adminPassword: string;

  // Site genel
  siteName: string;
  siteDescription: string;
  instagramUrl: string;
  whatsappNumber: string;
  cargoInfo: string;

  // Hero bölümü
  heroBadge: string;       // "Özgün Duvar Sanatı"
  heroTitle: string;       // "racc10art"
  heroSubtitle: string;    // "Epoksi reçine..."
  heroBtn1Text: string;    // "Koleksiyonu Keşfet"
  heroBtn2Text: string;    // "Hakkımızda"

  // Öne çıkan ürünler bölümü
  featuredBadge: string;   // "Koleksiyon"
  featuredTitle: string;   // "Öne Çıkan Ürünler"
  featuredLinkText: string;// "Tümünü Gör"

  // Özellikler kartları (3 kart)
  feature1Icon: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Icon: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Icon: string;
  feature3Title: string;
  feature3Desc: string;

  // Ürünler sayfası
  productsPageBadge: string;
  productsPageTitle: string;

  // Hakkımızda sayfası
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutText3: string;
  aboutCtaTitle: string;
  aboutCtaDesc: string;
  aboutCtaBtn: string;

  // İletişim sayfası
  contactTitle: string;
  contactSubtitle: string;

  // Footer
  footerDesc: string;
  footerCopyright: string;
}

const SETTINGS_KEY = "racc10art_settings";

export const defaultSettings: SiteSettings = {
  shopierApiKey: "",
  shopierApiSecret: "",
  shopierWebsiteIndex: "1",
  adminPassword: "racc10art2024",

  siteName: "racc10art",
  siteDescription: "Özgün epoksi reçine duvar sanatı. Türkiye geneli kargo.",
  instagramUrl: "https://instagram.com/racc10art",
  whatsappNumber: "",
  cargoInfo: "Türkiye geneli kargo. Sipariş sonrası 3-5 iş günü.",

  heroBadge: "Özgün Duvar Sanatı",
  heroTitle: "racc10art",
  heroSubtitle: "Epoksi reçine, 3D efekt ve özgün tasarımlarla duvarlarına karakter kat.\nHer parça bir ifade, her tablo bir duruş.",
  heroBtn1Text: "Koleksiyonu Keşfet",
  heroBtn2Text: "Hakkımızda",

  featuredBadge: "Koleksiyon",
  featuredTitle: "Öne Çıkan Ürünler",
  featuredLinkText: "Tümünü Gör",

  feature1Icon: "🎨",
  feature1Title: "El Yapımı",
  feature1Desc: "Her ürün özenle elle üretilir, seri değil.",
  feature2Icon: "🚚",
  feature2Title: "Türkiye Kargo",
  feature2Desc: "Tüm Türkiye'ye güvenli paketleme ile gönderim.",
  feature3Icon: "💳",
  feature3Title: "Shopier Güvencesi",
  feature3Desc: "Güvenli ödeme altyapısıyla kolay alışveriş.",

  productsPageBadge: "Koleksiyon",
  productsPageTitle: "Tüm Ürünler",

  aboutTitle: "Hakkımızda",
  aboutText1: "racc10art, epoksi reçine ve 3D efekt teknikleriyle özgün duvar sanatı üretiyor. Her parça el yapımı, her tasarım bir ifade.",
  aboutText2: "Silah siluetlerinden kaligrafi aynalara, galaksi dokularından minimal formlara kadar geniş bir estetik yelpazede çalışıyoruz.",
  aboutText3: "Türkiye genelinde kargo yapıyoruz. Özel sipariş ve kişiselleştirme için Instagram üzerinden ulaşabilirsin.",
  aboutCtaTitle: "Özel Sipariş",
  aboutCtaDesc: "İstediğin tasarımı, boyutu veya rengi özelleştirebiliriz.",
  aboutCtaBtn: "Instagram'dan Yaz",

  contactTitle: "İletişim",
  contactSubtitle: "Sipariş, özel tasarım veya herhangi bir soru için aşağıdaki kanallardan ulaşabilirsin.",

  footerDesc: "Özgün epoksi reçine duvar sanatı.\nTürkiye geneli kargo.",
  footerCopyright: "racc10art. Tüm hakları saklıdır.",
};

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
