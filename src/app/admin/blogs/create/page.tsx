"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import slugify from "slugify";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiImage,
  FiAlertCircle,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";
import GalleryPickerModal from "@/components/admin/GalleryPickerModal";
import FaqEditor from "@/components/admin/FaqEditor";
import type { IFaqItem } from "@/models/Blog";

const TiptapEditor = dynamic(
  () => import("@/components/admin/TiptapEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[360px] rounded-2xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 p-5 text-xs text-[#4A2C1A]/60 flex items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
}

export default function CreateBlogPage() {
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState("Architectural Lighting");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // Cover Image
  const [coverSource, setCoverSource] = useState<"upload" | "gallery">("upload");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [blackAndWhite, setBlackAndWhite] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // SEO & Extras
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [faqs, setFaqs] = useState<IFaqItem[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  // State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val, { lower: true, strict: true }));
    }
  };

  const handleFileSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Article title is required.");
      return;
    }

    if (!stripHtml(content)) {
      setError("Article content cannot be empty.");
      return;
    }

    setSubmitting(true);

    try {
      let finalCoverUrl = "";

      // 1. Upload Cover Image if source is "upload" and file exists
      if (coverSource === "upload" && coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        if (slug.trim()) fd.append("slug", slug.trim());

        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        const upJson = await upRes.json();

        if (!upJson.success || !upJson.url) {
          setError(upJson.error || "Failed to upload cover image.");
          setSubmitting(false);
          return;
        }

        finalCoverUrl = upJson.url;
        if (blackAndWhite) {
          // Cloudinary grayscale transform
          finalCoverUrl = finalCoverUrl.replace("/upload/", "/upload/e_grayscale/");
        }
      } else if (coverSource === "gallery" && coverPreview) {
        finalCoverUrl = coverPreview;
      }

      // 2. Post Blog
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        category: category.trim(),
        content,
        excerpt: excerpt.trim(),
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        coverImage: finalCoverUrl || undefined,
        coverImageAlt: coverImageAlt.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        faqs,
        isPublished,
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        router.push("/admin/blogs");
        router.refresh();
      } else {
        if (res.status === 401) {
          router.push("/admin/login");
        } else {
          setError(json.error || "Failed to save article.");
        }
      }
    } catch {
      setError("Network error while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F2EC] text-[#2A1810]">
      {/* Top Header */}
      <header className="bg-[#1C120C] text-[#F3EDE4] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blogs"
            className="text-xs text-[#F3EDE4]/60 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <FiArrowLeft /> Back to Blogs
          </Link>
          <span className="text-white/20">|</span>
          <h1 className="font-display text-base text-white">Create New Article</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-3d btn-3d-amber px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FiRefreshCw className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiCheck />
                <span>{isPublished ? "Publish Post" : "Save as Draft"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 sm:p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
            <FiAlertCircle className="shrink-0 text-base" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Main Title & Slug */}
          <div className="bg-white rounded-3xl border border-[#2A1810]/10 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A2C1A]/80 mb-2">
                Article Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Master Guide to Crystal Chandelier Lighting for Double-Height Living Foyers"
                className="w-full text-lg sm:text-xl font-display px-4 py-3 bg-[#F6F2EC]/50 border border-[#2A1810]/15 rounded-2xl text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                  URL Slug
                </label>
                <div className="flex items-center rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 overflow-hidden text-xs">
                  <span className="px-3 text-[#4A2C1A]/50 bg-[#2A1810]/5 py-2.5 font-mono">
                    /blog-details/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsSlugManuallyEdited(true);
                    }}
                    placeholder="auto-generated-slug"
                    className="flex-1 py-2.5 px-3 bg-transparent text-[#2A1810] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Luxury Chandeliers, Outdoor Lighting, Architectural LED"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise summary of the article displayed on blog listing cards."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
            </div>
          </div>

          {/* Section 2: Cover Image */}
          <div className="bg-white rounded-3xl border border-[#2A1810]/10 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#2A1810]">Cover Image</h3>
                <p className="text-xs text-[#4A2C1A]/65">
                  High-resolution photo used for hero header and social cards.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#F6F2EC] p-1 rounded-xl border border-[#2A1810]/10 text-xs">
                <button
                  type="button"
                  onClick={() => setCoverSource("upload")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${coverSource === "upload"
                      ? "bg-[#C8782A] text-white shadow-xs"
                      : "text-[#4A2C1A] hover:bg-white/60"
                    }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCoverSource("gallery");
                    setIsGalleryOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${coverSource === "gallery"
                      ? "bg-[#C8782A] text-white shadow-xs"
                      : "text-[#4A2C1A] hover:bg-white/60"
                    }`}
                >
                  Pick from Gallery
                </button>
              </div>
            </div>

            {coverSource === "upload" ? (
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#2A1810]/20 hover:border-[#C8782A] rounded-2xl bg-[#F6F2EC]/30 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  <FiUploadCloud className="text-3xl text-[#C8782A] mb-2" />
                  <span className="text-xs font-semibold text-[#2A1810]">
                    {coverFile ? coverFile.name : "Click to upload cover image"}
                  </span>
                  <span className="text-[11px] text-[#4A2C1A]/50 mt-1">
                    JPEG, PNG, WebP, AVIF up to 5 MB
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bw-toggle"
                    checked={blackAndWhite}
                    onChange={(e) => setBlackAndWhite(e.target.checked)}
                    className="accent-[#C8782A]"
                  />
                  <label htmlFor="bw-toggle" className="text-xs text-[#2A1810]">
                    Convert to Black &amp; White (via Cloudinary grayscale transform)
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="btn-3d btn-3d-outline text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <FiImage />
                  <span>Open Image Gallery</span>
                </button>
              </div>
            )}

            {coverPreview && (
              <div className="relative aspect-[16/9] max-w-lg rounded-2xl overflow-hidden border border-[#2A1810]/15 bg-[#F6F2EC]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className={`w-full h-full object-cover ${blackAndWhite ? "grayscale" : ""}`}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                Cover Image Alt Text (SEO &amp; Accessibility)
              </label>
              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="e.g. Modern duplex hall with luxury rose gold chandelier glowing at dusk"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
            </div>
          </div>

          {/* Section 3: Tiptap Rich Text Content */}
          <div className="bg-white rounded-3xl border border-[#2A1810]/10 p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#2A1810]">
                Article Body Content <span className="text-red-600">*</span>
              </h3>
              <p className="text-xs text-[#4A2C1A]/65">
                Format headings, lists, tables, and insert inline architectural photography.
              </p>
            </div>

            <TiptapEditor value={content} onChange={setContent} />
          </div>

          {/* Section 4: SEO Metadata */}
          <div className="bg-white rounded-3xl border border-[#2A1810]/10 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#2A1810]">Search Engine Optimization (SEO)</h3>
              <p className="text-xs text-[#4A2C1A]/65">
                Fine-tune search snippets and Google result rankings.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#2A1810]">
                  Meta Title
                </label>
                <span
                  className={`text-[10px] font-mono ${metaTitle.length > 60 ? "text-red-600 font-bold" : "text-[#4A2C1A]/50"
                    }`}
                >
                  {metaTitle.length} / 60
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Target keyword title for search engines"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#2A1810]">
                  Meta Description
                </label>
                <span
                  className={`text-[10px] font-mono ${metaDescription.length > 160 ? "text-red-600 font-bold" : "text-[#4A2C1A]/50"
                    }`}
                >
                  {metaDescription.length} / 160
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="High-converting search snippet summarizing the value proposition."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Chandeliers, Noida, Duplex Design, LED Fixtures"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
            </div>
          </div>

          {/* Section 5: FAQs */}
          <div className="bg-white rounded-3xl border border-[#2A1810]/10 p-6 sm:p-8 shadow-sm">
            <FaqEditor faqs={faqs} onChange={setFaqs} />
          </div>

          {/* Section 6: Publishing Control */}
          <div className="bg-white rounded-3xl border border-[#2A1810]/10 p-6 sm:p-8 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#2A1810]">Publishing Control</h3>
              <p className="text-xs text-[#4A2C1A]/65">
                Toggle to make this article immediately visible on the public blog.
              </p>
            </div>

            <label className="relative inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8782A]"></div>
              <span className="text-xs font-semibold text-[#2A1810]">
                {isPublished ? "Published" : "Draft"}
              </span>
            </label>
          </div>
        </form>
      </main>

      {/* Gallery Picker Modal */}
      <GalleryPickerModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(url, alt) => {
          setCoverPreview(url);
          if (alt && !coverImageAlt) setCoverImageAlt(alt);
        }}
      />
    </div>
  );
}
