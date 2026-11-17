import { Suspense } from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import { getDbProducts } from "@/lib/products-store";
import ProductListingClient from "./ProductListingClient";

export const metadata: Metadata = {
  title: "Complete Lighting Catalogue | Nivoseas Lighting LLP",
  description:
    "Explore our complete range of handcrafted chandeliers, outdoor gate fixtures, architectural LED downlights, and ceiling fans. Based in Sector 104, Noida.",
};

  async function ProductListingLoader() {
    await connection();
    const products = await getDbProducts();
    return <ProductListingClient initialProducts={products} />;
  }

  export default function ProductsPage() {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F3EDE4] text-[#2A1810] pt-28 pb-24 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#C8782A] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#4A2C1A]/70 uppercase tracking-widest">
                Loading Luminaires...
              </p>
            </div>
          </div>
        }
      >
        <ProductListingLoader />
      </Suspense>
    );
  }

