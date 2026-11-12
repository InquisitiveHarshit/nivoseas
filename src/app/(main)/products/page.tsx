import { Metadata } from "next";
import { getAllProducts } from "@/lib/products-store";
import ProductListingClient from "./ProductListingClient";

export const metadata: Metadata = {
  title: "Complete Lighting Catalogue | Nivoseas Lighting LLP",
  description:
    "Explore our complete range of handcrafted chandeliers, outdoor gate fixtures, architectural LED downlights, and ceiling fans. Based in Sector 104, Noida.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return <ProductListingClient initialProducts={products} />;
}

