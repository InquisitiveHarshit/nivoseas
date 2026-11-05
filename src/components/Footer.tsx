"use client";

import Link from "next/link";
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from "react-icons/fi";

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
      <line x1="6" y1="6" x2="54" y2="6" strokeWidth="2.6" />
      <line x1="12" y1="10" x2="48" y2="10" strokeWidth="1.8" />
      <line x1="16" y1="10" x2="16" y2="26" strokeWidth="1.6" />
      <path d="M10 26 L22 26 L16 20 Z" fill="currentColor" />
      <circle cx="16" cy="31" r="3.2" strokeWidth="1.8" fill="none" />
      <line x1="30" y1="10" x2="30" y2="33" strokeWidth="1.6" />
      <path d="M24 33 L36 33 L30 27 Z" fill="currentColor" />
      <circle cx="30" cy="38" r="3.2" strokeWidth="1.8" fill="none" />
      <line x1="44" y1="10" x2="44" y2="26" strokeWidth="1.6" />
      <path d="M38 26 L50 26 L44 20 Z" fill="currentColor" />
      <circle cx="44" cy="31" r="3.2" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

const COLLECTIONS = [
  { label: "Decorative Lights", href: "#decorative" },
  { label: "Outdoor & Gate Lights", href: "#outdoor-gate" },
  { label: "Architectural LED", href: "#architectural-led" },
  { label: "LED Fans", href: "#led-fans" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Collections", href: "#collections" },
  { label: "Catalogue", href: "#catalogue" },
  { label: "Contact Atelier", href: "#contact" },
];

export default function Footer() {
  return (
              <footer className="w-full bg-[#1e110a] text-[#E6DACB] border-t border-[rgba(243,237,228,0.08)]">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[rgba(243,237,228,0.08)]">
                    {/* Brand info */}
                    <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-black.svg"
                alt="Nivoseas Lighting"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
                        <p className="text-[13.5px] font-normal leading-relaxed text-[#c4b5a5] max-w-[380px]">
                          Modern, elegant and functional lighting solutions for homes, offices and commercial spaces across Delhi NCR. Handcrafted chandeliers, gate lights, architectural LED panels and LED fans.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <a
                            href="https://www.instagram.com/nivoseas_lighting/?hl=en"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="w-9 h-9 rounded-full bg-[rgba(243,237,228,0.08)] hover:bg-[#C8782A] text-[#F3EDE4] flex items-center justify-center transition-colors"
                          >
                            <FiInstagram className="text-sm" />
                          </a>
                          <a
                            href="https://www.facebook.com/people/Nivoseas-Lighting/61586003632599/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="w-9 h-9 rounded-full bg-[rgba(243,237,228,0.08)] hover:bg-[#C8782A] text-[#F3EDE4] flex items-center justify-center transition-colors"
                          >
                            <FiFacebook className="text-sm" />
                          </a>
                        </div>
                    </div>

                              {/* Collections */}
                              <div className="lg:col-span-3 space-y-3">
                                <h4 className="text-[12px] font-medium uppercase tracking-widest text-[#FFB45E]">
                                  Collections
                                </h4>
                                <ul className="space-y-2 text-[13.5px] font-normal text-[#c4b5a5]">
                                  {COLLECTIONS.map((c) => (
                                    <li key={c.label}>
                                      <Link href={c.href} className="hover:text-[#F3EDE4] transition-colors">
                                        {c.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                                        {/* Quick links */}
                                        <div className="lg:col-span-2 space-y-3">
                                          <h4 className="text-[12px] font-medium uppercase tracking-widest text-[#FFB45E]">
                                            Navigation
                                          </h4>
                                          <ul className="space-y-2 text-[13.5px] font-normal text-[#c4b5a5]">
                                            {QUICK_LINKS.map((q) => (
                                              <li key={q.label}>
                                                <Link href={q.href} className="hover:text-[#F3EDE4] transition-colors">
                                                  {q.label}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>

                                                {/* Contact Details */}
                                                <div className="lg:col-span-2 space-y-3">
                                                  <h4 className="text-[12px] font-medium uppercase tracking-widest text-[#FFB45E]">
                                                    Atelier
                                                  </h4>
                                                  <div className="space-y-2.5 text-[13px] font-normal text-[#c4b5a5]">
                                                    <div className="flex items-start gap-2">
                                                      <FiMapPin className="text-sm text-[#FFB45E] shrink-0 mt-0.5" />
                                                      <span>Sector 104, Noida, UP 201301</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <FiPhone className="text-sm text-[#FFB45E] shrink-0" />
                                                      <a href="tel:+919990179666" className="hover:text-[#F3EDE4]">
                                                        +91 99901 79666
                                                      </a>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        <FiMail className="text-sm text-[#FFB45E] shrink-0" />
                                                        <a href="mailto:nivoseasLLP@gmail.com" className="hover:text-[#F3EDE4]">
                                                          nivoseasLLP@gmail.com
                                                        </a>
                                                </div>
                                              </div>
                                            </div>
                                        </div>

                                          {/* Bottom row */}
                                          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8e8174]">
                                            <p>© 2026 Nivoseas Lighting LLP. All rights reserved.</p>
                                            <div className="flex items-center gap-6">
                                              <span>Minimum order: 1 piece</span>
                                              <span>Made in India</span>
                                              <span>2-Year Warranty</span>
                                            </div>
                                          </div>
                                        </div>
                                      </footer>
                                      );
}
