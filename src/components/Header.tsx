"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiPhone,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── nav data ─────────────────────────────────────────────────────────────────

const productCategories = [
  { label: "Indoor Lighting", href: "/category/indoor-lighting" },
  { label: "Outdoor Lighting", href: "/category/outdoor-lighting" },
  { label: "Decorative Lights", href: "/category/decorative-lights" },
  { label: "Smart Lighting", href: "/category/smart-lighting" },
  { label: "Commercial Lighting", href: "/category/commercial-lighting" },
  { label: "LED Strips & Panels", href: "/category/led-strips-panels" },
];

// ─── component ────────────────────────────────────────────────────────────────

export default function Header() {
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const [isOverlayAnimatingOut, setIsOverlayAnimatingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── dropdown hover ──────────────────────────────────────────────────────────

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  // ── mobile menu open / close ────────────────────────────────────────────────

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsSidebarClosing(false);
      setShowOverlay(true);
      const t = setTimeout(() => setShowSidebar(true), 50);
      return () => clearTimeout(t);
    } else {
      if (showSidebar) {
        setIsSidebarClosing(true);
        const t1 = setTimeout(() => {
          setShowSidebar(false);
          const t2 = setTimeout(() => setShowOverlay(false), 700);
          return () => clearTimeout(t2);
        }, 500);
        return () => clearTimeout(t1);
      } else {
        setShowOverlay(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileMenuOpen]);

  // ── scroll ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCloseMobileMenu = () => {
    setIsSidebarClosing(true);
    setTimeout(() => {
      setShowSidebar(false);
      setIsOverlayAnimatingOut(true);
      setTimeout(() => {
        setIsOverlayAnimatingOut(false);
        setShowOverlay(false);
        setIsMobileMenuOpen(false);
        setIsSidebarClosing(false);
      }, 700);
    }, 500);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/919990179666", "_blank");
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
                src="/logo.png"
                alt="Nivoseas Lighting"
                width={220}
                height={80}
                style={{ width: "auto" }}
                className="h-20 object-contain"
                priority
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className={`relative group font-medium transition-colors duration-300 py-10 ${isScrolled ? "text-gray-800 hover:text-[#C8A55A]" : "text-white hover:text-[#C8A55A]"}`}
              >
                Home
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[2px] bg-[#C8A55A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>

              {/* Products Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => handleMouseEnter("products")}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`flex items-center gap-1 font-medium py-10 relative transition-colors duration-300 ${isScrolled ? "text-gray-800 hover:text-[#C8A55A]" : "text-white hover:text-[#C8A55A]"}`}>
                  <span>Products</span>
                  {activeDropdown === "products" ? <FiChevronUp /> : <FiChevronDown />}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[2px] bg-[#C8A55A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>

                {activeDropdown === "products" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 mt-0 z-50">
                    {productCategories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#C8A55A] transition-colors font-medium"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className={`relative group font-medium transition-colors duration-300 py-10 ${isScrolled ? "text-gray-800 hover:text-[#C8A55A]" : "text-white hover:text-[#C8A55A]"}`}
              >
                About Us
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[2px] bg-[#C8A55A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>

              <Link
                href="/contact"
                className={`relative group font-medium transition-colors duration-300 py-10 ${isScrolled ? "text-gray-800 hover:text-[#C8A55A]" : "text-white hover:text-[#C8A55A]"}`}
              >
                Contact
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[2px] bg-[#C8A55A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={openWhatsApp}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all duration-300 cursor-pointer shadow-sm ${isScrolled
                  ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900"
                  : "bg-white/15 backdrop-blur-sm text-white border-white/40 hover:bg-white hover:text-gray-900 hover:border-white"
                  }`}
              >
                <FiPhone className="text-base" />
                <span className="hidden sm:inline">Helpline</span>
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 transition-colors ${isScrolled ? "text-gray-700 hover:text-[#C8A55A]" : "text-white hover:text-[#C8A55A]"}`}
                aria-label="Open menu"
              >
                <FiMenu className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay + sidebar */}
      {(isMobileMenuOpen || showOverlay || isOverlayAnimatingOut) && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          {(showOverlay || isOverlayAnimatingOut) && (
            <div
              className={`fixed inset-0 bg-gray-900 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${showOverlay && !isOverlayAnimatingOut ? "opacity-60" : "opacity-0"
                }`}
              onClick={handleCloseMobileMenu}
            />
          )}

          {/* Sidebar */}
          {(showSidebar || isSidebarClosing) && (
            <div
              className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-y-auto ${showSidebar && !isSidebarClosing ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
                <Image
                  src="/logo.png"
                  alt="Nivoseas Lighting"
                  width={180}
                  height={64}
                  style={{ width: "auto" }}
                  className="h-16 object-contain"
                />
                <button
                  onClick={handleCloseMobileMenu}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              {/* Sidebar nav */}
              <nav className="px-5 py-6 space-y-1">
                <MobileLink href="/" onClick={handleCloseMobileMenu}>
                  Home
                </MobileLink>
                <MobileCollapsible title="Products" onClose={handleCloseMobileMenu}>
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={handleCloseMobileMenu}
                      className="block py-2 pl-4 text-sm text-gray-600 hover:text-[#C8A55A] transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </MobileCollapsible>
                <MobileLink href="/about" onClick={handleCloseMobileMenu}>
                  About Us
                </MobileLink>
                <MobileLink href="/contact" onClick={handleCloseMobileMenu}>
                  Contact
                </MobileLink>

                {/* CTA in sidebar */}
                <div className="pt-6">
                  <button
                    onClick={() => {
                      handleCloseMobileMenu();
                      openWhatsApp();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors"
                  >
                    <FiPhone />
                    Call Helpline
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-3 text-base font-semibold text-gray-800 hover:text-[#C8A55A] border-b border-gray-100 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileCollapsible({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-base font-semibold text-gray-800 hover:text-[#C8A55A] transition-colors"
      >
        {title}
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {open && <div className="pb-3 space-y-1">{children}</div>}
    </div>
  );
}