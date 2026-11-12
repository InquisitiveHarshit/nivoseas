"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiPhone,
} from "react-icons/fi";
import { PRODUCTS, Product } from "@/data/products";

export default function Header() {
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeProductCategory, setActiveProductCategory] = useState<string>("decorative");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Group products by category
  const productCategories: Record<
    string,
    { name: string; slug: string; products: Product[] }
  > = {
    decorative: {
      name: "Decorative Lights",
      slug: "decorative",
      products: PRODUCTS.filter((p) => p.category === "decorative"),
    },
    "outdoor-gate": {
      name: "Outdoor & Gate Lights",
      slug: "outdoor-gate",
      products: PRODUCTS.filter((p) => p.category === "outdoor-gate"),
    },
    "architectural-led": {
      name: "Architectural LED",
      slug: "architectural-led",
      products: PRODUCTS.filter((p) => p.category === "architectural-led"),
    },
    "led-fans": {
      name: "LED Ceiling Fans",
      slug: "led-fans",
      products: PRODUCTS.filter((p) => p.category === "led-fans"),
    },
  };

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const openWhatsApp = () => {
    window.open("https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20would%20like%20to%20enquire%20about%20your%20lighting%20products.", "_blank");
  };

  return (
    <>
      {/* ── Sticky Rounded Header Island ── */}
      <header
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-7xl transition-all duration-300 rounded-[20px] sm:rounded-[24px] ${
          isScrolled || activeDropdown
            ? "bg-[#F3EDE4]/95 backdrop-blur-md shadow-xl shadow-[#2A1810]/10 border border-[#2A1810]/10"
            : "bg-[#F3EDE4] shadow-md shadow-[#2A1810]/8 border border-[#2A1810]/8"
        }`}
      >
        <div className="px-4 sm:px-7 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* ── Logo ── */}
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

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center space-x-7">
              <Link
                href="/"
                className="relative group text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2"
              >
                <span>Home</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>

              <Link
                href="/#about"
                className="relative group text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2"
              >
                <span>About Us</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>

              <Link
                href="/#collections"
                className="relative group text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2"
              >
                <span>Collections</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>

              {/* ── Products Mega Dropdown (Reference Implementation) ── */}
              <div
                className="relative group"
                onMouseEnter={() => handleMouseEnter("products")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => router.push("/products")}
                  className="flex items-center space-x-1.5 text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2 relative cursor-pointer"
                >
                  <span>Products</span>
                  {activeDropdown === "products" ? (
                    <FiChevronUp className="text-xs" />
                  ) : (
                    <FiChevronDown className="text-xs" />
                  )}
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transition-transform duration-200 ${
                      activeDropdown === "products"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></div>
                </button>

                {activeDropdown === "products" && (
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-[840px] bg-white rounded-2xl shadow-2xl border border-[#2A1810]/10 p-6 mt-3 z-50 text-left"
                    onMouseEnter={() => handleMouseEnter("products")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex">
                      {/* Left Side: Categories sidebar (1/4 width) */}
                      <div className="w-1/4 pr-5 border-r border-[#2A1810]/10 relative">
                        <div className="absolute inset-0 bg-[#F3EDE4]/40 rounded-xl pointer-events-none"></div>

                        <div className="relative z-10">
                          <h3 className="font-semibold text-[#2A1810] px-3 mb-3 text-left font-display text-sm tracking-wide">
                            Categories
                          </h3>
                          <ul className="space-y-1.5">
                            {Object.entries(productCategories).map(([key, category]) => (
                              <li key={key}>
                                <button
                                  type="button"
                                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between ${
                                    activeProductCategory === key
                                      ? "bg-[#F3EDE4] text-[#C8782A] font-semibold border border-[#C8782A] shadow-xs"
                                      : "text-[#2A1810] hover:bg-white hover:shadow-xs font-medium border border-transparent"
                                  }`}
                                  onMouseEnter={() => setActiveProductCategory(key)}
                                  onClick={() => {
                                    router.push("/products");
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <span>{category.name}</span>
                                  <span className="text-[10px] text-[#4A2C1A]/50 font-mono">
                                    {category.products.length}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>

                          {/* Quick Admin link in sidebar */}
                          <div className="mt-6 pt-3 border-t border-[#2A1810]/8 px-3">
                            <Link
                              href="/admin"
                              onClick={() => setActiveDropdown(null)}
                              className="text-[11px] text-[#4A2C1A]/70 hover:text-[#C8782A] font-medium flex items-center gap-1.5"
                            >
                              <span>+</span>
                              <span>Add New Product (Admin)</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Products Grid (3/4 width) */}
                      <div className="w-3/4 pl-6">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#2A1810]/5">
                          <div>
                            <h3 className="font-semibold text-[#2A1810] font-display text-base">
                              {productCategories[activeProductCategory]?.name}
                            </h3>
                            <p className="text-[11px] text-[#4A2C1A]/70">
                              Handpicked fixtures engineered for elevated interiors.
                            </p>
                          </div>
                          <Link
                            href="/products"
                            onClick={() => setActiveDropdown(null)}
                            className="text-xs text-[#C8782A] hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <span>View All Catalogue</span>
                            <span>→</span>
                          </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                          {productCategories[activeProductCategory]?.products.map(
                            (product, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  router.push(`/products/${product.slug}`);
                                  setActiveDropdown(null);
                                }}
                                className="text-center p-3 rounded-xl hover:bg-[#F3EDE4]/50 cursor-pointer transition-all border border-gray-100 hover:border-[#C8782A] group/card bg-white shadow-xs flex flex-col justify-between"
                              >
                                <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      product.images[0] ||
                                      "/Minimalist Luxury Chandelier Interior.webp"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/Minimalist Luxury Chandelier Interior.webp";
                                    }}
                                  />
                                </div>
                                <div>
                                  {product.wattage ? (
                                    <p className="text-[10.5px] text-[#C8782A] mb-0.5 font-bold font-mono">
                                      {product.wattage}
                                    </p>
                                  ) : product.subcategory ? (
                                    <p className="text-[10px] text-[#C8782A] mb-0.5 font-medium uppercase tracking-wider">
                                      {product.subcategory}
                                    </p>
                                  ) : null}
                                  <p className="text-xs text-[#2A1810] font-medium line-clamp-2 leading-tight">
                                    {product.name}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#4A2C1A]/70">
                      <span>Have architectural drawings or commercial specifications?</span>
                      <a
                        href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20have%20an%20architectural%20lighting%20requirement."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C8782A] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Consult with Lighting Director on WhatsApp →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/#led-range"
                className="relative group text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2"
              >
                <span>LED Range</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>

              <Link
                href="/admin"
                className="relative group text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2"
              >
                <span>Admin</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>

              <Link
                href="/#contact"
                className="relative group text-[#2A1810] hover:text-[#C8782A] text-[14px] font-medium py-2"
              >
                <span>Contact</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#C8782A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>
            </nav>

            {/* ── Helpline / WhatsApp Button (Right) ── */}
            <div className="flex items-center space-x-3">
              <button
                onClick={openWhatsApp}
                className="btn-3d btn-3d-dark px-4 py-2 rounded-full flex items-center space-x-2 text-xs font-medium cursor-pointer"
              >
                <FiPhone className="text-sm" />
                <span className="hidden sm:inline">Helpline</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#2A1810] hover:bg-[#2A1810]/5 rounded-lg transition-colors"
                aria-label="Open mobile menu"
              >
                <FiMenu className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar Menu ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2A1810]/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div className="relative w-full max-w-[320px] h-full bg-[#F3EDE4] flex flex-col z-10 border-l border-[#2A1810]/10 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A1810]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-black.svg"
                alt="Nivoseas Logo"
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#2A1810] hover:text-red-600 rounded-lg"
                aria-label="Close menu"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <nav className="p-5 space-y-4 flex-1">
              <Link
                href="/"
                className="block py-2 text-[#2A1810] text-base font-bold border-b border-[#2A1810]/8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Products Accordion */}
              <MobileProductsDropdown
                categories={productCategories}
                onLinkClick={() => setIsMobileMenuOpen(false)}
              />

              <Link
                href="/products"
                className="block py-2 text-[#C8782A] text-base font-bold border-b border-[#2A1810]/8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products Catalogue
              </Link>

              <Link
                href="/#collections"
                className="block py-2 text-[#2A1810] text-base font-bold border-b border-[#2A1810]/8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>

              <Link
                href="/#about"
                className="block py-2 text-[#2A1810] text-base font-bold border-b border-[#2A1810]/8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>

              <Link
                href="/admin"
                className="block py-2 text-[#2A1810] text-base font-bold border-b border-[#2A1810]/8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Portal
              </Link>

              <Link
                href="/#contact"
                className="block py-2 text-[#2A1810] text-base font-bold border-b border-[#2A1810]/8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>

            <div className="p-5 border-t border-[#2A1810]/10">
              <button
                onClick={openWhatsApp}
                className="btn-3d btn-3d-dark w-full py-3 rounded-full flex items-center justify-center space-x-2 text-xs font-semibold"
              >
                <FiPhone className="text-base" />
                <span>Helpline / WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Mobile Products Dropdown Accordion Component ──
function MobileProductsDropdown({
  categories,
  onLinkClick,
}: {
  categories: Record<string, { name: string; slug: string; products: Product[] }>;
  onLinkClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>("decorative");

  const handleCategoryClick = (categoryKey: string) => {
    if (openCategory === categoryKey) {
      setOpenCategory(null);
    } else {
      setOpenCategory(categoryKey);
    }
  };

  return (
    <div className="border-b border-[#2A1810]/8 pb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-[#2A1810] text-base font-bold cursor-pointer"
      >
        <span>Products</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {isOpen && (
        <div className="pl-3 mt-2 space-y-2">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="border-l-2 border-[#C8782A]/30 pl-3">
              <button
                onClick={() => handleCategoryClick(key)}
                className="flex items-center justify-between w-full py-2 text-sm text-[#2A1810] font-semibold hover:text-[#C8782A] cursor-pointer"
              >
                <span>{category.name}</span>
                {openCategory === key ? (
                  <FiChevronUp size={13} />
                ) : (
                  <FiChevronDown size={13} />
                )}
              </button>

              {openCategory === key && (
                <div className="pl-2 mt-1 space-y-2 pb-2">
                  {category.products.map((product, index) => (
                    <Link
                      key={index}
                      href={`/products/${product.slug}`}
                      className="block py-1 text-xs text-[#4A2C1A] hover:text-[#C8782A] truncate"
                      onClick={onLinkClick}
                    >
                      • {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
