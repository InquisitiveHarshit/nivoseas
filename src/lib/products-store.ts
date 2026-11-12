import fs from "fs";
import path from "path";
import { Product, ProductCategory, PRODUCTS as INITIAL_PRODUCTS } from "@/data/products";

const DATA_FILE = path.join(process.cwd(), "src", "data", "products.json");

// In-memory cache for fast reads and serverless runtimes
let memoryStore: Product[] | null = null;

function ensureDataFile(): Product[] {
  if (memoryStore) return memoryStore;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      memoryStore = JSON.parse(raw);
      return memoryStore!;
    }
  } catch (err) {
    console.warn("Could not read products.json from disk, falling back to initial data:", err);
  }

  // Initialize with seed data
  memoryStore = [...INITIAL_PRODUCTS];
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write initial products.json:", err);
  }

  return memoryStore;
}

export function getAllProducts(): Product[] {
  return ensureDataFile();
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getAllProducts();
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  const products = getAllProducts();
  return products.filter((p) => p.category === category);
}

export function addProduct(newProductData: Omit<Product, "id" | "slug"> & { id?: string; slug?: string }): Product {
  const products = getAllProducts();

  const id = newProductData.id || `nivo-${Date.now().toString(36)}`;
  const slug =
    newProductData.slug ||
    newProductData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const fullProduct: Product = {
    ...newProductData,
    id,
    slug,
    moq: newProductData.moq || 1,
    origin: newProductData.origin || "India",
    images: newProductData.images && newProductData.images.length > 0
      ? newProductData.images
      : ["/Minimalist Luxury Chandelier Interior.webp"],
  };

  // Add to beginning of array
  const updated = [fullProduct, ...products.filter((p) => p.slug !== slug && p.id !== id)];
  memoryStore = updated;

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist product to products.json:", err);
  }

  return fullProduct;
}

export function deleteProduct(idOrSlug: string): boolean {
  const products = getAllProducts();
  const filtered = products.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  if (filtered.length === products.length) return false;

  memoryStore = filtered;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write products.json after delete:", err);
  }
  return true;
}

