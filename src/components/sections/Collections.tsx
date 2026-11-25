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
                  bg-[#1C120C] hover:bg-[#150D08]
                  border border-white/10 hover:border-white/20
                  transition-all duration-300 hover:shadow-2xl hover:shadow-black/30
                  ${isLarge ? "lg:col-span-6 h-[320px] sm:h-[360px]" : "lg:col-span-6 h-[260px] sm:h-[300px]"}
                `}
              >
                {/* Background image with cinematic dark gradient vignette */}
                {cat.heroImage && (
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px]">
                    <Image
                      src={cat.heroImage}
                      alt={cat.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-85"
                    />
                    {/* Dark gradient overlay — deep espresso at the bottom for high contrast text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#150D08]/95 via-[#150D08]/50 to-black/25 pointer-events-none" />
                  </div>
                )}

                {/* Product count pill & Arrow button */}
                <div className="relative z-10 p-7 pb-0 flex items-start justify-between">
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md"
                    style={{
                      color: "#E5C287",
                      borderColor: "rgba(217, 180, 108, 0.35)",
                      background: "rgba(21, 13, 8, 0.65)",
                    }}
                  >
                    {cat.productCount}+ products
                  </span>
                  <span className="w-9 h-9 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center group-hover:border-[#D9B46C] group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                    <svg viewBox="0 0 12 12" fill="none" stroke="#F3EDE4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                      <path d="M2 10 L10 2 M4 2 L10 2 L10 8" />
                    </svg>
                  </span>
                </div>

                {/* Text block — Golden eyebrow, crisp white display heading, golden/warm white tags */}
                <div className="relative z-10 p-7 pt-4">
                  <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#D9B46C] font-mono font-medium mb-1 drop-shadow-sm">
                    {cat.tagline}
                  </p>
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.3rem)] font-normal leading-[1.05] tracking-[-0.02em] text-white mb-3 drop-shadow-md">
                    {cat.name}
                  </h3>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub.name}
                          className="text-[10.5px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 backdrop-blur-xs group-hover:border-white/30 transition-colors"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {cat.subcategories.length > 3 && (
                        <span className="text-[10.5px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-[#D9B46C] border border-white/15 backdrop-blur-xs">
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
