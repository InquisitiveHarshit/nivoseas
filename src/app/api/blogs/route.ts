import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authenticateAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
}

export async function GET(req: NextRequest) {
  const rl = checkRateLimit(req, { limit: 120, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const publishedParam = searchParams.get("published");
    const tag = searchParams.get("tag");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (publishedParam !== "false") {
      filter.isPublished = true;
    }
    if (tag && tag.trim()) {
      filter.tags = tag.trim();
    }

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: blogs });
  } catch (err) {
    console.error("[GET /api/blogs]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, { limit: 30, windowMs: 60 * 1000 });
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
    const body = await req.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content : "";

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    if (!stripHtml(content)) {
      return NextResponse.json(
        { success: false, error: "Content cannot be empty." },
        { status: 400 }
      );
    }

    const rawSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug.trim(), { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });

    const isPublished = Boolean(body.isPublished);
    const publishedAt = body.publishedAt
      ? new Date(body.publishedAt)
      : isPublished
      ? new Date()
      : undefined;

    const created = await Blog.create({
      title,
      slug: rawSlug,
      category: typeof body.category === "string" ? body.category.trim() : "",
      content,
      excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() : "",
      author: typeof body.author === "string" ? body.author.trim() : "",
      publishedAt,
      metaTitle: typeof body.metaTitle === "string" ? body.metaTitle.trim() : "",
      metaDescription:
        typeof body.metaDescription === "string" ? body.metaDescription.trim() : "",
      coverImage: typeof body.coverImage === "string" ? body.coverImage.trim() : "",
      coverImageAlt:
        typeof body.coverImageAlt === "string" ? body.coverImageAlt.trim() : "",
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : [],
      faqs: Array.isArray(body.faqs)
        ? body.faqs.filter(
            (f: { question?: string; answer?: string }) =>
              f?.question?.trim() && f?.answer?.trim()
          )
        : [],
      isPublished,
    });

    revalidateTag("blogs", "max");
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/blogs]", err);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any)?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A blog post with this URL slug already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create blog post." },
      { status: 500 }
    );
  }
}
