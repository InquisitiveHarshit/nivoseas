"use client";

import { PRODUCTS } from "@/data/products";
import { useState } from "react";
import ParallaxImage from "@/components/ui/ParallaxImage";

const CATEGORIES_FILTER = [
  { id: "all", label: "All" },
  { id: "decorative", label: "Decorative" },
  { id: "outdoor-gate", label: "Outdoor & Gate" },
  { id: "architectural-led", label: "Architectural LED" },
  { id: "led-fans", label: "LED Fans" },
];

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.478 2 2 6.478 2 12.004a9.994 9.994 0 0 0 1.388 5.139L2 22l4.978-1.368A10.003 10.003 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.188a8.183 8.183 0 0 1-4.17-1.141l-.299-.178-3.095.851.822-3.012-.195-.308A8.19 8.19 0 0 1 3.822 12 8.188 8.188 0 0 1 12.004 3.81c4.509 0 8.182 3.673 8.182 8.19 0 4.515-3.673 8.188-8.182 8.188z" />
    </svg>
  );
}

export default function Catalogue() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeFilter);

  function buildWALink(productName: string, productId: string) {
    const msg = encodeURIComponent(
      `Hi Nivoseas, I'd like to enquire about: ${productName} (ID: ${productId}). Please share availability and pricing.`
    );
    return `https://wa.me/919990179666?text=${msg}`;
  }

  return (
    <section
      id="catalogue"
      className="section-gap w-full bg-[#F3EDE4] px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#C8782A] font-medium mb-3">
              Full catalogue
            </p>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-normal leading-[1.0] tracking-[-0.025em] text-[#2A1810]">
              150+ products.<br />
              <em>One enquiry away.</em>
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES_FILTER.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`btn-3d text-[12px] font-medium px-4 py-2 rounded-full ${activeFilter === cat.id
                  ? "btn-3d-dark"
                  : "btn-3d-outline"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid — asymmetric, varied card heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => {
            const isWide = i % 7 === 0; // Every 7th card is wider
            return (
              <div
                key={product.id}
                className={`group relative flex flex-col rounded-[28px] border border-[rgba(42,24,16,0.08)] hover:border-[rgba(42,24,16,0.2)] bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/08 ${isWide ? "sm:col-span-2" : ""}`}
              >
                {/* Image area with smooth scroll parallax */}
                <div className="card-img-mask relative overflow-hidden rounded-[28px] rounded-b-none">
                  <ParallaxImage
                    src={product.images[0]}
                    alt={product.name}
                    aspectRatio={isWide ? "2.2/1" : "1/1"}
                    speed={16}
                    scale={1.12}
                    className="w-full h-full"
                  />
                  {/* Fallback placeholder */}
                    <div className="absolute inset-0 bg-[#E6DACB] flex items-center justify-center -z-10">
                      <span className="text-[#C8782A] opacity-30">
                        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-12 h-12" aria-hidden="true">
                          <circle cx="24" cy="18" r="8" />
                          <path d="M24 10 L24 2" />
                          <path d="M24 34 L24 38" />
                          <path d="M15 20 Q16 30 24 34 Q32 30 33 20" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5">
                    {product.subcategory && (
                      <span className="text-[10px] uppercase tracking-wider font-medium text-[#C8782A] mb-1.5">
                        {product.subcategory}
                      </span>
                    )}
                    <h3 className="text-[14px] font-medium leading-snug text-[#2A1810] mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.tagline && (
                      <p className="text-[12px] text-[#6b5f55] font-normal mb-3 line-clamp-1">{product.tagline}</p>
                    )}

                    {/* Key spec pills */}
                    {(product.wattage || product.warranty || product.colourTemp) && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.wattage && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(42,24,16,0.06)] text-[#4A2C1A] border border-[rgba(42,24,16,0.08)]">
                            {product.wattage}
                          </span>
                        )}
                        {product.colourTemp && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(42,24,16,0.06)] text-[#4A2C1A] border border-[rgba(42,24,16,0.08)]">
                            {product.colourTemp}
                          </span>
                        )}
                        {product.warranty && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(200,120,42,0.1)] text-[#C8782A] border border-[rgba(200,120,42,0.2)]">
                            {product.warranty}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Enquire CTA */}
                    <div className="mt-auto pt-2">
                      <a
                        href={buildWALink(product.name, product.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d btn-3d-white w-full py-2 px-3 text-[12px] font-medium text-[#2A1810] gap-2"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Enquire on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
                );
        })}
              </div>

      {/* Bottom CTA */ }
            <div className="mt-12 text-center">
              <p className="text-[14px] text-[#6b5f55] mb-4">
                Don&rsquo;t see what you need? We carry 150+ SKUs — just ask.
              </p>
              <a
                href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20am%20looking%20for%20a%20specific%20lighting%20product.%20Can%20you%20help%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-dark px-7 py-3.5 text-sm gap-2.5"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>

    </div>
    </section >
  );
}

