export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin sayfaları kendi navbar'ını kullanır, site navbar/footer'ı gizle
  return <>{children}</>;
}
