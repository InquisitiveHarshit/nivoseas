export default function Enquiry() {
  return (
    <section
      id="contact"
      className="section-gap w-full bg-[#F3EDE4] px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">

        {/* CTA block */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#2A1810] p-10 sm:p-16 lg:p-20 mb-12">
          <div className="relative z-10 max-w-[600px]">
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#C8782A] font-medium mb-4">
              Get in touch
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-normal leading-[0.95] tracking-[-0.03em] text-[#F3EDE4] mb-6">
              Every room deserves the right light.<br />
              <em className="text-[#D9B46C]">Let&rsquo;s find yours.</em>
            </h2>
            <p className="text-[15px] font-normal leading-relaxed text-[rgba(243,237,228,0.65)] mb-10 max-w-[420px]">
              Visit our experience center in Sector 104, Noida — or enquire directly on WhatsApp. We respond within the hour.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%27d%20like%20to%20enquire%20about%20your%20lighting%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-amber text-[13px] font-medium px-6 py-3.5 gap-2.5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12.004 2C6.478 2 2 6.478 2 12.004a9.994 9.994 0 0 0 1.388 5.139L2 22l4.978-1.368A10.003 10.003 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2z" />
                </svg>
                <span>WhatsApp Enquiry</span>
              </a>
              <a
                href="tel:+919990179666"
                className="btn-3d btn-3d-glass text-[#F3EDE4] text-[13px] font-medium px-6 py-3.5 gap-2"
              >
                +91 99901 79666
              </a>
            </div>
          </div>
        </div>

        {/* Contact info row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Experience Center", value: "Khasra No 514, Sector 104, Noida, UP 201301", href: "https://maps.google.com/?q=Sector+104+Noida" },
            { label: "Call or WhatsApp", value: "+91 99901 79666", href: "tel:+919990179666" },
            { label: "Email", value: "nivoseasLLP@gmail.com", href: "mailto:nivoseasLLP@gmail.com" },
          ].map((info) => (
            <a
              key={info.label}
              href={info.href}
              target={info.href.startsWith("http") ? "_blank" : undefined}
              rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="p-6 rounded-[20px] border border-[rgba(42,24,16,0.10)] hover:border-[rgba(42,24,16,0.25)] bg-white transition-all duration-200 group"
            >
              <p className="text-[11px] uppercase tracking-wider font-medium text-[#C8782A] mb-2">{info.label}</p>
              <p className="text-[14px] font-normal text-[#2A1810] leading-snug group-hover:text-[#4A2C1A]">{info.value}</p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

