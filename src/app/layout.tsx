import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "racc10art — Özgün Duvar Sanatı",
  description: "Epoksi reçine, 3D efektli duvar tabloları ve kaligrafi aynalar. Türkiye geneli kargo.",
  keywords: "epoksi tablo, 3d duvar sanatı, kaligrafi ayna, racc10art, duvar dekorasyonu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} bg-brand-dark text-brand-text min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
