import { Suspense } from "react";
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

  /**
   * Async child that awaits dynamic `params` behind Suspense.
   * This keeps the App Shell instant and statically prefetchable.
   */
  async function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
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

  function ProductDetailSkeleton() {
    return (
      <div className="min-h-screen bg-[#F3EDE4] pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 animate-pulse space-y-8">
          <div className="h-4 w-48 bg-[#2A1810]/10 rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-12">
            <div className="lg:col-span-5 aspect-square bg-white/60 rounded-[32px] border border-[#2A1810]/10" />
            <div className="lg:col-span-6 space-y-6">
              <div className="h-6 w-32 bg-[#2A1810]/10 rounded-full" />
              <div className="h-12 w-3/4 bg-[#2A1810]/10 rounded-2xl" />
              <div className="h-32 bg-white/60 rounded-[28px] border border-[#2A1810]/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default function ProductDetailPage({ params }: ProductPageProps) {
    return (
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    );
  }
