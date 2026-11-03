"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";

// ─── data ──────────────────────────────────────────────────────────────────────

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const productLinks = [
  { label: "Indoor Lighting", href: "/category/indoor-lighting" },
  { label: "Outdoor Lighting", href: "/category/outdoor-lighting" },
  { label: "Decorative Lights", href: "/category/decorative-lights" },
  { label: "Smart Lighting", href: "/category/smart-lighting" },
  { label: "Commercial Lighting", href: "/category/commercial-lighting" },
];

// ─── component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Brand column ─────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Nivoseas Lighting"
                width={160}
                height={56}
                style={{ width: "auto" }}
                className="h-14 object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nivoseas Lighting LLP is a premium lighting destination based in
              Sector&nbsp;104, Noida. We specialize in modern, elegant, and
              functional lighting solutions for homes, offices, and commercial
              spaces. Our goal? To light up your world beautifully and
              efficiently.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/nivoseas_lighting/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-[#C8A55A] text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FiInstagram className="text-lg" />
              </a>
              <a
                href="https://www.facebook.com/people/Nivoseas-Lighting/61586003632599/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-[#C8A55A] text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FiFacebook className="text-lg" />
              </a>
            </div>
          </div>

          {/* ── Quick Links ──────────────────────────────────── */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#C8A55A] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A55A] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Products ─────────────────────────────────────── */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Products
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#C8A55A] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A55A] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Information ──────────────────────────── */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contact Information
            </h3>
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#C8A55A] text-lg mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  Khasra No 514, Sector 104,
                  <br />
                  Noida, UP – 201301
                </span>
              </li>

              {/* Phone */}
              <li>
                <a
                  href="tel:+919990179666"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#C8A55A] transition-colors group"
                >
                  <FiPhone className="text-[#C8A55A] text-lg shrink-0" />
                  +91-9990179666
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:nivoseasLLP@gmail.com"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#C8A55A] transition-colors group break-all"
                >
                  <FiMail className="text-[#C8A55A] text-lg shrink-0" />
                  nivoseasLLP@gmail.com
                </a>
              </li>

              {/* Locate Us */}
              <li className="pt-2">
                <a
                  href="https://maps.google.com/?q=Khasra+No+514+Sector+104+Noida+UP+201301"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#C8A55A] border border-[#C8A55A]/40 hover:border-[#C8A55A] px-3 py-1.5 rounded-full transition-colors"
                >
                  <FiMapPin className="text-sm" />
                  Locate Us on Map
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Nivoseas Lighting. All Rights Reserved.</p>
          <p>
            Website designed &amp; maintained by{" "}
            <a
              href="http://www.digisoft.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8A55A] hover:underline"
            >
              Digisoft
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

