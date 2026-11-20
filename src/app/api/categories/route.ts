import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CategoryImage from "@/models/CategoryImage";
import { CATEGORIES } from "@/data/categories";

/** GET /api/categories
 *  Returns all categories merged with any DB overrides for heroImage.
 */
export async function GET() {
  try {
    await connectDB();
    const overrides = await CategoryImage.find({}).lean();
    const overrideMap: Record<string, string> = {};
    for (const o of overrides) {
      overrideMap[o.categoryId] = o.heroImage;
    }

    const result = CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      heroImage: overrideMap[cat.id] ?? cat.heroImage ?? null,
      defaultImage: cat.heroImage ?? null,
      hasOverride: Boolean(overrideMap[cat.id]),
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json(
      { success: false, error: "Failed to load category images." },
      { status: 500 }
    );
  }
}

/** PUT /api/categories
 *  Body: { categoryId: string; heroImage: string }
 *  Upserts the override.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, heroImage } = body as {
      categoryId?: string;
      heroImage?: string;
    };

    if (!categoryId || !heroImage) {
      return NextResponse.json(
        { success: false, error: "categoryId and heroImage are required." },
        { status: 400 }
      );
    }

    const valid = CATEGORIES.some((c) => c.id === categoryId);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: `Unknown category: ${categoryId}` },
        { status: 400 }
      );
    }

    await connectDB();
    await CategoryImage.findOneAndUpdate(
      { categoryId },
      { heroImage, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/categories]", err);
    return NextResponse.json(
      { success: false, error: "Failed to save category image." },
      { status: 500 }
    );
  }
}

/** DELETE /api/categories?categoryId=xxx
 *  Removes the override so the default from categories.ts is used.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "categoryId is required." },
        { status: 400 }
      );
    }
    await connectDB();
    await CategoryImage.deleteOne({ categoryId });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/categories]", err);
    return NextResponse.json(
      { success: false, error: "Failed to reset category image." },
      { status: 500 }
    );
  }
}
