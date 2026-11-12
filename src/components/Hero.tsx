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

          {/* CTAs: 1 Loud Amber Accent (#FF8A1F, #1A0F0A dark espresso text, silk light sweep) + 1 Silent Glass CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
            <a
              href="#collections"
              className="btn-3d btn-hero-amber group text-[13.5px] sm:text-sm font-semibold px-6 sm:px-7 py-3 sm:py-2.5 rounded-full flex items-center justify-center gap-2 text-center"
            >
              <span className="relative z-10">Explore Collections</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1 relative z-10"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20would%20like%20to%20enquire%20about%20your%20lighting%20catalogue."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d btn-3d-glass text-white text-[13.5px] sm:text-sm font-medium px-5 sm:px-6 py-3 sm:py-2.5 rounded-full flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366] shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.478 2 2 6.478 2 12.004a9.994 9.994 0 0 0 1.388 5.139L2 22l4.978-1.368A10.003 10.003 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.188a8.183 8.183 0 0 1-4.17-1.141l-.299-.178-3.095.851.822-3.012-.195-.308A8.19 8.19 0 0 1 3.822 12 8.188 8.188 0 0 1 12.004 3.81c4.509 0 8.182 3.673 8.182 8.19 0 4.515-3.673 8.188-8.182 8.188z" />
              </svg>
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </section >
  );
}
