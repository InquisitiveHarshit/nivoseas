"use client";

import Hero from "@/components/Hero";
import Intro from "@/components/sections/Intro";
import Collections from "@/components/sections/Collections";
import Catalogue from "@/components/sections/Catalogue";
import Craftsmanship from "@/components/sections/Craftsmanship";
import Brands from "@/components/sections/Brands";
import Enquiry from "@/components/sections/Enquiry";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#F3EDE4] text-[#2A1810] font-sans">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Intro / About */}
      <Intro />

      {/* 3. Four Collections */}
      <Collections />

      {/* 4. Full Catalogue */}
      <Catalogue />

      {/* 5. Craftsmanship & Values */}
      <Craftsmanship />

      {/* 6. Partner Brands (Panasonic & GM) */}
      <Brands />

      {/* 7. WhatsApp Enquiry & Contact */}
      <Enquiry />
    </div>
  );
}

