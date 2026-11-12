"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { cldPresets } from "@/lib/cloudinary";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.478 2 2 6.478 2 12.004a9.994 9.994 0 0 0 1.388 5.139L2 22l4.978-1.368A10.003 10.003 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.188a8.183 8.183 0 0 1-4.17-1.141l-.299-.178-3.095.851.822-3.012-.195-.308A8.19 8.19 0 0 1 3.822 12 8.188 8.188 0 0 1 12.004 3.81c4.509 0 8.182 3.673 8.182 8.19 0 4.515-3.673 8.188-8.182 8.188z" />
    </svg>
  );
}

interface ProductListingClientProps {
  initialProducts: Product[];
}

export default function ProductListingClient({ initialProducts }: ProductListingClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [usageFilter, setUsageFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "name-asc" | "category">("featured");

  // Get active category object
  const currentCategoryObj = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategory),
    [activeCategory]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (activeCategory !== "all" && p.category !== activeCategory) {
          return false;
        }

        // Subcategory filter
        if (activeSubcategory !== "all" && p.subcategory !== activeSubcategory) {
          return false;
        }

        // Usage filter
        if (usageFilter !== "all" && p.usage !== usageFilter && p.usage !== "both") {
          return false;
        }

        // Search term (name, subcategory, material, tagline)
        if (searchTerm.trim() !== "") {
          const q = searchTerm.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
            (p.material && p.material.toLowerCase().includes(q)) ||
            (p.tagline && p.tagline.toLowerCase().includes(q)) ||
            (p.wattage && p.wattage.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "category") {
          return a.category.localeCompare(b.category);
        }
        // "featured" default
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [initialProducts, activeCategory, activeSubcategory, usageFilter, searchTerm, sortBy]);

  function buildWALink(productName: string, productId: string) {
    const msg = encodeURIComponent(
      `Hi Nivoseas, I am interested in ${productName} (ID: ${productId}). Please provide catalog pricing, technical specifications, and availability.`
    );
    return `https://wa.me/919990179666?text=${msg}`;
  }

  return (
    <div className="min-h-screen bg-[#F3EDE4] text-[#2A1810] pt-28 pb-24">
      {/* ── Breadcrumb & Header ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/70 mb-4">
          <Link href="/" className="hover:text-[#2A1810] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C8782A] font-medium">All Fixtures & Collections</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#2A1810]/10">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#C8782A]">
              Architectural & Decorative Portfolio
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.025em] text-[#2A1810] mt-2">
              Lighting Catalogue
            </h1>
            <p className="text-sm sm:text-base text-[#4A2C1A]/80 max-w-2xl mt-2 leading-relaxed">
              Explore our master collection of handcrafted chandeliers, weather-sealed gate fixtures, commercial architectural LED luminaires, and designer LED fans.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className="btn-3d btn-3d-outline text-xs px-4 py-2.5 rounded-full inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Admin Portal
            </Link>
            <a
              href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20need%20assistance%20choosing%20lighting%20for%20my%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d btn-3d-dark text-xs px-4 py-2.5 rounded-full inline-flex items-center gap-2"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              Instant Concierge
            </a>
          </div>
        </div>

        {/* ── Search & Filter Controls Bar ── */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search fixtures by name, material, wattage, or style..."
                className="w-full pl-11 pr-10 py-3 bg-white/90 border border-[#2A1810]/15 rounded-full text-sm text-[#2A1810] placeholder-[#2A1810]/40 focus:outline-none focus:border-[#C8782A] focus:ring-2 focus:ring-[#C8782A]/20 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2A1810]/50 hover:text-[#2A1810] text-xs font-bold p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Usage filter */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={usageFilter}
                onChange={(e) => setUsageFilter(e.target.value)}
                className="bg-white/90 border border-[#2A1810]/15 rounded-full px-4 py-2.5 text-xs font-medium text-[#2A1810] focus:outline-none focus:border-[#C8782A] shadow-sm cursor-pointer"
              >
                <option value="all">All Environments</option>
                <option value="indoor">Indoor Lighting</option>
                <option value="outdoor">Outdoor / Weather-Rated</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/90 border border-[#2A1810]/15 rounded-full px-4 py-2.5 text-xs font-medium text-[#2A1810] focus:outline-none focus:border-[#C8782A] shadow-sm cursor-pointer"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="name-asc">Sort: Name (A to Z)</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>
          </div>

          {/* Primary Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveSubcategory("all");
              }}
              className={`btn-3d text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeCategory === "all" ? "btn-3d-dark" : "btn-3d-outline bg-white/50"
                }`}
            >
              All Fixtures ({initialProducts.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = initialProducts.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubcategory("all");
                  }}
                  className={`btn-3d text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeCategory === cat.id ? "btn-3d-dark" : "btn-3d-outline bg-white/50"
                    }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Subcategories (if selected) */}
          {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 pl-1">
              <span className="text-[11px] uppercase tracking-wider text-[#4A2C1A]/60 font-semibold shrink-0">
                Sub-types:
              </span>
              <button
                onClick={() => setActiveSubcategory("all")}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${activeSubcategory === "all"
                    ? "bg-[#2A1810] text-[#F3EDE4] font-medium"
                    : "bg-[#2A1810]/5 text-[#4A2C1A] hover:bg-[#2A1810]/10"
                  }`}
              >
                All {currentCategoryObj.name}
              </button>
              {currentCategoryObj.subcategories.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubcategory(sub.name)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${activeSubcategory === sub.name
                      ? "bg-[#2A1810] text-[#F3EDE4] font-medium"
                      : "bg-[#2A1810]/5 text-[#4A2C1A] hover:bg-[#2A1810]/10"
                    }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Active Filters & Results Count ── */}
        <div className="flex items-center justify-between mt-6 text-xs text-[#4A2C1A]/70">
          <div>
            Showing <strong className="text-[#2A1810]">{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "fixture" : "fixtures"}
            {searchTerm && <span> matching &ldquo;{searchTerm}&rdquo;</span>}
          </div>
          {(searchTerm || activeCategory !== "all" || usageFilter !== "all" || activeSubcategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
                setActiveSubcategory("all");
                setUsageFilter("all");
              }}
              className="text-[#C8782A] hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* ── Products Grid ── */}
        {filteredProducts.length === 0 ? (
          <div className="mt-12 py-20 text-center bg-white/60 rounded-[32px] border border-[#2A1810]/10 p-8 max-w-xl mx-auto shadow-sm">
            <svg
              className="w-12 h-12 mx-auto text-[#2A1810]/30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-display text-xl text-[#2A1810]">No fixtures match your criteria</h3>
            <p className="text-sm text-[#4A2C1A]/70 mt-2 mb-6">
              Try adjusting your search keyword or clearing category filters to view our full collection.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
                setActiveSubcategory("all");
                setUsageFilter("all");
              }}
              className="btn-3d btn-3d-dark text-xs px-6 py-2.5 rounded-full"
            >
              Show All Fixtures
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-[26px] border border-[#2A1810]/10 hover:border-[#2A1810]/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#2A1810]/8"
              >
                {/* Image frame */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-[#E6DACB]/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cldPresets.thumbnail(product.images[0] || "/Minimalist Luxury Chandelier Interior.webp")}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/Minimalist Luxury Chandelier Interior.webp";
                    }}
                  />

                  {/* Badges overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {product.subcategory && (
                      <span className="bg-[#2A1810]/80 backdrop-blur-md text-[#F3EDE4] text-[10px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full">
                        {product.subcategory}
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-[#C8782A] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {product.usage && (
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-white/90 backdrop-blur-md text-[#2A1810] text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                        {product.usage === "outdoor" ? "Outdoor Rated" : product.usage === "both" ? "Indoor/Outdoor" : "Indoor"}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#C8782A] font-semibold mb-1">
                      {product.category.replace("-", " ")}
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-display text-base font-semibold text-[#2A1810] group-hover:text-[#C8782A] transition-colors leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.tagline && (
                      <p className="text-xs text-[#4A2C1A]/70 italic mt-1 line-clamp-1">
                        &ldquo;{product.tagline}&rdquo;
                      </p>
                    )}

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#2A1810]/5">
                      {product.material && (
                        <span className="text-[11px] bg-[#F3EDE4] text-[#4A2C1A] px-2.5 py-0.5 rounded-md font-medium">
                          {product.material}
                        </span>
                      )}
                      {product.wattage && (
                        <span className="text-[11px] bg-[#F3EDE4] text-[#4A2C1A] px-2.5 py-0.5 rounded-md font-medium">
                          {product.wattage}
                        </span>
                      )}
                      {product.warranty && (
                        <span className="text-[11px] bg-[#F3EDE4] text-[#4A2C1A] px-2.5 py-0.5 rounded-md font-medium">
                          {product.warranty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 flex items-center gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 btn-3d btn-3d-outline text-center text-xs font-medium py-2 rounded-xl"
                    >
                      View Specs
                    </Link>
                    <a
                      href={buildWALink(product.name, product.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d btn-3d-dark p-2 rounded-xl text-[#F3EDE4] hover:bg-[#C8782A] transition-colors"
                      title="Enquire on WhatsApp"
                      aria-label="Enquire on WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Direct Consultation Banner ── */}
        <div className="mt-20 rounded-[32px] bg-[#2A1810] text-[#F3EDE4] p-8 sm:p-12 relative overflow-hidden border border-[#C8782A]/30">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFB45E]">
              Architectural & Wholesale Inquiries
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal mt-2">
              Looking for custom sizing, wholesale supply, or showroom demonstration?
            </h2>
            <p className="text-sm sm:text-base text-[#E6DACB]/80 mt-3 leading-relaxed">
              Our lighting consultants and technical directors work closely with interior architects, luxury homebuilders, and commercial developers throughout Delhi NCR.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20have%20an%20architectural%2Fproject%20lighting%20requirement%20and%20would%20like%20to%20discuss."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-white text-xs font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                Connect on WhatsApp
              </a>
              <a
                href="tel:+919990179666"
                className="btn-3d btn-3d-outline text-xs font-semibold px-6 py-3 rounded-full text-white border-white/30 hover:border-white inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call +91 99901 79666
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

