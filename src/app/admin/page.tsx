"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiSearch,
  FiTrash2,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiMessageSquare,
  FiLayers,
  FiX,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";
import { Product, ProductCategory } from "@/data/products";

const CATEGORIES: { id: ProductCategory; name: string; icon: string; countHint: string }[] = [
  { id: "decorative", name: "Decorative", icon: "✨", countHint: "Chandeliers, Thali & Pendants" },
  { id: "outdoor-gate", name: "Outdoor & Gate", icon: "🏡", countHint: "Weather-Rated MS & Casting" },
  { id: "architectural-led", name: "Architectural LED", icon: "💡", countHint: "Commercial Panels & Spots" },
  { id: "led-fans", name: "LED Fans", icon: "🌀", countHint: "Integrated Ceiling Units" },
];

const PRESET_IMAGES = [
  { label: "Model 626/500 Crystal", url: "https://nivoseas.com/wp-content/uploads/2025/12/16-4.jpg" },
  { label: "Luxury Chandelier Lit", url: "/Minimalist Luxury Chandelier Interior.webp" },
  { label: "Modern 3-Light Fixture", url: "https://nivoseas.com/wp-content/uploads/2024/01/nivoseas-109-3.jpg" },
  { label: "Rose Gold Designer", url: "https://nivoseas.com/wp-content/uploads/2024/01/jl8558-rose-gold.jpg" },
  { label: "LED Gate Luminaire", url: "https://nivoseas.com/wp-content/uploads/2024/01/led-prince-gate.jpg" },
  { label: "Architectural LED Panel", url: "https://nivoseas.com/wp-content/uploads/2024/01/panasonic-led-panel.jpg" },
];

export default function AdminPage() {
  const [activeView, setActiveView] = useState<"overview" | "inventory" | "add" | "enquiry">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State for Add Luminaire
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("decorative");
  const [subcategory, setSubcategory] = useState("Thali");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [wattage, setWattage] = useState("Dual LED System (500mm)");
  const [colourTemp, setColourTemp] = useState("Multi-Tone Tunable");
  const [material, setMaterial] = useState("Gold-Finish Metal, Glass & Crystal");
  const [warranty, setWarranty] = useState("2 Years Authentic Warranty");
  const [usage, setUsage] = useState<"indoor" | "outdoor" | "both">("indoor");
  const [origin, setOrigin] = useState("India");
  const [moq, setMoq] = useState("1");
  const [imageUrl, setImageUrl] = useState("https://nivoseas.com/wp-content/uploads/2025/12/16-4.jpg");
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to connect to backend product store." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: "error", text: "Please provide a valid product name." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || undefined,
      tagline: tagline.trim() || undefined,
      description: description.trim() || undefined,
      wattage: wattage.trim() || undefined,
      colourTemp: colourTemp.trim() || undefined,
      material: material.trim() || undefined,
      warranty: warranty.trim() || undefined,
      usage,
      origin: origin.trim() || "India",
      moq: parseInt(moq, 10) || 1,
      images: [imageUrl.trim() || "/Minimalist Luxury Chandelier Interior.webp"],
      featured: true,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setFeedback({
          type: "success",
          text: `Luminaire "${result.data.name}" added successfully!`,
        });
        setName("");
        setTagline("");
        setDescription("");
        await fetchProducts();
        setActiveView("inventory");
      } else {
        setFeedback({ type: "error", text: result.error || "Failed to add fixture." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!window.confirm(`Permanently remove "${productName}" from the catalogue?`)) return;

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", text: `Deleted "${productName}".` });
        if (selectedProduct?.id === id) setSelectedProduct(null);
        await fetchProducts();
      } else {
        setFeedback({ type: "error", text: data.error || "Could not delete product." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const decorative = products.filter((p) => p.category === "decorative").length;
    const outdoor = products.filter((p) => p.category === "outdoor-gate").length;
    const architectural = products.filter((p) => p.category === "architectural-led").length;
    const fans = products.filter((p) => p.category === "led-fans").length;
    return { total, decorative, outdoor, architectural, fans };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#F6F2EC] text-[#2A1810] flex flex-col lg:flex-row antialiased">
      {/* ── Left Sidebar (Dark Architectural Theme) ── */}
      <aside className="w-full lg:w-72 bg-[#1C120C] text-[#F3EDE4] flex flex-col justify-between shrink-0 border-r border-[#2A1810]/30 shadow-2xl z-20">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-black.svg"
                alt="Nivoseas Logo"
                className="h-7 w-auto object-contain brightness-0 invert group-hover:opacity-85 transition-opacity"
              />
            </Link>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB45E] bg-[#FFB45E]/10 border border-[#FFB45E]/20 px-2 py-0.5 rounded">
              STUDIO
            </span>
          </div>

          <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[#E6DACB] font-medium">Noida Sector 104</span>
            </div>
            <span className="text-[#FFB45E] font-mono text-[11px]">{stats.total} SKUs</span>
          </div>

          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveView("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeView === "overview"
                  ? "bg-[#C8782A] text-white shadow-lg shadow-[#C8782A]/30 font-semibold"
                  : "text-[#E6DACB]/80 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FiGrid className="text-base" />
              <span>Studio Overview</span>
            </button>

            <button
              onClick={() => setActiveView("inventory")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeView === "inventory"
                  ? "bg-[#C8782A] text-white shadow-lg shadow-[#C8782A]/30 font-semibold"
                  : "text-[#E6DACB]/80 hover:bg-white/5 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <FiBox className="text-base" />
                <span>Catalogue Manager</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#FFB45E]">
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setActiveView("add")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeView === "add"
                  ? "bg-[#C8782A] text-white shadow-lg shadow-[#C8782A]/30 font-semibold"
                  : "text-[#E6DACB]/80 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FiPlusCircle className="text-base" />
              <span>Add New Luminaire</span>
            </button>

            <button
              onClick={() => setActiveView("enquiry")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeView === "enquiry"
                  ? "bg-[#C8782A] text-white shadow-lg shadow-[#C8782A]/30 font-semibold"
                  : "text-[#E6DACB]/80 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FiMessageSquare className="text-base" />
              <span>Concierge & Inquiries</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/products"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-[#E6DACB] bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FiExternalLink className="text-sm text-[#FFB45E]" />
              <span>View Live Catalogue</span>
            </div>
            <span className="text-[10px] text-white/50">↗</span>
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Back to Storefront</span>
            <span className="text-[10px]">←</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Dashboard ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-[#2A1810]/10 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[#4A2C1A]/60 font-semibold">
              Atelier Studio
            </span>
            <span className="text-xs text-[#4A2C1A]/30">/</span>
            <span className="text-xs font-medium text-[#2A1810] capitalize">
              {activeView}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="p-2 rounded-lg text-[#2A1810]/70 hover:text-[#2A1810] hover:bg-[#2A1810]/5 transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setActiveView("add")}
              className="btn-3d btn-3d-dark text-xs px-4 py-2 rounded-full flex items-center gap-2"
            >
              <FiPlusCircle className="text-sm" />
              <span>New Luminaire</span>
            </button>
          </div>
        </header>

        {feedback && (
          <div
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-medium ${feedback.type === "success"
                ? "bg-emerald-950 text-emerald-100 border border-emerald-500/40"
                : "bg-red-950 text-red-100 border border-red-500/40"
              }`}
          >
            {feedback.type === "success" ? (
              <FiCheckCircle className="text-emerald-400 text-base" />
            ) : (
              <FiAlertCircle className="text-red-400 text-base" />
            )}
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="ml-2">
              <FiX className="text-sm" />
            </button>
          </div>
        )}

        {/* View: Overview */}
        {activeView === "overview" && (
          <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
            <div className="rounded-3xl bg-[#2A1810] text-[#F3EDE4] p-8 lg:p-10 relative overflow-hidden shadow-xl border border-[#C8782A]/20">
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFB45E]">
                  Nivoseas Atelier Director
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-normal mt-2 text-white">
                  Luxury Luminaire & Project Portfolio
                </h1>
                <p className="text-sm text-[#E6DACB]/80 mt-2 leading-relaxed">
                  Real-time catalog control for residential and commercial lighting. Manage custom wattages, finishes, gate-light fixtures, and architectural LED specifications.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveView("add")}
                    className="btn-3d btn-3d-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2"
                  >
                    <FiPlusCircle className="text-sm" />
                    <span>Add New Luminaire</span>
                  </button>
                  <button
                    onClick={() => setActiveView("inventory")}
                    className="btn-3d btn-3d-outline text-xs font-semibold px-5 py-2.5 rounded-full text-white border-white/20 hover:border-white inline-flex items-center gap-2"
                  >
                    <FiBox className="text-sm" />
                    <span>Manage All Fixtures</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-[#2A1810]/10 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#4A2C1A]/70 mb-2">
                  <span>Total Catalogue</span>
                  <FiLayers className="text-base text-[#C8782A]" />
                </div>
                <div className="font-display text-3xl font-normal text-[#2A1810]">{stats.total}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-3">● Active in live store</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#2A1810]/10 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#4A2C1A]/70 mb-2">
                  <span>Decorative Range</span>
                  <span>✨</span>
                </div>
                <div className="font-display text-3xl font-normal text-[#2A1810]">{stats.decorative}</div>
                <div className="text-[11px] text-[#4A2C1A]/70 mt-3">Chandeliers, Thali & Pendants</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#2A1810]/10 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#4A2C1A]/70 mb-2">
                  <span>Outdoor & Gate</span>
                  <span>🏡</span>
                </div>
                <div className="font-display text-3xl font-normal text-[#2A1810]">{stats.outdoor}</div>
                <div className="text-[11px] text-[#4A2C1A]/70 mt-3">Weather-sealed gate fixtures</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#2A1810]/10 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#4A2C1A]/70 mb-2">
                  <span>Architectural LED & Fans</span>
                  <span>💡</span>
                </div>
                <div className="font-display text-3xl font-normal text-[#2A1810]">{stats.architectural + stats.fans}</div>
                <div className="text-[11px] text-[#4A2C1A]/70 mt-3">Panasonic & GM panels</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#2A1810]/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl text-[#2A1810]">Recently Updated Luminaires</h3>
                  <p className="text-xs text-[#4A2C1A]/70 mt-0.5">Live products with WhatsApp inquiry integration.</p>
                </div>
                <button
                  onClick={() => setActiveView("inventory")}
                  className="text-xs font-semibold text-[#C8782A] hover:underline inline-flex items-center gap-1"
                >
                  <span>See all {stats.total} SKUs</span>
                  <FiArrowRight className="text-xs" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl border border-[#2A1810]/8 hover:border-[#C8782A] transition-all bg-[#F6F2EC]/30 flex flex-col justify-between group">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white mb-3 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0] || "/Minimalist Luxury Chandelier Interior.webp"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C8782A]">{p.subcategory || p.category}</span>
                      <h4 className="font-display text-sm font-semibold text-[#2A1810] line-clamp-1 mt-0.5">{p.name}</h4>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#2A1810]/5 flex items-center justify-between text-xs">
                      <Link href={`/products/${p.slug}`} target="_blank" className="text-[#4A2C1A] hover:text-[#C8782A]">Inspect Page ↗</Link>
                      <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View: Inventory */}
        {activeView === "inventory" && (
          <div className="p-6 lg:p-10 space-y-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">Catalogue Inventory</h1>
                <p className="text-xs text-[#4A2C1A]/70 mt-0.5">Manage active fixtures and technical specifications.</p>
              </div>
              <button onClick={() => setActiveView("add")} className="btn-3d btn-3d-dark text-xs px-4 py-2.5 rounded-full flex items-center gap-2">
                <FiPlusCircle className="text-sm" />
                <span>Add Luminaire</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#2A1810]/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A1810]/40 text-sm" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fixtures by name, wattage, or material..."
                  className="w-full pl-9 pr-4 py-2 bg-[#F6F2EC]/60 border border-[#2A1810]/10 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${categoryFilter === "all" ? "bg-[#2A1810] text-[#F3EDE4] font-medium" : "bg-[#2A1810]/5 text-[#4A2C1A]"}`}
                >
                  All ({products.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${categoryFilter === cat.id ? "bg-[#2A1810] text-[#F3EDE4] font-medium" : "bg-[#2A1810]/5 text-[#4A2C1A]"}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#2A1810]/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#2A1810]/5 border-b border-[#2A1810]/10 text-[#4A2C1A]/80 uppercase tracking-wider text-[10px] font-semibold">
                      <th className="py-3.5 px-5">Fixture</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Specifications</th>
                      <th className="py-3.5 px-4">Environment</th>
                      <th className="py-3.5 px-4">Warranty</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A1810]/5">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F6F2EC]/40 transition-colors group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2A1810]/5 shrink-0 border border-[#2A1810]/8">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.images[0] || "/Minimalist Luxury Chandelier Interior.webp"} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#2A1810] group-hover:text-[#C8782A] line-clamp-1">{p.name}</div>
                              <div className="text-[10px] text-[#4A2C1A]/60 font-mono">ID: {p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#2A1810]/5 text-[#2A1810] font-medium text-[11px] capitalize">
                            {p.subcategory || p.category.replace("-", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-[#C8782A] font-bold text-[11px]">{p.wattage}</div>
                          <div className="text-[#4A2C1A]/70 text-[11px] line-clamp-1">{p.material}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                            {p.usage || "Indoor"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#4A2C1A]/80 font-medium text-[11px]">{p.warranty || "2 Years"}</td>
                        <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/products/${p.slug}`} target="_blank" className="p-1.5 rounded-lg text-[#4A2C1A]/70 hover:text-[#2A1810]">
                              <FiExternalLink className="text-sm" />
                            </Link>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-1.5 rounded-lg text-red-500 hover:text-red-700">
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View: Add Luminaire */}
        {activeView === "add" && (
          <div className="p-6 lg:p-10 space-y-6 max-w-7xl">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">Add New Luminaire</h1>
              <p className="text-xs text-[#4A2C1A]/70 mt-0.5">Create a new fixture specification that appears live across the catalogue.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form onSubmit={handleAddProduct} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#2A1810]/10 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#C8782A] mb-4">1. Identity & Classification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Luminaire Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Luxury LED Ceiling Light – Crystal & Gold Finish (Model 626/500)"
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ProductCategory)}
                          className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Subcategory / Format</label>
                        <input
                          type="text"
                          value={subcategory}
                          onChange={(e) => setSubcategory(e.target.value)}
                          placeholder="e.g. Thali, Chandelier, Wall Light"
                          className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Architectural Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Patterned glass diffuser with sparkling crystal accents and dual-tone LED glow."
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Full Product Description</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enhance your interiors with this elegant designer LED ceiling light..."
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A1810]/8">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#C8782A] mb-4">2. Technical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Power / Dimensions</label>
                      <input
                        type="text"
                        value={wattage}
                        onChange={(e) => setWattage(e.target.value)}
                        placeholder="e.g. Dual LED System (500mm / 20 Inch)"
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Material & Diffuser</label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="e.g. Gold-Finish Metal, Glass & Crystal"
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Warranty</label>
                      <input
                        type="text"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Environment</label>
                      <select
                        value={usage}
                        onChange={(e) => setUsage(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                      >
                        <option value="indoor">Indoor Living</option>
                        <option value="outdoor">Outdoor Weather-Rated</option>
                        <option value="both">Indoor/Outdoor</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A1810]/8">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#C8782A] mb-4">3. High-Resolution Photography</h3>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL"
                    className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border bg-white text-[#4A2C1A] border-[#2A1810]/10 hover:border-[#C8782A]"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#2A1810]/8 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-3d btn-3d-dark text-xs px-7 py-3 rounded-full flex items-center gap-2 font-medium"
                  >
                    <FiPlusCircle className="text-sm" />
                    <span>{submitting ? "Publishing..." : "Publish Luminaire"}</span>
                  </button>
                </div>
              </form>

              <div className="lg:col-span-5 sticky top-24">
                <div className="bg-white rounded-3xl p-6 border border-[#2A1810]/10 shadow-lg">
                  <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#C8782A] mb-3 block">Live Card Preview</span>
                  <div className="rounded-2xl border border-[#2A1810]/15 overflow-hidden bg-white shadow-md">
                    <div className="aspect-[4/3] bg-[#F6F2EC] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl || "/Minimalist Luxury Chandelier Interior.webp"} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-[#C8782A] font-semibold">{category}</div>
                      <h4 className="font-display text-base font-semibold text-[#2A1810] line-clamp-2">{name || "Untitled Luminaire Design"}</h4>
                      {tagline && <p className="text-xs text-[#4A2C1A]/70 italic line-clamp-1">&ldquo;{tagline}&rdquo;</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View: Enquiry */}
        {activeView === "enquiry" && (
          <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
            <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">Concierge & Inquiries</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#2A1810]/10 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                  <FiMessageSquare />
                </div>
                <h3 className="font-display text-lg text-[#2A1810]">WhatsApp Sales Line</h3>
                <p className="text-xs text-[#4A2C1A]/70 leading-relaxed">+91 99901 79666</p>
                <a href="https://wa.me/919990179666" target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-dark text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-2">
                  <span>Open WhatsApp Console</span>
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#2A1810]/10 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
                  <FiPhone />
                </div>
                <h3 className="font-display text-lg text-[#2A1810]">Sector 104 Experience Center</h3>
                <p className="text-xs text-[#4A2C1A]/70 leading-relaxed">Khasra No 514, Sector 104, Noida, Uttar Pradesh.</p>
                <a href="mailto:nivoseasLLP@gmail.com" className="btn-3d btn-3d-outline text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-2">
                  <span>Compose Direct Mail</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 border-l border-[#2A1810]/10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#2A1810]/10 mb-6">
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#C8782A]">Fixture Inspection</span>
                <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg text-[#2A1810]/60 hover:text-[#2A1810]">
                  <FiX className="text-lg" />
                </button>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F6F2EC] mb-5 border border-[#2A1810]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedProduct.images[0] || "/Minimalist Luxury Chandelier Interior.webp"} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 text-xs">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C8782A]">{selectedProduct.category}</span>
                <h3 className="font-display text-xl font-semibold text-[#2A1810]">{selectedProduct.name}</h3>
                {selectedProduct.tagline && <p className="text-xs text-[#4A2C1A]/70 italic">&ldquo;{selectedProduct.tagline}&rdquo;</p>}
              </div>
            </div>
            <div className="pt-6 border-t border-[#2A1810]/10 flex items-center gap-3">
              <Link href={`/products/${selectedProduct.slug}`} target="_blank" className="btn-3d btn-3d-dark flex-1 py-2.5 text-center text-xs rounded-xl">
                View Public Page ↗
              </Link>
              <button onClick={() => handleDeleteProduct(selectedProduct.id, selectedProduct.name)} className="btn-3d btn-3d-outline text-red-600 border-red-200 py-2.5 px-4 text-xs rounded-xl">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
