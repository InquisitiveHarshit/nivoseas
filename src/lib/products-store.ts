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

/**
 * Server-side async fetcher reading live from MongoDB Atlas with fallback to local store.
 * Guarantees that any update in MongoDB immediately reflects across the website.
 */
export async function getDbProducts(): Promise<Product[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const ProductModel = (await import("@/models/Product")).default;
    await connectDB();
    const docs = await ProductModel.find({}).sort({ featured: -1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((p) => ({
        ...p,
        id: (p.sku as string) || (p._id as object).toString(),
        sku: (p.sku as string) || (p._id as object).toString(),
        _id: undefined,
        __v: undefined,
      })) as unknown as Product[];
    }
  } catch (err) {
    console.warn("MongoDB fetch in getDbProducts failed, using local store:", err);
  }
  return getAllProducts();
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getAllProducts();
  const lower = slug.toLowerCase().trim();
  return products.find(
    (p) =>
      p.slug.toLowerCase().trim() === lower ||
      (p.sku && p.sku.toLowerCase().trim() === lower) ||
      p.id.toLowerCase().trim() === lower
  );
}

/**
 * Server-side async fetcher for individual product by slug or SKU from MongoDB.
 */
export async function getDbProductBySlug(slug: string): Promise<Product | undefined> {
  const normSlug = slug.toLowerCase().trim();
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const ProductModel = (await import("@/models/Product")).default;
    await connectDB();
    const doc = await ProductModel.findOne({
      $or: [
        { slug: normSlug },
        { sku: slug.toUpperCase().trim() },
        { sku: slug.trim() },
      ],
    }).lean();
    if (doc) {
      return {
        ...doc,
        id: (doc.sku as string) || (doc._id as object).toString(),
        sku: (doc.sku as string) || (doc._id as object).toString(),
        _id: undefined,
        __v: undefined,
      } as unknown as Product;
    }
  } catch (err) {
    console.warn("MongoDB fetch in getDbProductBySlug failed, using local store:", err);
  }
  return getProductBySlug(slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  const products = getAllProducts();
  return products.filter((p) => p.category === category);
}

export function addProduct(newProductData: Omit<Product, "id" | "slug"> & { id?: string; slug?: string }): Product {
  const products = getAllProducts();

  const sku = newProductData.sku ? newProductData.sku.trim() : undefined;
  if (sku) {
    const duplicate = products.find(
      (p) =>
        (p.sku && p.sku.toLowerCase() === sku.toLowerCase()) ||
        p.id.toLowerCase() === sku.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`Duplicate SKU: "${sku}" is already assigned to "${duplicate.name}". Each product must have a unique SKU.`);
    }
  }

  const id = newProductData.id || sku || `nivo-${Date.now().toString(36)}`;
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
    sku: sku || id,
    slug,
    moq: newProductData.moq || 1,
    origin: newProductData.origin || undefined,
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

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getAllProducts();
  const lowerId = id.toLowerCase().trim();
  const index = products.findIndex(
    (p) =>
      p.id.toLowerCase().trim() === lowerId ||
      (p.sku && p.sku.toLowerCase().trim() === lowerId) ||
      p.slug.toLowerCase().trim() === lowerId
  );
  if (index === -1) return null;

  const existing = products[index];

  const newSku = updates.sku ? updates.sku.trim().toUpperCase() : undefined;
  if (newSku) {
    const duplicate = products.find(
      (p) =>
        p.id !== existing.id &&
        ((p.sku && p.sku.toLowerCase() === newSku.toLowerCase()) ||
          p.id.toLowerCase() === newSku.toLowerCase())
    );
    if (duplicate) {
      throw new Error(`Duplicate SKU: "${newSku}" is already assigned to "${duplicate.name}". Each product must have a unique SKU.`);
    }
  }

  const updatedProduct: Product = {
    ...existing,
    ...updates,
    id: existing.id, // preserve immutable ID
    sku: newSku || existing.sku || existing.id,
    slug: updates.slug || (updates.name && updates.name !== existing.name
      ? updates.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "")
      : existing.slug),
    images: updates.images && updates.images.length > 0 ? updates.images : existing.images,
  };

  products[index] = updatedProduct;
  memoryStore = [...products];

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write products.json after update:", err);
  }

  return updatedProduct;
}

export function deleteProduct(idOrSlug: string): boolean {
  const products = getAllProducts();
  const lower = idOrSlug.toLowerCase().trim();
  const filtered = products.filter(
    (p) =>
      p.id.toLowerCase().trim() !== lower &&
      (p.sku && p.sku.toLowerCase().trim() !== lower) &&
      p.slug.toLowerCase().trim() !== lower
  );
  if (filtered.length === products.length) return false;

  memoryStore = filtered;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write products.json after delete:", err);
  }
  return true;
}

