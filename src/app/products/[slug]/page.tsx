import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { PRODUCTS, getProduct } from "@/lib/productsContent";

export function generateStaticParams() {
  return PRODUCTS.filter((product) => !product.ctaExternal).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.ctaExternal) return {};
  return {
    title: `${product.name} — Products`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.ctaExternal) notFound();

  return <ProductDetail product={product} />;
}
