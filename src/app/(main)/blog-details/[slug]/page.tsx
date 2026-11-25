import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isPublished: true }).select("slug").lean();
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  await connection();
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, isPublished: true }).lean();

  if (!blog) {
    return {
      title: "Article Not Found | Nivoseas Lighting LLP",
    };
  }

  const title = blog.metaTitle || `${blog.title} | Nivoseas Lighting`;
  const description =
    blog.metaDescription ||
    blog.excerpt ||
    "Read architectural lighting recommendations from Nivoseas Lighting LLP.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

async function BlogDetailContent({ params }: BlogDetailPageProps) {
  await connection();
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, isPublished: true }).lean();

  if (!blog) {
    notFound();
  }

  // Fetch recent posts for sidebar
  const recentBlogs = await Blog.find({ isPublished: true, slug: { $ne: slug } })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(4)
    .lean();

  const publishDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(blog.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  // Schema.org FAQPage JSON-LD
  const hasFaqs = Array.isArray(blog.faqs) && blog.faqs.length > 0;
  const faqJsonLd = hasFaqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blog.faqs?.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      }
    : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── Breadcrumb & Article Header ── */}
      <header className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-12 border-b border-[#2A1810]/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/70 mb-6">
          <Link href="/" className="hover:text-[#2A1810] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#2A1810] transition-colors">
            Journal
          </Link>
          <span>/</span>
          <span className="text-[#C8782A] font-medium truncate max-w-xs">
            {blog.title}
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          {blog.category && (
            <span className="inline-block text-xs uppercase font-mono tracking-widest font-semibold text-[#C8782A] bg-[#C8782A]/10 px-3.5 py-1.5 rounded-full border border-[#C8782A]/20">
              {blog.category}
            </span>
          )}

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.025em] text-[#2A1810] leading-[1.08]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#4A2C1A]/70 pt-2">
            <span>Published: {publishDate}</span>
            {blog.author && (
              <>
                <span>&bull;</span>
                <span>By {blog.author}</span>
              </>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <>
                <span>&bull;</span>
                <div className="flex items-center gap-2">
                  {blog.tags.map((t) => (
                    <span key={t} className="text-[#C8782A]">#{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Article Body + Sidebar ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <main className="lg:col-span-8 space-y-10">
            {/* Cover photo */}
            {blog.coverImage && (
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg border border-[#2A1810]/10 bg-[#EDE5DA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.coverImage}
                  alt={blog.coverImageAlt || blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt Lead */}
            {blog.excerpt && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-l-4 border-[#C8782A] shadow-xs text-sm sm:text-base text-[#2A1810] leading-relaxed italic">
                &ldquo;{blog.excerpt}&rdquo;
              </div>
            )}

            {/* Tiptap Article Content */}
            <article
              className="prose prose-lg max-w-none text-[#2A1810] leading-relaxed
                [&_h2]:font-display [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:text-[#2A1810] [&_h2]:mt-10 [&_h2]:mb-4
                [&_h3]:font-display [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:text-[#2A1810] [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:text-sm sm:[&_p]:text-base [&_p]:text-[#4A2C1A]/90 [&_p]:leading-relaxed [&_p]:mb-5
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:text-sm sm:[&_ul_li]:text-base [&_ul_li]:text-[#4A2C1A]/90 [&_ul_li]:mb-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:text-sm sm:[&_ol_li]:text-base [&_ol_li]:text-[#4A2C1A]/90 [&_ol_li]:mb-2
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:text-xs sm:[&_table]:text-sm
                [&_th]:border [&_th]:border-[#2A1810]/20 [&_th]:bg-white [&_th]:p-3 [&_th]:text-[#2A1810] [&_th]:font-semibold [&_th]:text-left
                [&_td]:border [&_td]:border-[#2A1810]/15 [&_td]:bg-white/60 [&_td]:p-3 [&_td]:text-[#4A2C1A]
                [&_img]:rounded-2xl [&_img]:my-8 [&_img]:border [&_img]:border-[#2A1810]/10 [&_img]:shadow-md [&_img]:w-full"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Structured FAQs Accordion */}
            {hasFaqs && (
              <div className="pt-8 border-t border-[#2A1810]/10 space-y-6">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#C8782A] font-semibold">
                    Frequently Asked Questions
                  </span>
                  <h3 className="font-display text-2xl text-[#2A1810] mt-1">
                    Questions &amp; Technical Insights
                  </h3>
                </div>

                <div className="space-y-4">
                  {blog.faqs?.map((faq, i) => (
                    <details
                      key={i}
                      className="group bg-white rounded-2xl border border-[#2A1810]/10 p-5 open:shadow-xs transition-all"
                    >
                      <summary className="font-semibold text-sm sm:text-base text-[#2A1810] cursor-pointer flex items-center justify-between list-none">
                        <span>{faq.question}</span>
                        <span className="transition-transform group-open:rotate-180 text-[#C8782A]">
                          ▾
                        </span>
                      </summary>
                      <p className="text-xs sm:text-sm text-[#4A2C1A]/80 leading-relaxed mt-3 pt-3 border-t border-[#2A1810]/5">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Experience Center Callout Card */}
            <div className="p-7 rounded-3xl bg-[#2A1810] text-[#F3EDE4] shadow-xl space-y-4">
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#D9B46C]">
                Sector 104 &bull; Experience Center
              </span>
              <h4 className="font-display text-xl text-white">
                Inspect Real Crystal Luminaires in Person
              </h4>
              <p className="text-xs text-[#F3EDE4]/70 leading-relaxed">
                Experience crystal dispersion, inspect brass finishes, and test tunable LED drivers at our Noida lighting atelier.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20read%20your%20article%20and%20would%20like%20to%20consult%20on%20lighting."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-amber w-full py-3 text-center rounded-xl text-xs font-semibold block"
                >
                  WhatsApp Studio Consultation
                </a>
              </div>
            </div>

            {/* Recent Articles */}
            {recentBlogs.length > 0 && (
              <div className="p-7 rounded-3xl bg-white border border-[#2A1810]/10 shadow-xs space-y-5">
                <h4 className="font-display text-lg text-[#2A1810]">
                  More from our Journal
                </h4>

                <div className="space-y-4">
                  {recentBlogs.map((item) => (
                    <Link
                      key={item._id.toString()}
                      href={`/blog-details/${item.slug}`}
                      className="group flex gap-3.5 items-center"
                    >
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-[#EDE5DA] shrink-0 border border-[#2A1810]/10">
                        {item.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#2A1810]/20 text-xs font-display">
                            N
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-medium text-xs text-[#2A1810] group-hover:text-[#C8782A] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h5>
                        <span className="text-[10px] font-mono text-[#4A2C1A]/50 mt-1 block">
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

function BlogDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-20 animate-pulse space-y-8">
      <div className="h-4 w-36 bg-[#2A1810]/10 rounded-full" />
      <div className="h-12 w-3/4 max-w-2xl bg-[#2A1810]/10 rounded-2xl" />
      <div className="aspect-[16/9] w-full max-w-4xl bg-white/70 rounded-3xl border border-[#2A1810]/10" />
    </div>
  );
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <div className="bg-[#F3EDE4] text-[#2A1810] pt-28 pb-20 selection:bg-[#C8782A] selection:text-white">
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailContent params={params} />
      </Suspense>
    </div>
  );
}
