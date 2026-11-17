"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PRODUCTS as DEFAULT_PRODUCTS } from "@/data/products";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: DEFAULT_PRODUCTS,
  loading: false,
  refreshProducts: async () => {},
});

// Module-level deduplication: guarantees only ONE in-flight fetch and in-memory cache
let cachedProducts: Product[] | null = null;
let inflightPromise: Promise<Product[]> | null = null;

export async function fetchProductsOnce(): Promise<Product[]> {
  if (cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }
  if (inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = (async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        cachedProducts = json.data;
        return json.data;
      }
    } catch (err) {
      console.warn("Failed to fetch products:", err);
    } finally {
      inflightPromise = null;
    }
    return cachedProducts || DEFAULT_PRODUCTS;
  })();

  return inflightPromise;
}

export function ProductsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always initialize with DEFAULT_PRODUCTS so server SSR and client initial hydration match 100%
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchProductsOnce()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshProducts = async () => {
    cachedProducts = null;
    setLoading(true);
    const data = await fetchProductsOnce();
    setProducts(data);
    setLoading(false);
  };

  return (
    <ProductContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
