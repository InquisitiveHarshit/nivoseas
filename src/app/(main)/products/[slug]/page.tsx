import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/products-store";
import ProductDetailView from "./ProductDetailView";

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Fixture Not Found | Nivoseas Lighting LLP",
    };
  }

  return {
    title: `${product.name} | Nivoseas Lighting`,
    description:
      product.tagline ||
      `Explore specifications, finishes, and WhatsApp enquiry for ${product.name} by Nivoseas Lighting LLP.`,
    openGraph: {
      title: product.name,
      description: product.tagline || "Architectural & Luxury Lighting Solutions",
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const all = getAllProducts();
  const relatedProducts = all
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}

