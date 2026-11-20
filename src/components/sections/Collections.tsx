"use client";

import { CATEGORIES } from "@/data/categories";
import Link from "next/link";
import Image from "next/image";

const ACCENT_COLORS: Record<string, string> = {
  decorative: "#C8782A",
  "outdoor-gate": "#4A2C1A",
  "architectural-led": "#2A1810",
  "led-fans": "#D9B46C",
};

export default function Collections() {
  return (
    <section
      id="collections"
      className="section-gap w-full bg-[#E6DACB] px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-[500px]">
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#C8782A] font-medium mb-3">
              Our collections
            </p>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-normal leading-[1.0] tracking-[-0.025em] text-[#2A1810]">
              From the drawing room<br />
              <em>to the gate.</em>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/collections"
              className="btn-3d btn-3d-dark px-6 py-2.5 text-[13px]"
            >
              Explore Collections Page →
            </Link>
            <Link
              href="/products"
              className="btn-3d btn-3d-outline px-6 py-2.5 text-[13px]"
            >
              Browse all products
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {CATEGORIES.map((cat, i) => {
            const isLarge = i < 2;
            const accent = ACCENT_COLORS[cat.id] ?? "#C8782A";
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`
                  group relative overflow-hidden rounded-[28px] flex flex-col justify-between
                  bg-[#EDE5DA] hover:bg-[#e4dbce]
                  border border-[rgba(42,24,16,0.08)] hover:border-[rgba(42,24,16,0.2)]
                  transition-all duration-300 hover:shadow-xl hover:shadow-[#2A1810]/8
                  ${isLarge ? "lg:col-span-6 h-[320px] sm:h-[360px]" : "lg:col-span-6 h-[260px] sm:h-[300px]"}
                `}
              >
                {/* Background image — visible but card stays warm/light */}
                {cat.heroImage && (
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px]">
                    <Image
                      src={cat.heroImage}
                      alt={cat.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-50 group-hover:opacity-60"
                    />
                    {/* Minimal warm tint — just enough for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#EDE5DA]/90 via-[#EDE5DA]/50 to-transparent" />
                  </div>
                )}

                {/* Product count pill */}
                <div className="relative z-10 p-7 pb-0 flex items-start justify-between">
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border"
                    style={{ color: accent, borderColor: `${accent}44`, background: `${accent}11` }}
                  >
                    {cat.productCount}+ products
                  </span>
                  <span className="w-9 h-9 rounded-full border border-[rgba(42,24,16,0.12)] flex items-center justify-center group-hover:border-[rgba(42,24,16,0.3)] group-hover:rotate-45 transition-all duration-300">
                    <svg viewBox="0 0 12 12" fill="none" stroke="#2A1810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                      <path d="M2 10 L10 2 M4 2 L10 2 L10 8" />
                    </svg>
                  </span>
                </div>

                {/* Text block — dark text, original style */}
                <div className="relative z-10 p-7 pt-4">
                  <h3 className="font-display text-[clamp(1.4rem,2.8vw,2.1rem)] font-normal leading-[1.0] tracking-[-0.02em] text-[#2A1810] mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-[13px] font-normal text-[#6b5f55] leading-relaxed line-clamp-2">
                    {cat.tagline}
                  </p>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub.name}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[rgba(42,24,16,0.06)] text-[#4A2C1A] border border-[rgba(42,24,16,0.08)]"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {cat.subcategories.length > 3 && (
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[rgba(42,24,16,0.06)] text-[#4A2C1A]">
                          +{cat.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
