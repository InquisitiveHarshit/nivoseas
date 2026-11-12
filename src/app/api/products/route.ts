import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import { checkRateLimit } from "@/lib/rate-limit";
import { addProduct, updateProduct, deleteProduct } from "@/lib/products-store";

/** ─── Helper: auto-generate slug from name ─── */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** ─── Helper: seed DB with static products on first boot ─── */
async function seedIfEmpty() {
  const count = await ProductModel.countDocuments();
  if (count === 0 && SEED_PRODUCTS.length > 0) {
    const docs = SEED_PRODUCTS.map((p) => ({
      ...p,
      sku: (p.sku || p.id).toUpperCase(),
      slug: p.slug || toSlug(p.name),
    }));
    // insertMany with ordered:false so duplicate-key errors are skipped gracefully
    await ProductModel.insertMany(docs, { ordered: false }).catch(() => { });
    console.log(`[MongoDB] Seeded ${SEED_PRODUCTS.length} products.`);
  }
}

// ─────────────────────────────────────────────
// GET /api/products
// ─────────────────────────────────────────────
export async function GET(request: Request) {
  const rl = checkRateLimit(request, { limit: 120, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    await connectDB();
    await seedIfEmpty();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (category && category !== "all") filter.category = category;
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { subcategory: { $regex: query, $options: "i" } },
        { tagline: { $regex: query, $options: "i" } },
        { sku: { $regex: query, $options: "i" } },
      ];
    }

    const products = await ProductModel.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    // Normalise _id → id for client compatibility
    const data = products.map((p) => ({
      ...p,
      id: (p.sku as string) || (p._id as object).toString(),
      _id: undefined,
      __v: undefined,
    }));

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error: unknown) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/products  — Create
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  const rl = checkRateLimit(request, { limit: 30, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    await connectDB();

    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const sku = (body.sku || body.name).trim().toUpperCase();
    const slug = body.slug || toSlug(body.name);

    // Duplicate SKU check
    const existing = await ProductModel.findOne({
      $or: [{ sku }, { slug }],
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate SKU: "${sku}" is already assigned to "${existing.name}". Each product must have a unique SKU.`,
        },
        { status: 409 }
      );
    }

    const created = await ProductModel.create({
      ...body,
      sku,
      slug,
      moq: body.moq || 1,
      images: body.images?.length ? body.images : ["/Minimalist Luxury Chandelier Interior.webp"],
    });

    const jsonProd = { ...created.toJSON(), id: created.sku };
    try {
      addProduct(jsonProd as any);
    } catch (e) {
      console.warn("Could not sync to local cache:", e);
    }

    return NextResponse.json(
      { success: true, data: jsonProd },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/products]", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = (error as any)?.message || "Failed to create product";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

// ─────────────────────────────────────────────
// PUT /api/products  — Update (full or partial)
// ─────────────────────────────────────────────
export async function PUT(request: Request) {
  const rl = checkRateLimit(request, { limit: 40, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    await connectDB();

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required for update" },
        { status: 400 }
      );
    }

    // Normalise SKU if provided
    if (updates.sku) updates.sku = updates.sku.trim().toUpperCase();

    // Duplicate SKU check (exclude self)
    if (updates.sku) {
      const dup = await ProductModel.findOne({ sku: updates.sku, _id: { $ne: id } });
      if (!dup) {
        // also check by old sku field matching id
        const dupBySku = await ProductModel.findOne({ sku: updates.sku });
        if (dupBySku && dupBySku.sku !== id && dupBySku.id !== id) {
          return NextResponse.json(
            {
              success: false,
              error: `Duplicate SKU: "${updates.sku}" is already assigned to "${dupBySku.name}".`,
            },
            { status: 409 }
          );
        }
      }
    }

    // Find by id (sku) or MongoDB _id or slug
    const product = await ProductModel.findOneAndUpdate(
      { $or: [{ sku: id }, { slug: id }, { _id: id.length === 24 ? id : undefined }] },
      { $set: updates },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const jsonProd = { ...product.toJSON(), id: product.sku };
    try {
      updateProduct(id, updates);
    } catch (e) {
      console.warn("Could not sync update to local cache:", e);
    }

    return NextResponse.json({ success: true, data: jsonProd });
  } catch (error: unknown) {
    console.error("[PUT /api/products]", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = (error as any)?.message || "Failed to update product";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/products?id=SKUORID
// ─────────────────────────────────────────────
export async function DELETE(request: Request) {
    const rl = checkRateLimit(request, { limit: 20, windowMs: 60 * 1000 });
    if (rl.response) return rl.response;

    try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json(
          { success: false, error: "Product ID or SKU is required" },
          { status: 400 }
        );
      }

      const deleted = await ProductModel.findOneAndDelete({
        $or: [{ sku: id }, { slug: id }],
      });

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      try {
        deleteProduct(id);
      } catch (e) {
        console.warn("Could not sync delete to local cache:", e);
      }

      return NextResponse.json({ success: true, message: `Deleted "${deleted.name}"` });
    } catch (error: unknown) {
      console.error("[DELETE /api/products]", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete product" },
        { status: 500 }
      );
    }
  }
