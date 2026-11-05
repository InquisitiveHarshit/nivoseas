export default function Craftsmanship() {
  const STEPS = [
    {
      number: "01",
      title: "Energy-efficient LED",
      body: "Every fixture uses quality LED emitters — lower running costs, longer life, and better light for your space.",
    },
    {
      number: "02",
      title: "Quality-checked",
      body: "Each product is inspected before it leaves. No shortcuts, no compromises — only lights we'd put in our own homes.",
    },
    {
      number: "03",
      title: "Made in India",
      body: "Proudly designed and sourced for Indian conditions — voltage, climate, and the aesthetic sensibility of Indian interiors.",
    },
    {
      number: "04",
      title: "2-Year Warranty",
      body: "Most products carry a 2-year warranty. We stand behind what we sell — and we're a WhatsApp message away.",
    },
  ];

  return (
    <section className="section-gap w-full bg-[#2A1810] px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-[520px] mb-16 lg:mb-20">
          <p className="text-[13px] uppercase tracking-[0.12em] text-[#C8782A] font-medium mb-4">
            Why Nivoseas
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-normal leading-[1.0] tracking-[-0.025em] text-[#F3EDE4]">
            Built to last.<br />
            <em className="text-[#D9B46C]">Sold with a promise.</em>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative p-7 rounded-[24px] border border-[rgba(243,237,228,0.08)] hover:border-[rgba(243,237,228,0.18)] transition-colors bg-[rgba(243,237,228,0.03)] hover:bg-[rgba(243,237,228,0.06)]"
            >
              {/* Step number — oversized, decorative */}
              <span className="font-display text-[4rem] font-normal leading-none text-[rgba(217,180,108,0.15)] block mb-4 select-none">
                {step.number}
              </span>
              <h3 className="text-[16px] font-medium text-[#F3EDE4] mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-[13px] font-normal leading-relaxed text-[rgba(243,237,228,0.6)]">
                {step.body}
              </p>
              {/* Hairline connector (desktop only) */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[1px] bg-[rgba(243,237,228,0.1)]" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-16 lg:mt-20 pt-10 border-t border-[rgba(243,237,228,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[13px] font-normal text-[rgba(243,237,228,0.5)] uppercase tracking-wider">
              Minimum order quantity
            </p>
            <p className="text-[22px] font-display font-normal text-[#F3EDE4] leading-tight">
              1 piece — no bulk order required.
            </p>
          </div>
          <a
            href="https://wa.me/919990179666"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-3d-amber text-[13px] font-medium px-6 py-3"
          >
            Talk to us on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}

