/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["via.placeholder.com"],
    // base64 data URL'leri için unoptimized gerekli değil,
    // <img> tag kullanıyoruz admin'de zaten
  },
};

module.exports = nextConfig;
