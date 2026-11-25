import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const metadata: Metadata = {
  title: "Lighting Design Journal & Insights | Nivoseas Lighting LLP",
  description:
    "Explore expert architectural lighting guides, luxury chandelier selection tips, gate lighting ideas, and illumination craftsmanship from Nivoseas Lighting, Sector 104 Noida.",
  openGraph: {
    title: "Lighting Design Journal | Nivoseas Lighting LLP",
    description:
      "Expert architectural illumination and bespoke chandelier guides for modern Indian homes and commercial spaces.",
    url: "https://nivoseas.com/blog",
    siteName: "Nivoseas Lighting LLP",
  },
};

interface BlogListPageProps {
  searchParams: Promise<{ tag?: string }>;
}

async function BlogListContent({ searchParams }: BlogListPageProps) {
  await connection();
  await connectDB();
  const { tag } = await searchParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { isPublished: true };
  if (tag && tag.trim()) {
    filter.tags = tag.trim();
  }

  const blogs = await Blog.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  // Extract all unique tags across published blogs for the filter bar
  const allPublished = await Blog.find({ isPublished: true }).select("tags").lean();
  const allTags = Array.from(
    new Set(allPublished.flatMap((b) => b.tags || []).filter(Boolean))
  );

  return (
    <>
      {/* ── Header ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-12 border-b border-[#2A1810]/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/70 mb-4">
          <Link href="/" className="hover:text-[#2A1810] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C8782A] font-medium">Journal &amp; Insights</span>
        </div>

        <div className="max-w-3xl">
          <p className="text-[13px] uppercase tracking-[0.14em] text-[#C8782A] font-medium mb-3">
            Atelier Lighting Journal
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.025em] text-[#2A1810] leading-[1.08]">
            Architectural Insights &amp; Design Standards
          </h1>
          <p className="text-sm sm:text-base text-[#4A2C1A]/75 mt-4 leading-relaxed max-w-2xl">
            Curated guides, crystal chandelier design considerations, gate luminaire weather engineering, and illumination principles from our Sector 104 Noida experience center.
          </p>
        </div>

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[#2A1810]/8">
            <Link
              href="/blog"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                !tag
                  ? "bg-[#2A1810] text-[#F3EDE4]"
                  : "bg-white/60 text-[#4A2C1A] hover:bg-white border border-[#2A1810]/10"
              }`}
            >
              All Articles
            </Link>
            {allTags.map((t) => {
              const active = tag === t;
              return (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-[#C8782A] text-white"
                      : "bg-white/60 text-[#4A2C1A] hover:bg-white border border-[#2A1810]/10"
                  }`}
                >
                  #{t}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Blog Grid ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        {blogs.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white/40 rounded-3xl border border-[#2A1810]/10 p-10">
            <h3 className="font-display text-xl text-[#2A1810]">
              No articles published yet.
            </h3>
            <p className="text-xs text-[#4A2C1A]/60 max-w-md mx-auto">
              Our architectural design team is currently preparing in-depth guides for luxury duplexes and commercial installations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const dateStr = blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

              return (
                <article
                  key={blog._id.toString()}
                  className="group flex flex-col bg-white rounded-3xl border border-[#2A1810]/10 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#2A1810]/5 transition-all duration-300"
                >
                  {/* Cover photo */}
                  <Link
                    href={`/blog-details/${blog.slug}`}
                    className="relative aspect-[16/10] bg-[#EDE5DA] overflow-hidden block"
                  >
                    {blog.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.coverImage}
                        alt={blog.coverImageAlt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#2A1810]/20 font-display text-4xl">
                        N
                      </div>
                    )}

                    {blog.category && (
                      <span className="absolute top-4 left-4 text-[10px] uppercase font-mono tracking-wider font-semibold bg-[#2A1810]/80 text-[#F3EDE4] px-3 py-1 rounded-full backdrop-blur-xs">
                        {blog.category}
                      </span>
                    )}
                  </Link>

                  {/* Body card */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#C8782A] mb-2 font-semibold">
                        {dateStr} {blog.author ? `• ${blog.author}` : ""}
                      </div>

                      <h2 className="font-display text-xl text-[#2A1810] group-hover:text-[#C8782A] transition-colors leading-[1.2] mb-2.5">
                        <Link href={`/blog-details/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      {blog.excerpt && (
                        <p className="text-xs text-[#6b5f55] leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#2A1810]/8 flex items-center justify-between">
                      <Link
                        href={`/blog-details/${blog.slug}`}
                        className="text-xs font-semibold text-[#2A1810] group-hover:text-[#C8782A] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Read Article</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>

                      {blog.tags && blog.tags.length > 0 && (
                        <span className="text-[10px] text-[#4A2C1A]/50 font-mono">
                          #{blog.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-20 animate-pulse space-y-8">
      <div className="h-4 w-36 bg-[#2A1810]/10 rounded-full" />
      <div className="h-12 w-3/4 max-w-xl bg-[#2A1810]/10 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-white/70 rounded-3xl border border-[#2A1810]/10" />
        ))}
      </div>
    </div>
  );
}

export default function BlogListPage({ searchParams }: BlogListPageProps) {
  return (
    <div className="bg-[#F3EDE4] text-[#2A1810] pt-28 pb-20 selection:bg-[#C8782A] selection:text-white">
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
