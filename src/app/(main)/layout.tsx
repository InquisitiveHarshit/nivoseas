import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Public layout — wraps all customer-facing routes (/, /products, /products/[slug])
 * with the shared Header and Footer.
 * The /admin route is NOT in this group, so it gets no Header/Footer.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

