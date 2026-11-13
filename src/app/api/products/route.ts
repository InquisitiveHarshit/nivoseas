import { NextResponse } from "next/server";
import mongoose from "mongoose";
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

    // Build safe lookup conditions without casting arbitrary strings to ObjectId
    const isObjectId = typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findConditions: any[] = [
      { sku: id },
      { sku: String(id).toUpperCase() },
      { slug: String(id).toLowerCase() },
    ];
    if (isObjectId) {
      findConditions.push({ _id: new mongoose.Types.ObjectId(id) });
    }

    // 1. Locate the existing product document
    const existing = await ProductModel.findOne({ $or: findConditions });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Product with ID/SKU "${id}" not found` },
        { status: 404 }
      );
    }

    // 2. Normalise and check duplicate SKU if updating SKU
    if (updates.sku) {
        const newSku = updates.sku.trim().toUpperCase();
        // Ensure no other product already owns this SKU (using actual ObjectId for _id)
        const dup = await ProductModel.findOne({
          sku: newSku,
          _id: { $ne: existing._id },
        });
        if (dup) {
          return NextResponse.json(
            {
              success: false,
              error: `Duplicate SKU: "${newSku}" is already assigned to "${dup.name}".`,
            },
            { status: 409 }
          );
        }
        updates.sku = newSku;
      }

    // 3. Update using the verified MongoDB ObjectId
    const updated = await ProductModel.findByIdAndUpdate(
          existing._id,
          { $set: updates },
      { returnDocument: "after" }
        );

        if (!updated) {
          return NextResponse.json(
        { success: false, error: "Failed to save product updates" },
            { status: 500 }
          );
        }

        const jsonProd = { ...updated.toJSON(), id: updated.sku };
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

          const isObjectId = typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const deleteConditions: any[] = [
            { sku: id },
            { sku: String(id).toUpperCase() },
            { slug: String(id).toLowerCase() },
          ];
          if (isObjectId) {
            deleteConditions.push({ _id: new mongoose.Types.ObjectId(id) });
          }

          const deleted = await ProductModel.findOneAndDelete({
            $or: deleteConditions,
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
