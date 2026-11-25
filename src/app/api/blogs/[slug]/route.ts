import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authenticateAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

function buildIdentifierQuery(slugOrId: string) {
  if (mongoose.isValidObjectId(slugOrId)) {
    return { _id: new mongoose.Types.ObjectId(slugOrId) };
  }
  return { slug: slugOrId };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const rl = checkRateLimit(req, { limit: 120, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    await connectDB();
    const { slug } = await context.params;
    const blog = await Blog.findOne(buildIdentifierQuery(slug)).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error("[GET /api/blogs/[slug]]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const rl = checkRateLimit(req, { limit: 40, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  const auth = await authenticateAdmin(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    await connectDB();
    const { slug } = await context.params;
    const body = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};

    if (typeof body.title === "string") updates.title = body.title.trim();
    if (typeof body.slug === "string" && body.slug.trim()) {
      updates.slug = slugify(body.slug.trim(), { lower: true, strict: true });
    }
    if (typeof body.category === "string") updates.category = body.category.trim();
    if (typeof body.content === "string") updates.content = body.content;
    if (typeof body.excerpt === "string") updates.excerpt = body.excerpt.trim();
    if (typeof body.author === "string") updates.author = body.author.trim();
    if (body.publishedAt !== undefined) {
      updates.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }
    if (typeof body.metaTitle === "string") updates.metaTitle = body.metaTitle.trim();
    if (typeof body.metaDescription === "string") {
      updates.metaDescription = body.metaDescription.trim();
    }
    // Only update coverImage when explicitly sent
    if (typeof body.coverImage === "string" && body.coverImage.trim()) {
      updates.coverImage = body.coverImage.trim();
    }
    if (typeof body.coverImageAlt === "string") {
      updates.coverImageAlt = body.coverImageAlt.trim();
    }
    if (Array.isArray(body.tags)) {
      updates.tags = body.tags.map((t: unknown) => String(t).trim()).filter(Boolean);
    }
    if (Array.isArray(body.faqs)) {
      updates.faqs = body.faqs.filter(
        (f: { question?: string; answer?: string }) =>
          f?.question?.trim() && f?.answer?.trim()
      );
    }
    if (typeof body.isPublished === "boolean") {
      updates.isPublished = body.isPublished;
      if (body.isPublished && !updates.publishedAt && !body.publishedAt) {
        const existing = await Blog.findOne(buildIdentifierQuery(slug)).select("publishedAt").lean();
        if (existing && !existing.publishedAt) {
          updates.publishedAt = new Date();
        }
      }
    }

    const updated = await Blog.findOneAndUpdate(
      buildIdentifierQuery(slug),
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    revalidateTag("blogs", "max");
    revalidatePath("/blog");
    revalidatePath(`/blog-details/${updated.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error("[PUT /api/blogs/[slug]]", err);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any)?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A blog post with this URL slug already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update blog post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const rl = checkRateLimit(req, { limit: 20, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  const auth = await authenticateAdmin(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    await connectDB();
    const { slug } = await context.params;
    const deleted = await Blog.findOneAndDelete(buildIdentifierQuery(slug)).lean();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    revalidateTag("blogs", "max");
    revalidatePath("/blog");
    revalidatePath(`/blog-details/${deleted.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Blog post deleted." });
  } catch (err) {
    console.error("[DELETE /api/blogs/[slug]]", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post." },
      { status: 500 }
    );
  }
}
