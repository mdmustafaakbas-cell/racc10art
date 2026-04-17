import ProductsClient from "@/components/ProductsClient";

export const metadata = {
  title: "Ürünler — racc10art",
  description: "Tüm epoksi tablo ve kaligrafi ayna koleksiyonu.",
};

export default function UrunlerPage({
  searchParams,
}: {
  searchParams: { kategori?: string };
}) {
  return <ProductsClient category={searchParams.kategori} />;
}
