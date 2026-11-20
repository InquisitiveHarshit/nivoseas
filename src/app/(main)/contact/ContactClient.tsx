"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheck,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.478 2 2 6.478 2 12.004a9.994 9.994 0 0 0 1.388 5.139L2 22l4.978-1.368A10.003 10.003 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.188a8.183 8.183 0 0 1-4.17-1.141l-.299-.178-3.095.851.822-3.012-.195-.308A8.19 8.19 0 0 1 3.822 12 8.188 8.188 0 0 1 12.004 3.81c4.509 0 8.182 3.673 8.182 8.19 0 4.515-3.673 8.188-8.182 8.188z" />
    </svg>
  );
}

const FAQS = [
  {
    question: "Can chandelier drop heights be customized for high or double-height ceilings?",
    answer:
      "Yes. Most of our hanging chandeliers and pendant clusters include adjustable suspension wires (from 52 inches up to 90+ inches). For grand duplexes and double-height foyers (15–25 feet), we provide custom extended suspension kits and load cables upon request.",
  },
  {
    question: "Can I see the fixtures in person before buying?",
    answer:
      "We encourage it! Our experience center in Sector 104, Noida is designed so you can observe the real crystal refractive sparkle, inspect metal finishes, and test multi-tone tunable LED temperatures (warm white, daylight, and natural white).",
  },
  {
    question: "Do you ship across India, and how are fragile crystal lights packed?",
    answer:
      "We ship pan-India with specialized multi-layer foam packing, individually nested crystal elements, and reinforced outer wooden crates. We guarantee safe arrival with complete transit insurance.",
  },
  {
    question: "What is your warranty policy?",
    answer:
      "All Nivoseas luminaires come with an authentic 2-Year Direct Warranty. This covers LED drivers, internal diodes, colour-tuning circuitry, and electroplated metal finishes against premature tarnishing.",
  },
  {
    question: "Do you collaborate with architects and interior designers?",
    answer:
      "Yes, over 60% of our projects are architect-led. We provide full technical specification sheets, CAD drop diagrams, BOQ discounting for bulk procurement, and on-site mockups across Delhi NCR.",
  },
];

export default function ContactClient() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "Residential Villa / Apartment",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim()) return;

    // Asynchronously capture the lead in the backend store
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        projectType: formState.projectType,
        message: formState.message,
        source: "contact-form",
      }),
    }).catch((err) => console.warn("Lead save error:", err));

    // Build pre-filled WhatsApp message
    const text = `*New Lighting Inquiry via Nivoseas Website*%0A%0A*Name:* ${encodeURIComponent(
      formState.name
    )}%0A*Phone:* ${encodeURIComponent(formState.phone)}%0A*Email:* ${encodeURIComponent(
      formState.email || "Not specified"
    )}%0A*Project Type:* ${encodeURIComponent(
      formState.projectType
    )}%0A*Message / Requirement:* ${encodeURIComponent(formState.message || "Please connect with me regarding luminaire catalog and pricing.")}`;

    window.open(`https://wa.me/919990179666?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F3EDE4] text-[#2A1810] pt-28 pb-20 selection:bg-[#C8782A] selection:text-white">
      {/* ── Header ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-16 border-b border-[#2A1810]/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#4A2C1A]/70 mb-6">
          <Link href="/" className="hover:text-[#2A1810] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C8782A] font-medium">Contact Atelier</span>
        </div>

        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C8782A]">
            Direct Consultation • Sector 104, Noida
          </span>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.025em] text-[#2A1810] mt-3 leading-[1.08]">
            Let&apos;s illuminate your space together.
          </h1>
          <p className="text-base sm:text-lg text-[#4A2C1A]/85 mt-6 leading-relaxed font-normal">
            Have questions about chandelier dimensions, need technical photometric data, or want to visit our experience center in Noida? We are always glad to connect.
          </p>
        </div>
      </section>

      {/* ── Four Direct Channels ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Phone & WhatsApp */}
          <div className="bg-white rounded-[24px] p-6 border border-[#2A1810]/10 hover:border-[#C8782A]/40 transition-all shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#C8782A]/10 text-[#C8782A] flex items-center justify-center mb-4">
              <FiPhone className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#C8782A] font-semibold">
              Helpline & WhatsApp
            </span>
            <p className="text-base font-semibold text-[#2A1810] mt-1 mb-2">
              +91 99901 79666
            </p>
            <p className="text-xs text-[#4A2C1A]/70 mb-4">
              Instant assistance for catalog pricing, sizing, and stock status.
            </p>
            <a
              href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20have%20an%20enquiry%20regarding%20your%20lighting%20fixtures."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C8782A] hover:underline inline-flex items-center gap-1.5"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp →</span>
            </a>
          </div>

          {/* 2. Experience Center */}
          <div className="bg-white rounded-[24px] p-6 border border-[#2A1810]/10 hover:border-[#C8782A]/40 transition-all shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#C8782A]/10 text-[#C8782A] flex items-center justify-center mb-4">
              <FiMapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#C8782A] font-semibold">
              Experience Center
            </span>
            <p className="text-base font-semibold text-[#2A1810] mt-1 mb-2">
              Sector 104, Noida
            </p>
            <p className="text-xs text-[#4A2C1A]/70 mb-4">
              Uttar Pradesh 201301. Live chandelier gallery and architectural LED displays.
            </p>
            <a
              href="https://maps.google.com/?q=Sector+104+Noida"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C8782A] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Get Directions</span>
              <FiExternalLink className="text-xs" />
            </a>
          </div>

          {/* 3. Email Inquiries */}
          <div className="bg-white rounded-[24px] p-6 border border-[#2A1810]/10 hover:border-[#C8782A]/40 transition-all shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#C8782A]/10 text-[#C8782A] flex items-center justify-center mb-4">
              <FiMail className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#C8782A] font-semibold">
              Email Desk
            </span>
            <p className="text-base font-semibold text-[#2A1810] mt-1 mb-2 break-all">
              nivoseasLLP@gmail.com
            </p>
            <p className="text-xs text-[#4A2C1A]/70 mb-4">
              Send drawings, floor plans, and BOQs for architectural estimates.
            </p>
            <a
              href="mailto:nivoseasLLP@gmail.com"
              className="text-xs font-semibold text-[#C8782A] hover:underline inline-flex items-center gap-1"
            >
              <span>Write Email →</span>
            </a>
          </div>

          {/* 4. Atelier Hours */}
          <div className="bg-white rounded-[24px] p-6 border border-[#2A1810]/10 hover:border-[#C8782A]/40 transition-all shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#C8782A]/10 text-[#C8782A] flex items-center justify-center mb-4">
              <FiClock className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#C8782A] font-semibold">
              Studio Timings
            </span>
            <p className="text-base font-semibold text-[#2A1810] mt-1 mb-2">
              10:30 AM – 7:30 PM
            </p>
            <p className="text-xs text-[#4A2C1A]/70 mb-4">
              Monday through Saturday. Sunday visits available by prior appointment.
            </p>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
              ● Open for Walk-ins
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Form & Trade Desk Section ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-8 sm:p-12 border border-[#2A1810]/10 shadow-lg shadow-[#2A1810]/5">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8782A]">
              Direct Project Inquiry
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#2A1810] mt-2 mb-3">
              Tell us about your lighting vision
            </h2>
            <p className="text-xs sm:text-sm text-[#4A2C1A]/75 mb-8">
              Fill out this quick brief and our lighting consultant will get back to you with pricing, recommendations, and custom sizing options.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <FiCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-emerald-950 font-medium">
                  Inquiry Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Your message has opened on WhatsApp. If you need any immediate assistance, you can also dial us directly at{" "}
                  <strong>+91 99901 79666</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810] mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full px-4 py-3 rounded-xl border border-[#2A1810]/15 bg-[#F3EDE4]/30 focus:bg-white focus:border-[#C8782A] focus:outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810] mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[#2A1810]/15 bg-[#F3EDE4]/30 focus:bg-white focus:border-[#C8782A] focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810] mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="vikram@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#2A1810]/15 bg-[#F3EDE4]/30 focus:bg-white focus:border-[#C8782A] focus:outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810] mb-2">
                      Project Nature
                    </label>
                    <select
                      value={formState.projectType}
                      onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#2A1810]/15 bg-[#F3EDE4]/30 focus:bg-white focus:border-[#C8782A] focus:outline-none text-sm transition-all"
                    >
                      <option>Residential Villa / Penthouse</option>
                      <option>Apartment Living & Dining</option>
                      <option>Architect / Interior Design Firm</option>
                      <option>Commercial / Hospitality Project</option>
                      <option>Outdoor & Gate Lanterns</option>
                      <option>Custom Chandelier Drop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810] mb-2">
                    How Can We Help? (Fixture, Room, Ceiling Height)
                  </label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us about your room size, ceiling height, preferred finishes (rose gold, crystal, black), or product models you are interested in..."
                    className="w-full px-4 py-3 rounded-xl border border-[#2A1810]/15 bg-[#F3EDE4]/30 focus:bg-white focus:border-[#C8782A] focus:outline-none text-sm transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-3d btn-3d-dark w-full py-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
                <p className="text-[11px] text-center text-[#4A2C1A]/60">
                  Instant response • No spam • Direct conversation with our Noida lighting team
                </p>
              </form>
            )}
          </div>

          {/* Right Info Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[32px] bg-[#2A1810] text-[#F3EDE4] p-8 sm:p-10 border border-[#C8782A]/30 space-y-5">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#FFB45E]">
                Architect & Designer Desk
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-normal leading-snug">
                Working on an architectural floorplan or bespoke villa?
              </h3>
              <p className="text-xs sm:text-sm text-[#E6DACB]/85 leading-relaxed">
                Send us your CAD drawings or luminaire schedules. We provide photometric lighting simulations, custom drop calculations, dimming protocols (0–10V / DALI / Phase-cut), and trade tier pricing.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:nivoseasLLP@gmail.com?subject=Architectural%20Trade%20Inquiry%20-%20Nivoseas"
                  className="btn-3d btn-3d-white text-xs font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2"
                >
                  <FiMail className="text-sm text-[#2A1810]" />
                  <span>Email Plans to Trade Desk</span>
                </a>
              </div>
            </div>

            {/* Visit Note */}
            <div className="rounded-[28px] bg-white p-7 border border-[#2A1810]/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C8782A] uppercase tracking-wider">
                <FiMapPin className="text-sm" />
                <span>Visiting Our Experience Center</span>
              </div>
              <p className="text-xs sm:text-sm text-[#4A2C1A]/80 leading-relaxed font-normal">
                Located conveniently in Sector 104, Noida with dedicated parking. We recommend notifying us 30 minutes in advance so our lighting consultant can have relevant fixtures and colour temperature demos pre-configured for your visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8782A]">
            Quick Answers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#2A1810] mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-[#2A1810]/10 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-[#2A1810]">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    className={`text-base text-[#C8782A] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#4A2C1A]/80 leading-relaxed border-t border-[#2A1810]/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
