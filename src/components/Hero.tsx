"use client";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px] bg-[#1a110b]"
      style={{
        minHeight: "640px",
        height: "min(94vh, 900px)",
      }}
    >
      {/* ── Banner Image (Responsive: Mobile vs Desktop) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <picture className="w-full h-full">
          <source media="(max-width: 767px)" srcSet="/mobilebanner.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bannerbg.webp"
            alt="Nivoseas Lighting — Sector 104, Noida"
            className="w-full h-full object-cover object-center sm:object-[50%_35%]"
          />
        </picture>
      </div>

      {/* ── Subtle dark vignette for text legibility ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0.38) 45%, rgba(8,6,4,0.12) 80%, rgba(8,6,4,0.22) 100%)",
        }}
      />

      {/* ── Hero Content — clean original typography, perfectly positioned ── */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-end pt-28 pb-14 sm:pb-20 lg:pb-24">
        <div className="max-w-[560px]">
          {/* Eyebrow */}
          <p className="text-[12px] sm:text-[13px] font-normal tracking-[0.14em] uppercase text-white/70 mb-3">
            Nivoseas Lighting — Sector 104, Noida
          </p>

            {/* Headline — original clean typography with brand champagne gold accent */}
            <h1 className="text-[clamp(1.85rem,6.2vw,3.375rem)] font-normal leading-[1.1] sm:leading-[1.08] tracking-[-0.02em] sm:tracking-[-1.5px] text-white mb-3 sm:mb-4">
              Illuminate Every Space With{" "}
              <span className="text-[#D9B46C]">Timeless Luxury Lighting.</span>
            </h1>

            {/* Subtext */}
            <p className="text-white/80 text-[15px] sm:text-base font-normal leading-relaxed mb-6 sm:mb-8 max-w-[440px]">
              Discover handcrafted chandeliers, pendant lights, wall sconces,
              and decorative fixtures designed to transform every room with
              elegance, warmth, and exceptional craftsmanship.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="#collections"
                className="btn-3d btn-3d-white text-[#2A1810] text-sm font-medium px-6 py-2.5 rounded-full"
              >
                Explore Collections
              </a>
              <a
                href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20would%20like%20to%20enquire%20about%20your%20lighting%20catalogue."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-glass text-white text-sm font-medium px-5 py-2.5 rounded-full"
              >
                WhatsApp Enquiry
              </a>
            </div>
        </div>
      </div>
    </section >
  );
}
