export default function Brands() {
  return (
    <section
      id="led-range"
      className="section-gap w-full bg-[#E6DACB] px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-[13px] uppercase tracking-[0.12em] text-[#C8782A] font-medium mb-4">
          Brand partnerships
        </p>
        <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-normal leading-[1.0] tracking-[-0.025em] text-[#2A1810] mb-14 max-w-[460px]">
          Precision engineered.<br />
          <em>Name you can trust.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Panasonic */}
          <div className="relative overflow-hidden rounded-[28px] border border-[rgba(42,24,16,0.10)] bg-white p-10 sm:p-14 flex flex-col justify-between min-h-[280px] group hover:border-[rgba(42,24,16,0.2)] transition-all duration-300">
            <div>
              <span className="font-display text-[clamp(2.8rem,7vw,5rem)] font-normal leading-none tracking-[-0.04em] text-[#2A1810] block mb-2">
                Panasonic
              </span>
              <span className="text-[13px] font-normal text-[#6b5f55] uppercase tracking-wider">
                36 products · COB Down Lights · Surface Panels
              </span>
            </div>
            <div className="mt-8 space-y-2">
              {["COB Down Light 7W — 25,000h lamp life, aluminium swivel", "Surface LED Panel Light 6W — slim, uniform diffusion"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 mt-2 rounded-full bg-[#C8782A] shrink-0" />
                  <p className="text-[13px] font-normal text-[#6b5f55]">{item}</p>
                </div>
              ))}
            </div>
            <a
              href="#catalogue"
              className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-[#2A1810] hover:text-[#C8782A] transition-colors"
            >
              View Panasonic range
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                <path d="M2 10 L10 2 M4 2 L10 2 L10 8" />
              </svg>
            </a>
          </div>

          {/* GM */}
          <div className="relative overflow-hidden rounded-[28px] border border-[rgba(42,24,16,0.10)] bg-[#2A1810] p-10 sm:p-14 flex flex-col justify-between min-h-[280px] group hover:border-[rgba(243,237,228,0.2)] transition-all duration-300">
            <div>
              <span className="font-display text-[clamp(2.8rem,7vw,5rem)] font-normal leading-none tracking-[-0.04em] text-[#F3EDE4] block mb-2">
                GM
              </span>
              <span className="text-[13px] font-normal text-[rgba(243,237,228,0.5)] uppercase tracking-wider">
                15 products · Down Lights · Panels · Spots
              </span>
            </div>
            <div className="mt-8 space-y-2">
              {["Cino LED Down Light 6W/18W — 3000K, aluminium, 2yr warranty", "Yolo Slim Panel 15W — 6500K cool white", "9W LED Spot Festo — precision accent lighting"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 mt-2 rounded-full bg-[#D9B46C] shrink-0" />
                  <p className="text-[13px] font-normal text-[rgba(243,237,228,0.65)]">{item}</p>
                </div>
              ))}
            </div>
            <a
              href="#catalogue"
              className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-[#D9B46C] hover:text-[#FFB45E] transition-colors"
            >
              View GM range
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                <path d="M2 10 L10 2 M4 2 L10 2 L10 8" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

