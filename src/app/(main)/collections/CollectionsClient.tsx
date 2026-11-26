"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

// ── Types ────────────────────────────────────────────────────────────────────
interface CategoryImageData {
  id: string;
  name: string;
  slug: string;
  heroImage: string | null;
  defaultImage: string | null;
  hasOverride: boolean;
}

  // ── Skeleton Tile ─────────────────────────────────────────────────────────────
  function TileSkeleton({ className }: { className: string }) {
    return (
      <div className={`${className} rounded-[32px] overflow-hidden animate-pulse`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8DDD0] via-[#D9CFC4] to-[#C9BFAF]">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 p-7 sm:p-9 flex justify-between">
          <div className="h-6 w-36 rounded-full bg-[#C8B9A8]/60" />
          <div className="w-10 h-10 rounded-full bg-[#C8B9A8]/60" />
        </div>
        <div className="relative z-10 p-7 sm:p-9 mt-auto space-y-2">
          <div className="h-3 w-28 rounded-full bg-[#C8B9A8]/60" />
          <div className="h-8 w-48 rounded-lg bg-[#C8B9A8]/70" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 rounded-full bg-[#C8B9A8]/50" />
            <div className="h-6 w-16 rounded-full bg-[#C8B9A8]/50" />
            <div className="h-6 w-20 rounded-full bg-[#C8B9A8]/50" />
          </div>
        </div>
      </div>
    );
  }

  // ── Main Component ─────────────────────────────────────────────────────────────
    export default function CollectionsClient() {
      const [catImages, setCatImages] = useState<Record<string, string | null>>({});
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetch("/api/categories")
          .then((r) => r.json())
          .then((json) => {
            if (json.success && Array.isArray(json.data)) {
              const map: Record<string, string | null> = {};
              for (const c of json.data as CategoryImageData[]) {
                map[c.id] = c.heroImage ?? c.defaultImage ?? null;
              }
              setCatImages(map);
            }
          })
          .catch(() => {/* silently fall back to static defaults */ })
          .finally(() => setLoading(false));
      }, []);

      // Helper — resolve image src: prefer API override, fall back to static path
      const img = (categoryId: string, staticFallback: string) =>
      catImages[categoryId] ?? staticFallback;

  return (
    <>
      <style>{`
        @keyframes shimmer {
              0 % { transform: translateX(-100 %); }
          100% {transform: translateX(200%); }
        }
      `}</style>

            <div className="bg-[#F3EDE4] text-[#2A1810] pt-28 pb-20 selection:bg-[#C8782A] selection:text-white">

                {/* ── Page Header ── */}
                <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-10 border-b border-[#2A1810]/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/70 mb-4">
                    <Link href="/" className="hover:text-[#2A1810] transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#C8782A] font-medium">Collections</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                      <p className="text-[13px] uppercase tracking-[0.14em] text-[#C8782A] font-medium mb-2">
                        Our Collections
                      </p>
                      <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.025em] text-[#2A1810] leading-[1.05]">
                        From the drawing room<br /><em>to the gate.</em>
                      </h1>
                    </div>
                    <Link href="/products" className="btn-3d btn-3d-outline px-6 py-2.5 text-xs font-semibold shrink-0">
                      Browse all products →
                    </Link>
                  </div>
                </section>

              {/* ── Bento Grid ── */}
              <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">

                      {/* ══ ROW 1: 8 + 4 ══ */}

                          {/* Tile 1 — Decorative (span 8) */}
                          {loading ? (
                            <TileSkeleton className="relative col-span-1 md:col-span-2 lg:col-span-8 min-h-[400px] sm:min-h-[440px] flex flex-col justify-between" />
                          ) : (
              <Link
                href="/products?category=decorative"
                className="group relative col-span-1 md:col-span-2 lg:col-span-8 rounded-[32px] overflow-hidden min-h-[400px] sm:min-h-[440px] flex flex-col justify-between p-7 sm:p-9 border border-black/10 hover:border-[#C8782A]/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.008]"
              >
                <div className="absolute inset-0 z-0 bg-[#1E120A] overflow-hidden">
                  <Image
                    src={img("decorative", "/decorative.webp")}
                    alt="Decorative Chandeliers"
                    fill unoptimized
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                </div>
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#FFB45E] border border-white/15">
                    97+ Models • Flagship Discipline
                  </span>
                  <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                    <FiArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="relative z-10 max-w-xl">
                  <p className="text-xs uppercase tracking-widest font-mono text-[#FFB45E] mb-2 font-medium">
                    For the rooms that matter most
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.08] mb-3">
                    Decorative &amp; Chandeliers
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Chandeliers", "Thali Series", "Hanging Lights", "Wall Sconces", "Table Lamps"].map((item) => (
                      <span key={item} className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/15">
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E] transition-colors">
                    <span>Explore Decorative Range</span>
                    <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
                      )}

                              {/* Tile 2 — Indoor Lighting (span 4) — dark style matching all other tiles */}
                              {loading ? (
                                <TileSkeleton className="relative col-span-1 md:col-span-2 lg:col-span-4 min-h-[400px] sm:min-h-[440px] flex flex-col justify-between" />
                              ) : (
                                <Link
                                  href="/products?category=indoor-lighting"
                                  className="group relative col-span-1 md:col-span-2 lg:col-span-4 rounded-[32px] overflow-hidden min-h-[400px] sm:min-h-[440px] flex flex-col justify-between p-7 sm:p-8 border border-black/10 hover:border-[#C8782A]/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.008]"
                                >
                                  <div className="absolute inset-0 z-0 bg-[#1E120A] overflow-hidden">
                                    <Image
                                      src={img("indoor-lighting", "https://nivoseas.com/wp-content/uploads/2024/01/chandelier-category.jpg")}
                                      alt="Indoor Lighting"
                                      fill unoptimized
                                      sizes="(max-width: 1024px) 100vw, 33vw"
                                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 group-hover:opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                                  </div>
                                  <div className="relative z-10 flex items-start justify-between">
                                    <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFB45E] border border-white/15 font-medium">
                                      Indoor Atmosphere
                                    </span>
                                    <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                                      <FiArrowRight className="w-4 h-4" />
                                    </span>
                                  </div>
                                  <div className="relative z-10">
                                    <p className="text-xs uppercase tracking-widest font-mono text-[#FFB45E] mb-1.5 font-medium">
                                      Every room, perfectly lit
                                    </p>
                                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight mb-3">
                                      Indoor Lighting
                                    </h2>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                      {["Ceiling Lights", "Recessed", "Spotlights", "Linear Pendants", "Downlights"].map((tag) => (
                                        <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/15">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E] transition-colors">
                                      <span>View Indoor Fixtures</span>
                                      <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                    </span>
                </div>
                        </Link>
                      )}

                      {/* ══ ROW 2: 7 + 5 ══ */}

                      {/* Tile 3 — Outdoor & Gate (span 7) */}
                      {loading ? (
                        <TileSkeleton className="relative col-span-1 md:col-span-2 lg:col-span-7 min-h-[350px] sm:min-h-[380px] flex flex-col justify-between" />
                      ) : (
              <Link
                href="/products?category=outdoor-gate"
                className="group relative col-span-1 md:col-span-2 lg:col-span-7 rounded-[32px] overflow-hidden min-h-[350px] sm:min-h-[380px] flex flex-col justify-between p-7 sm:p-8 border border-black/10 hover:border-[#C8782A]/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.008]"
              >
                <div className="absolute inset-0 z-0 bg-[#1E120A] overflow-hidden">
                  <Image
                    src={img("outdoor-gate", "/outdoor.webp")}
                    alt="Outdoor and Gate Lighting"
                    fill unoptimized
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                </div>
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#FFB45E] border border-white/15">
                    Weather-Rated IP65 • 27+ Models
                  </span>
                  <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                    <FiArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="relative z-10 max-w-lg">
                  <p className="text-xs uppercase tracking-widest font-mono text-[#FFB45E] mb-1.5 font-medium">
                    From the drawing room to the gate
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight mb-3">
                    Outdoor &amp; Gate Lights
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {["Gate Light LED", "Casting & MS", "Pole Bollards", "Garden Spikes"].map((tag) => (
                      <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/15">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E] transition-colors">
                    <span>View Gate &amp; Exterior Range</span>
                    <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            )}

            {/* Tile 4 — Architectural LED (span 5) */}
                    {loading ? (
                      <TileSkeleton className="relative col-span-1 md:col-span-2 lg:col-span-5 min-h-[350px] sm:min-h-[380px] flex flex-col justify-between" />
                    ) : (
                      <Link
                        href="/products?category=architectural-led"
                        className="group relative col-span-1 md:col-span-2 lg:col-span-5 rounded-[32px] overflow-hidden min-h-[350px] sm:min-h-[380px] flex flex-col justify-between p-7 sm:p-8 bg-[#1A0F0A] border border-white/10 hover:border-[#C8782A]/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.008]"
                      >
                        <div className="absolute inset-0 z-0 overflow-hidden">
                          <Image
                            src={img("architectural-led", "/architectural-led.jpg")}
                            alt="Architectural LED"
                            fill unoptimized
                            sizes="(max-width: 1024px) 100vw, 42vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-45 group-hover:opacity-60"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-[#1A0F0A]/70 to-black/30" />
                        </div>
                        <div className="relative z-10 flex items-start justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#FFB45E] border border-white/15">
                            51+ Models • High CRI 98+
                          </span>
                          <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                            <FiArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="relative z-10">
                          <p className="text-xs uppercase tracking-widest font-mono text-[#FFB45E] mb-1.5 font-medium">
                            Precision light. Zero compromise.
                          </p>
                          <h2 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-3">
                            Architectural LED &amp; Profiles
                          </h2>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {["Down Lights", "Panel Lights", "Spot Lights", "Magnetic Tracks"].map((tag) => (
                              <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E] transition-colors">
                            <span>Explore Architectural LED</span>
                            <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    )}

                    {/* ══ ROW 3: 4 + 4 + 4 ══ */}

                    {/* Tile 5 — Commercial (span 4) */}
                    {loading ? (
                      <TileSkeleton className="relative col-span-1 md:col-span-1 lg:col-span-4 min-h-[320px] sm:min-h-[350px] flex flex-col justify-between" />
                    ) : (
                      <Link
                        href="/products?category=commercial"
                        className="group relative col-span-1 md:col-span-1 lg:col-span-4 rounded-[32px] overflow-hidden min-h-[320px] sm:min-h-[350px] flex flex-col justify-between p-6 sm:p-7 border border-black/10 hover:border-[#C8782A]/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
                      >
                        <div className="absolute inset-0 z-0 bg-[#1E120A] overflow-hidden">
                          <Image
                            src={img("commercial", "/office.webp")}
                            alt="Commercial Lighting"
                            fill unoptimized
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                        </div>
                        <div className="relative z-10 flex items-start justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFB45E] border border-white/15">
                            Workspace &amp; Studio
                          </span>
                          <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <div className="relative z-10">
                          <p className="text-[11px] uppercase tracking-widest font-mono text-[#FFB45E] mb-1 font-medium">
                            Professional spaces
                          </p>
                          <h3 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-2">
                            Commercial
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {["Office Lights", "Linear Profiles", "Track Lights"].map((tag) => (
                              <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E]">
                            <span>Explore Commercial</span>
                            <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    )}

                  {/* Tile 6 — LED Ceiling Fans (span 4) */}
                  {loading ? (
                    <TileSkeleton className="relative col-span-1 md:col-span-1 lg:col-span-4 min-h-[320px] sm:min-h-[350px] flex flex-col justify-between" />
                  ) : (
                    <Link
                      href="/products?category=led-fans"
                      className="group relative col-span-1 md:col-span-1 lg:col-span-4 rounded-[32px] overflow-hidden min-h-[320px] sm:min-h-[350px] flex flex-col justify-between p-6 sm:p-7 border border-black/10 hover:border-[#C8782A]/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
                    >
                      <div className="absolute inset-0 z-0 bg-[#1E120A] overflow-hidden">
                        <Image
                          src={img("led-fans", "/led-fan.jpg")}
                          alt="LED Ceiling Fans"
                          fill unoptimized
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                      </div>
                      <div className="relative z-10 flex items-start justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFB45E] border border-white/15">
                          Light &amp; Air • 12+ Models
                        </span>
                        <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                          <FiArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-[11px] uppercase tracking-widest font-mono text-[#FFB45E] mb-1 font-medium">
                          Quiet breeze &amp; illumination
                        </p>
                        <h3 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-2">
                          LED Ceiling Fans
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {["BLDC Motor", "Dimmable LED", "Remote Control"].map((tag) => (
                            <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E]">
                          <span>Explore Fans</span>
                          <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  )}

            {/* Tile 7 — Partner Brands (span 4) */}
                  {loading ? (
                    <TileSkeleton className="relative col-span-1 md:col-span-2 lg:col-span-4 min-h-[320px] sm:min-h-[350px] flex flex-col justify-between" />
                  ) : (
                    <Link
                      href="/products?category=brands"
                      className="group relative col-span-1 md:col-span-2 lg:col-span-4 rounded-[32px] overflow-hidden min-h-[320px] sm:min-h-[350px] flex flex-col justify-between p-6 sm:p-7 bg-[#20130B] border border-white/10 hover:border-[#FFB45E]/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
                    >
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <Image
                          src={img("brands", "/bannerbg.webp")}
                          alt="Panasonic and GM Modular"
                          fill unoptimized
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-40 group-hover:opacity-55"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#20130B] via-[#20130B]/80 to-[#20130B]/40" />
                      </div>
                      <div className="relative z-10 flex items-start justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FFB45E] border border-white/15">
                          Authorized Lines
                        </span>
                        <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C8782A] group-hover:rotate-45 transition-all duration-300">
                          <FiArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-[11px] uppercase tracking-widest font-mono text-[#FFB45E] mb-1 font-medium">
                          Panasonic &amp; GM Modular
                        </p>
                        <h3 className="font-display text-2xl sm:text-3xl font-normal text-white leading-tight mb-2">
                          Official Brands
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {["Panasonic Range", "GM Modular", "Full Warranty"].map((tag) => (
                            <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-[#FFB45E]">
                          <span>View Brand Fixtures</span>
                          <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  )}

            </div>
          </section>
      </div >
    </>
  );
    }
