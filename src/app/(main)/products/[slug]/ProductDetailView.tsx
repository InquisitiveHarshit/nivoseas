"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { cldPresets } from "@/lib/cloudinary";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.478 2 2 6.478 2 12.004a9.994 9.994 0 0 0 1.388 5.139L2 22l4.978-1.368A10.003 10.003 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.188a8.183 8.183 0 0 1-4.17-1.141l-.299-.178-3.095.851.822-3.012-.195-.308A8.19 8.19 0 0 1 3.822 12 8.188 8.188 0 0 1 12.004 3.81c4.509 0 8.182 3.673 8.182 8.19 0 4.515-3.673 8.188-8.182 8.188z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/Minimalist Luxury Chandelier Interior.webp"];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] || images[0];
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);

  const skuCode = product.sku || product.id;
  const waText = encodeURIComponent(
      `Hi Nivoseas, I would like to enquire about "${product.name}" (SKU: ${skuCode}). Could you provide current pricing, stock availability, and lead time?`
  );
  const waUrl = `https://wa.me/919990179666?text=${waText}`;

  // Optimized image URLs via Cloudinary (f_auto, q_auto)
  const optimizedMain = cldPresets.productMain(activeImage);
  const optimizedThumbs = images.map((img) => cldPresets.galleryThumb(img));

  // Legacy fallback spec rows (NO origin per design specification)
  const specRows: { label: string; value: string }[] = [
    product.subcategory ? { label: "Fixture Type", value: product.subcategory } : null,
    product.material ? { label: "Material & Finish", value: product.material } : null,
    product.wattage ? { label: "Power / Dimensions", value: product.wattage } : null,
    product.colourTemp ? { label: "Colour Temperature", value: product.colourTemp } : null,
    product.lightColour ? { label: "Light Output / Modes", value: product.lightColour } : null,
    product.voltage ? { label: "Voltage Rating", value: product.voltage } : null,
    product.warranty ? { label: "Warranty", value: product.warranty } : null,
    product.lampLife ? { label: "Lamp Life", value: product.lampLife } : null,
    (product.suggestiveUsage || product.usage)
      ? {
        label: "Environment / Suggestive Usage",
        value:
          product.suggestiveUsage ||
          (product.usage === "outdoor"
            ? "Outdoor Rated"
            : product.usage === "both"
              ? "Indoor & Outdoor"
              : "Indoor"),
      }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const hasOrderedTechSpecs = Boolean(
    product.technicalSpecs && product.technicalSpecs.length > 0
  );

  return (
    <div className="min-h-screen bg-[#F3EDE4] text-[#2A1810]">
      {/* ── Hero strip ── */}
      <div className="pt-28 pb-0 bg-[#F3EDE4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/60 mb-10 overflow-x-auto pb-1"
          >
            <Link href="/" className="hover:text-[#C8782A] transition-colors whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#C8782A] transition-colors whitespace-nowrap">Catalogue</Link>
            <span>/</span>
            <span className="text-[#C8782A] font-medium capitalize whitespace-nowrap">
              {product.category.replace(/-/g, " ")}
            </span>
            {product.subcategory && (
              <>
                <span>/</span>
                <span className="text-[#4A2C1A] whitespace-nowrap">{product.subcategory}</span>
              </>
            )}
            <span>/</span>
            <span className="text-[#2A1810] truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 lg:gap-16 items-start">

          {/* ══ Left: Gallery ══ */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            {/* Main stage */}
            <div className="relative rounded-[32px] overflow-hidden bg-white border border-[#2A1810]/10 shadow-xl shadow-[#2A1810]/8 aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={optimizedMain}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.03]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = activeImage;
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.subcategory && (
                  <span className="bg-[#2A1810]/85 backdrop-blur-md text-[#F3EDE4] text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow">
                    {product.subcategory}
                  </span>
                )}
                {product.featured && (
                  <span className="bg-[#C8782A] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Photo count pill */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-full">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 bg-white ${activeImageIndex === idx
                        ? "border-[#C8782A] ring-2 ring-[#C8782A]/30 scale-110 shadow-lg"
                        : "border-[#2A1810]/10 hover:border-[#C8782A]/40 opacity-60 hover:opacity-100"
                      }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={optimizedThumbs[idx]}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = img;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust chips */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🏛️", title: "Showroom Ready", desc: "Sector 104, Noida — visit anytime" },
                { icon: "✏️", title: "Custom Sizing", desc: "Architectural mods available" },
                { icon: "📦", title: "Project Supply", desc: "Bulk orders & B2B pricing" },
                { icon: "🛡️", title: product.warranty ?? "Warranty", desc: product.warranty ? "Manufacturer backed" : "On enquiry" },
              ].map((chip) => (
                <div key={chip.title} className="p-3.5 rounded-2xl bg-white/80 border border-[#2A1810]/8 flex gap-2.5 items-start">
                  <span className="text-lg leading-none mt-0.5">{chip.icon}</span>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C8782A]">{chip.title}</div>
                    <div className="text-[11px] text-[#4A2C1A]/70 mt-0.5 leading-snug">{chip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Right: Info ══ */}
          <div className="lg:col-span-6 space-y-6">
            {/* Category + SKU Identifier */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8782A]">
                {product.category.replace(/-/g, " ")}
              </span>
              <span className="text-[#4A2C1A]/30">•</span>
                <span className="text-xs text-[#2A1810] font-mono font-semibold bg-[#2A1810]/5 px-2.5 py-1 rounded-md border border-[#2A1810]/8">
                  SKU: {skuCode}
                </span>
            </div>

            {/* Name + Tagline */}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#2A1810] leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-base sm:text-lg text-[#4A2C1A]/75 italic mt-3 font-serif leading-relaxed">
                  &ldquo;{product.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* ── CTA Card ── */}
            <div className="rounded-[28px] bg-white border border-[#2A1810]/10 shadow-sm overflow-hidden">
              {/* Status bar */}
              <div className="px-6 py-4 bg-[#2A1810]/3 border-b border-[#2A1810]/8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-[#2A1810]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Order & Project Supply
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#4A2C1A]/60 block">MOQ</span>
                  <span className="text-sm font-bold text-[#2A1810]">{product.moq ? `${product.moq} pc` : "1 pc"}</span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-dark w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-semibold"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Enquire via WhatsApp
                </a>
                <a
                  href="tel:+919990179666"
                  className="btn-3d btn-3d-outline w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call +91 99901 79666
                </a>
                <p className="text-[11px] text-center text-[#4A2C1A]/50 pt-1">
                  Direct consultation with Nivoseas technical team. Instant quotation & CAD specs.
                </p>
              </div>
            </div>

            {/* ── Description ── */}
            {product.description && (
              <div className="rounded-[28px] bg-white border border-[#2A1810]/10 shadow-sm p-6 sm:p-7 space-y-3">
                <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#C8782A]">
                  About this Fixture
                </h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#2A1810]">
                  {product.description}
                </p>
              </div>
            )}

            {/* ── Features ── */}
            {product.features && product.features.length > 0 && (
              <div className="rounded-[28px] bg-white border border-[#2A1810]/10 shadow-sm p-6 sm:p-7 space-y-4">
                <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#2A1810] flex items-center justify-between">
                  <span>Key Features</span>
                  <span className="text-[11px] font-mono text-[#C8782A] normal-case tracking-normal">Engineered for Excellence</span>
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#2A1810]">
                      <span className="w-5 h-5 rounded-full bg-[#C8782A]/15 text-[#C8782A] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckIcon />
                      </span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Technical Specifications Table ── */}
            {hasOrderedTechSpecs ? (
              <div className="rounded-[28px] bg-white border border-[#2A1810]/10 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                  className="w-full px-6 py-4 bg-[#2A1810]/5 border-b border-[#2A1810]/8 flex items-center justify-between cursor-pointer hover:bg-[#2A1810]/8 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#2A1810]">
                      Technical Specifications
                    </h2>
                    <span className="text-[11px] font-mono text-[#C8782A] font-semibold">
                      SKU: {skuCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8782A]">
                    <span className="hidden sm:inline">{isSpecsOpen ? "Collapse Specs" : "Open Specs Table"}</span>
                    <div
                      className={`w-6 h-6 rounded-md bg-white border border-[#2A1810]/10 flex items-center justify-center transition-transform duration-200 ${
                        isSpecsOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#2A1810]">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                {isSpecsOpen && (
                  <dl className="divide-y divide-[#2A1810]/5">
                    {product.technicalSpecs!
                      .filter((row) => row.value && row.value.trim().length > 0)
                      .map((row, idx) => (
                        <div
                          key={`${row.label}-${idx}`}
                          className="px-6 py-3.5 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4"
                        >
                          <dt className="text-xs sm:text-sm text-[#4A2C1A]/75 font-medium shrink-0 sm:max-w-[45%]">
                            {row.label}
                          </dt>
                          <dd className="text-xs sm:text-sm text-[#2A1810] font-semibold sm:text-right leading-relaxed">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    {/* Also show Wattage & Environment if provided and not already covered in rows */}
                    {product.wattage &&
                      !product.technicalSpecs!.some(
                        (r) =>
                          r.label.toLowerCase().includes("wattage") ||
                          r.label.toLowerCase().includes("power")
                      ) && (
                        <div className="px-6 py-3.5 flex justify-between items-center gap-4 bg-[#C8782A]/5">
                          <dt className="text-xs sm:text-sm text-[#4A2C1A]/75 font-medium shrink-0">
                            Wattage / Lamp Rating
                          </dt>
                          <dd className="text-xs sm:text-sm text-[#C8782A] font-bold text-right">
                            {product.wattage}
                          </dd>
                        </div>
                      )}
                    {(product.suggestiveUsage || product.usage) &&
                      !product.technicalSpecs!.some(
                        (r) =>
                          r.label.toLowerCase().includes("environment") ||
                          r.label.toLowerCase().includes("usage")
                      ) && (
                        <div className="px-6 py-3.5 flex justify-between items-center gap-4">
                          <dt className="text-xs sm:text-sm text-[#4A2C1A]/75 font-medium shrink-0">
                            Environment / Suggestive Usage
                          </dt>
                          <dd className="text-xs sm:text-sm text-[#2A1810] font-semibold text-right">
                            {product.suggestiveUsage ||
                              (product.usage === "outdoor"
                                ? "Outdoor Rated"
                                : product.usage === "both"
                                ? "Indoor & Outdoor"
                                : "Indoor Living & Commercial")}
                          </dd>
                        </div>
                      )}
                  </dl>
                )}
              </div>
            ) : specRows.length > 0 ? (
              <div className="rounded-[28px] bg-white border border-[#2A1810]/10 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                  className="w-full px-6 py-4 bg-[#2A1810]/5 border-b border-[#2A1810]/8 flex items-center justify-between cursor-pointer hover:bg-[#2A1810]/8 transition-colors text-left"
                >
                  <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#2A1810]">
                    Technical Specifications
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8782A]">
                    <span className="hidden sm:inline">{isSpecsOpen ? "Collapse Specs" : "Open Specs Table"}</span>
                    <div
                      className={`w-6 h-6 rounded-md bg-white border border-[#2A1810]/10 flex items-center justify-center transition-transform duration-200 ${
                        isSpecsOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#2A1810]">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                {isSpecsOpen && (
                  <dl className="divide-y divide-[#2A1810]/5">
                    {specRows.map((row) => (
                      <div key={row.label} className="px-6 py-3.5 flex justify-between items-center gap-4">
                        <dt className="text-xs sm:text-sm text-[#4A2C1A]/70 font-medium shrink-0">{row.label}</dt>
                        <dd className="text-xs sm:text-sm text-[#2A1810] font-semibold text-right">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ) : null}

            {/* ── Extended Specs (from product.specs) ── */}
              {
                product.specs && Object.keys(product.specs).length > 0 && !hasOrderedTechSpecs && (
                  <div className="rounded-[28px] bg-white border border-[#2A1810]/10 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-[#C8782A]/8 border-b border-[#2A1810]/8">
                      <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#C8782A]">
                        Extended Engineering Parameters
                      </h2>
                    </div>
                    <dl className="divide-y divide-[#2A1810]/5">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="px-6 py-3.5 flex justify-between items-center gap-4">
                          <dt className="text-xs sm:text-sm text-[#4A2C1A]/70 font-medium shrink-0">{key}</dt>
                          <dd className="text-xs sm:text-sm text-[#2A1810] font-semibold text-right">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )
              }
          </div>
        </div>

        {/* ══ Related Products ══ */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 pt-12 border-t border-[#2A1810]/10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8782A]">
                  You May Also Like
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#2A1810] mt-1">
                  Complementary Luminaires
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs uppercase tracking-wider font-bold text-[#C8782A] hover:text-[#2A1810] transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const relThumb = cldPresets.related(rel.images[0] || "/Minimalist Luxury Chandelier Interior.webp");
                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}`}
                    className="group block bg-white rounded-[24px] border border-[#2A1810]/10 hover:border-[#C8782A]/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#E6DACB]/30 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relThumb}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = rel.images[0] || "/Minimalist Luxury Chandelier Interior.webp";
                        }}
                      />
                      {rel.featured && (
                        <span className="absolute top-2.5 left-2.5 bg-[#C8782A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      {rel.subcategory && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C8782A]">
                          {rel.subcategory}
                        </span>
                      )}
                      <h4 className="font-display text-sm font-semibold text-[#2A1810] group-hover:text-[#C8782A] transition-colors line-clamp-2 leading-snug">
                        {rel.name}
                      </h4>
                      {rel.material && (
                        <p className="text-[11px] text-[#4A2C1A]/60 line-clamp-1">{rel.material}</p>
                      )}
                      <div className="pt-1 text-[11px] font-semibold text-[#C8782A] group-hover:translate-x-1 transition-transform">
                        View Details →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

