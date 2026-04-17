import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-brand-accent/20 mb-4">404</p>
      <h1 className="text-2xl font-bold text-brand-text mb-2">Sayfa Bulunamadı</h1>
      <p className="text-brand-muted mb-8">Aradığın sayfa mevcut değil.</p>
      <Link
        href="/"
        className="bg-brand-accent text-brand-dark font-bold px-6 py-3 rounded-lg hover:bg-brand-accent/90 transition-all"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
