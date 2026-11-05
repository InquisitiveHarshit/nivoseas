"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Collections", href: "#collections" },
  { label: "Products", href: "#catalogue" },
  { label: "LED Range", href: "#led-range" },
  { label: "Contact", href: "#contact" },
];

function ChandelierLogoIcon({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {/* Ceiling bar */}
      <line x1="6" y1="6" x2="54" y2="6" strokeWidth="2.6" />
      <line x1="12" y1="10" x2="48" y2="10" strokeWidth="1.8" />

      {/* Left lamp */}
      <line x1="16" y1="10" x2="16" y2="26" strokeWidth="1.6" />
      <path d="M10 26 L22 26 L16 20 Z" fill="currentColor" />
      <circle cx="16" cy="31" r="3.2" strokeWidth="1.8" fill="none" />

      {/* Center lamp */}
      <line x1="30" y1="10" x2="30" y2="33" strokeWidth="1.6" />
      <path d="M24 33 L36 33 L30 27 Z" fill="currentColor" />
      <circle cx="30" cy="38" r="3.2" strokeWidth="1.8" fill="none" />

      {/* Right lamp */}
      <line x1="44" y1="10" x2="44" y2="26" strokeWidth="1.6" />
      <path d="M38 26 L50 26 L44 20 Z" fill="currentColor" />
      <circle cx="44" cy="31" r="3.2" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Floating Rounded Header Island ── */}
      <header
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-7xl transition-all duration-300 rounded-[20px] sm:rounded-[24px] ${isScrolled
          ? "bg-[#F3EDE4]/95 backdrop-blur-md shadow-xl shadow-[#2A1810]/10 border border-[#2A1810]/10"
          : "bg-[#F3EDE4] shadow-md shadow-[#2A1810]/8 border border-[#2A1810]/8"
          }`}
      >
        <div className="px-4 sm:px-7 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* ── Logo — left ── */}
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-85 transition-opacity"
                aria-label="Nivoseas Home"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-black.svg"
                  alt="Nivoseas Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </Link>
            </div>

            {/* ── Nav links — centered ── */}
            <nav className="hidden lg:flex items-center justify-center gap-1 sm:gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-1.5 text-[14px] font-normal text-[#4A2C1A] hover:text-[#2A1810] rounded-full hover:bg-[#2A1810]/5 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Contact Us pill — right ── */}
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20would%20like%20to%20enquire%20about%20your%20lighting%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center btn-3d btn-3d-dark text-[13px] font-medium px-5 py-2 rounded-full whitespace-nowrap"
              >
                Contact Us
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-[#2A1810] hover:bg-[#2A1810]/5 rounded-lg transition-colors"
                aria-label="Open navigation"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2A1810]/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-[300px] h-full bg-[#F3EDE4] flex flex-col z-10 border-l border-[#2A1810]/10 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A1810]/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-black.svg"
                alt="Nivoseas Logo"
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#2A1810] hover:bg-[#2A1810]/5 rounded-lg"
                aria-label="Close menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-6 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3 text-[15px] font-medium text-[#2A1810] border-b border-[#2A1810]/6"
                >
                  <span>{link.label}</span>
                  <span className="text-[#6b5f55] text-xs">→</span>
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-[#2A1810]/8">
              <div className="text-[12px] text-[#6b5f55] mb-4 space-y-1">
                <p className="font-semibold text-[#2A1810]">Nivoseas Experience Center</p>
                <p>Khasra No 514, Sector 104, Noida</p>
                <p>+91 99901 79666</p>
              </div>
              <a
                href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20would%20like%20to%20enquire%20about%20your%20lighting%20products."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center py-3 rounded-full btn-3d btn-3d-dark text-[#F3EDE4] text-[13px] font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
