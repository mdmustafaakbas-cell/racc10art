import ProductsClient from "@/components/ProductsClient";

export const metadata = {
  title: "Ürünler — racc10art",
  description: "Tüm epoksi tablo ve kaligrafi ayna koleksiyonu.",
};

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  return <ProductsClient category={params.kategori} />;
}
