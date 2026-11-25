"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiArrowLeft,
  FiLogOut,
  FiFileText,
} from "react-icons/fi";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  coverImage?: string;
  author?: string;
}

export default function AdminBlogsListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs?published=false");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBlogs(json.data);
      } else {
        setFeedback({ type: "error", text: json.error || "Failed to load blogs." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while fetching blogs." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (slugOrId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(slugOrId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: "success", text: `Deleted "${title}".` });
        setBlogs((prev) => prev.filter((b) => b.slug !== slugOrId && b._id !== slugOrId));
      } else {
        if (res.status === 401) {
          router.push("/admin/login");
        } else {
          setFeedback({ type: "error", text: json.error || "Failed to delete post." });
        }
      }
    } catch {
      setFeedback({ type: "error", text: "Network error during deletion." });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.category && b.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F6F2EC] text-[#2A1810]">
      {/* Top Navbar */}
      <header className="bg-[#1C120C] text-[#F3EDE4] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xs text-[#F3EDE4]/60 hover:text-white flex items-center gap-1.5 transition-colors">
            <FiArrowLeft /> Back to Main Admin
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <FiFileText className="text-[#C8782A]" />
            <h1 className="font-display text-base text-white">Blog Manager</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="text-xs text-[#F3EDE4]/80 hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>Live Blog</span>
            <FiExternalLink className="text-[10px]" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* Main container */}
      <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6">
        {feedback && (
          <div
            className={`px-5 py-3 rounded-2xl text-xs font-medium flex items-center justify-between ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="hover:opacity-75">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl text-[#2A1810]">
              Articles & Architectural Insights
            </h2>
            <p className="text-xs text-[#4A2C1A]/70 mt-1">
              Create, curate, and optimize articles for luxury lighting solutions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBlogs}
              className="p-2.5 rounded-xl border border-[#2A1810]/15 bg-white text-[#2A1810] hover:bg-[#F6F2EC] text-xs flex items-center gap-1.5"
              title="Refresh"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              href="/admin/blogs/create"
              className="btn-3d btn-3d-amber px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <FiPlus className="text-sm" />
              <span>Create Article</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A2C1A]/40 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, slug..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-[#2A1810]/15 rounded-xl text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
          />
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-3xl border border-[#2A1810]/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 flex items-center justify-center">
              <FiRefreshCw className="animate-spin text-2xl text-[#C8782A]" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-16 text-center text-[#4A2C1A]/60 space-y-3">
              <FiFileText className="text-4xl mx-auto opacity-30 text-[#C8782A]" />
              <p className="text-sm font-medium">No blog posts found.</p>
              <Link
                href="/admin/blogs/create"
                className="inline-flex items-center gap-1.5 text-xs text-[#C8782A] font-semibold hover:underline"
              >
                <FiPlus /> Write your first post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2A1810]/10 bg-[#F6F2EC]/60 text-[#4A2C1A]/80 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-3.5 px-6">Post Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Published Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1810]/5">
                  {filteredBlogs.map((b) => (
                    <tr key={b._id} className="hover:bg-[#F6F2EC]/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#F6F2EC] overflow-hidden shrink-0 border border-[#2A1810]/10">
                            {b.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={b.coverImage}
                                alt={b.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#2A1810]/20">
                                <FiFileText className="text-lg" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#2A1810] truncate max-w-md">
                              {b.title}
                            </h3>
                            <span className="text-[11px] font-mono text-[#4A2C1A]/60 block truncate">
                              /blog-details/{b.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F6F2EC] border border-[#2A1810]/10 text-[11px] text-[#4A2C1A] font-medium">
                          {b.category || "General"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {b.isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FiCheckCircle className="text-xs" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <FiClock className="text-xs" /> Draft
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[#4A2C1A]/70 text-[11px]">
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }) : "—"}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.isPublished && (
                            <Link
                              href={`/blog-details/${b.slug}`}
                              target="_blank"
                              className="p-2 text-[#4A2C1A]/60 hover:text-[#2A1810] hover:bg-[#F6F2EC] rounded-lg transition-colors"
                              title="View Article"
                            >
                              <FiExternalLink className="text-sm" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/blogs/${b.slug}`}
                            className="p-2 text-[#C8782A] hover:bg-[#C8782A]/10 rounded-lg transition-colors"
                            title="Edit Article"
                          >
                            <FiEdit2 className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(b.slug, b.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Article"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
