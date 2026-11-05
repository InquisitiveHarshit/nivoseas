"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ParallaxImage from "@/components/ui/ParallaxImage";

function CounterStat({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="space-y-1">
      <div className="stat-number">
        {value}
        {suffix && <span className="text-[#C8782A]">{suffix}</span>}
      </div>
      <p className="text-[13px] font-normal text-[#6b5f55] uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Simple intersection-observer entrance (no GSAP dependency here) */
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll("[data-reveal]") ?? [];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-gap w-full bg-[#F3EDE4] px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">

        {/* Two-column: text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-28">

          {/* Left — copy */}
          <div
            data-reveal
            style={{ opacity: 0, transform: "translateY(32px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#C8782A] font-medium mb-4">
              Made for Indian homes
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.0] tracking-[-0.025em] text-[#2A1810] mb-6 max-w-[480px]">
              Designed for every room, built for every project.
            </h2>
            <p className="text-[15px] font-normal leading-relaxed text-[#6b5f55] mb-8 max-w-[400px]">
              We specialize in modern, elegant and functional lighting — from drawing-room chandeliers to gate lights and architectural LED. Energy-efficient, made in India, with a 2-year warranty on most products.
            </p>
            <Link
              href="#catalogue"
              className="btn-3d btn-3d-dark px-6 py-3 text-[13.5px] gap-3"
            >
                <span>View All Products</span>
                <span className="w-6 h-6 rounded-full bg-[#F3EDE4] shadow-inner flex items-center justify-center text-[#2A1810] shrink-0">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                    <path d="M2 10 L10 2 M4 2 L10 2 L10 8" />
                  </svg>
                </span>
            </Link>
          </div>

          {/* Right — image with smooth parallax */}
          <div
            data-reveal
            className="card-img-mask h-[340px] sm:h-[420px] lg:h-[480px] shadow-2xl shadow-[#2A1810]/15"
            style={{ opacity: 0, transform: "translateY(32px)", transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s" }}
          >
            <ParallaxImage
              src="/Minimalist Luxury Chandelier Interior.webp"
              alt="Nivoseas modern luxury interior with chandelier"
              aspectRatio="auto"
              className="w-full h-full"
              speed={34}
              scale={1.16}
            />
          </div>
        </div>

        {/* Stats row */}
        <div
          data-reveal
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-[rgba(42,24,16,0.10)]"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s" }}
        >
          <CounterStat value="[18]" suffix="+" label="Years of craft" />
          <CounterStat value="150" suffix="+" label="Products" />
          <CounterStat value="2" suffix=" yr" label="Warranty" />
          <CounterStat value="1" label="Minimum order" />
        </div>

      </div>
    </section>
  );
}

