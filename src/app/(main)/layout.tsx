import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductContext";

/**
 * Public layout — wraps all customer-facing routes (/, /products, /products/[slug])
 * with the shared Header, Footer, and single-source ProductsProvider.
 *
 * Fully static & prerender-safe (no uncached connection() or fetch() outside Suspense).
 * ProductsProvider handles deduplicated single-fetch on the client.
 */
      export default function MainLayout({
        children,
}: {
        children: React.ReactNode;
}) {
  return (
      <ProductsProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </ProductsProvider>
      );
}
