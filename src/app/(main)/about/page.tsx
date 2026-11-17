import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiMapPin, FiShield, FiSliders, FiSun } from "react-icons/fi";

export const metadata: Metadata = {
  title: "About Us | Nivoseas Lighting LLP — Craftsmanship & Architectural Illumination",
  description:
    "Learn about Nivoseas Lighting LLP. Based in Sector 104, Noida, we design and craft architectural chandeliers, outdoor gate fixtures, and commercial LED luminaires with a 2-year warranty.",
};

const PILLARS = [
  {
    icon: FiSun,
    title: "Light as an Emotional Atmosphere",
    desc: "We don't view luminaires as mere electric appliances. Light governs the mood, intimacy, and warmth of a home. Every piece is engineered with warm, eye-comfort colour temperatures calibrated for Indian living spaces.",
  },
  {
    icon: FiSliders,
    title: "Tailored for Bespoke Ceilings",
    desc: "From 9-foot apartment ceilings to 22-foot double-height duplex foyers, our chandeliers and pendant suspensions are designed with height adjustability, smooth dimming, and custom drop configurations.",
  },
  {
    icon: FiShield,
    title: "2-Year Authentic Warranty",
    desc: "Built with precision-grade metals, optical K9 crystal, and surge-protected LED drivers. We back every luminaire with a direct 24-month warranty and genuine replacement support from our Noida atelier.",
  },
  {
    icon: FiCheckCircle,
    title: "No MOQ — Luxury for Every Project",
    desc: "Whether you are a homeowner curating a single statement dining chandelier or an architectural firm specifying 100 outdoor gate lights, we treat every order with the exact same artisanal care.",
  },
];

const STATS = [
  { value: "150+", label: "Handcrafted Luminaires" },
  { value: "2,000+", label: "NCR Homes & Spaces Illuminated" },
  { value: "2 Years", label: "Authentic Full Warranty" },
  { value: "1 pc", label: "Minimum Order Quantity" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F3EDE4] text-[#2A1810] pt-28 pb-20 selection:bg-[#C8782A] selection:text-white">
      {/* ── Breadcrumb & Hero ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-16 border-b border-[#2A1810]/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/70 mb-6">
          <Link href="/" className="hover:text-[#2A1810] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C8782A] font-medium">About Our Atelier</span>
        </div>

        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C8782A]">
            Rooted in Noida • Crafted for India
          </span>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.025em] text-[#2A1810] mt-3 leading-[1.08]">
            We build lighting that turns architecture into feeling.
          </h1>
          <p className="text-base sm:text-lg text-[#4A2C1A]/85 mt-6 leading-relaxed font-normal">
            Nivoseas Lighting LLP was founded on a simple realization: the lighting fixtures in modern Indian homes shouldn&apos;t be disposable imports or soulless hardware. Every ceiling has height, every wall has texture, and light should be treated as the final, poetic layer of architecture.
          </p>
        </div>
      </section>

      {/* ── Narrative Story & Visual ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column — Human Story */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8782A]">
              Our Story
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-[#2A1810] leading-tight">
              From our Sector 104 workshop to living rooms across the country.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#4A2C1A]/80 leading-relaxed font-normal">
              <p>
                Walking through modern luxury apartments and bespoke villas across Delhi NCR, we repeatedly noticed the same frustration from architects and homeowners alike: finding chandeliers that combined breathtaking crystal craftsmanship with electrical components engineered to withstand Indian voltage fluctuations was almost impossible.
              </p>
              <p>
                Either you were forced into exorbitant European imports with multi-month lead times, or generic market alternatives where metal plating oxidized within months and LED drivers flickered out after the first monsoon season.
              </p>
              <p>
                We started Nivoseas to close that gap. Based in Sector 104, Noida, we oversee every step — from the weight and lustre of each faceted crystal tier to the precision thermal management of our architectural LED luminaires. When a Nivoseas fixture hangs in your home, it is built to hold its beauty and composure for years to come.
              </p>
            </div>

            {/* Quote block */}
            <div className="p-6 rounded-2xl bg-white border border-[#2A1810]/10 border-l-4 border-l-[#C8782A] mt-6">
              <p className="font-display italic text-base sm:text-lg text-[#2A1810]">
                &ldquo;A well-designed light does not simply illuminate a room; it shapes how people sit together, how they converse, and how peaceful they feel when the day ends.&rdquo;
              </p>
              <span className="block mt-3 text-xs uppercase tracking-wider text-[#C8782A] font-semibold">
                — Nivoseas Design Philosophy
              </span>
            </div>
          </div>

          {/* Right Column — Editorial Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-[#2A1810]/10 aspect-[4/5] bg-[#E6DACB]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-us-image.webp"
                alt="Nivoseas craftsmanship and lighting showroom in Sector 104, Noida"
                className="w-full h-full object-cover [object-position:center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1810]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] uppercase tracking-widest text-[#FFB45E] font-medium">
                  Experience Center • Sector 104 Noida
                </span>
                <p className="text-sm font-medium text-white/95 mt-1">
                  Handcrafted fixtures, architectural demos, and personalized consultation.
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[#2A1810]/10 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8782A]/10 text-[#C8782A] flex items-center justify-center font-display font-semibold text-lg">
                2Y
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2A1810] leading-tight">Authentic Warranty</p>
                <p className="text-[11px] text-[#4A2C1A]/70">Zero-runaround service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Numbers / Milestones ── */}
      <section className="w-full bg-[#2A1810] text-[#F3EDE4] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFB45E] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-[#E6DACB]/80 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Four Pillars ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8782A]">
            The Nivoseas Difference
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-normal text-[#2A1810] mt-2 tracking-[-0.02em]">
            Built with uncompromising standards.
          </h2>
          <p className="text-sm sm:text-base text-[#4A2C1A]/80 mt-3 leading-relaxed">
            Every luminaire is designed to withstand everyday life while elevating the space it graces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-[24px] p-7 sm:p-9 border border-[#2A1810]/10 hover:border-[#C8782A]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#2A1810]/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#C8782A]/10 text-[#C8782A] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2A1810] mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#4A2C1A]/80 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Architect & Trade Collaboration ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="rounded-[32px] bg-white border border-[#2A1810]/10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-lg shadow-[#2A1810]/5">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8782A]">
              Trade & Architect Desk
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2A1810] leading-tight">
              Are you an architect, interior designer, or developer?
            </h2>
            <p className="text-sm sm:text-base text-[#4A2C1A]/80 leading-relaxed">
              We collaborate closely with architectural studios across India. We provide CAD dimensions, custom suspension drops, IES photometric files, and sample demonstrations at your project site or in our Noida experience studio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/contact"
              className="btn-3d btn-3d-dark px-7 py-3.5 text-xs font-semibold rounded-full text-center flex items-center justify-center gap-2"
            >
              <span>Contact Our Trade Desk</span>
              <FiArrowRight className="text-sm" />
            </Link>
            <Link
              href="/products"
              className="btn-3d btn-3d-outline px-7 py-3.5 text-xs font-semibold rounded-full text-center"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
