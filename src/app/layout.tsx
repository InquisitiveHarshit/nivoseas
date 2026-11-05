import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F3EDE4",
};

export const metadata: Metadata = {
  title: "Nivoseas Lighting | Modern & Decorative Lighting — Noida",
  description:
  "Nivoseas Lighting LLP — chandeliers, gate lights, architectural LED panels and LED fans for homes, offices and commercial spaces. Energy-efficient, made in India. Experience center in Sector 104, Noida.",
  keywords: [
    "chandelier",
    "gate light",
    "LED panel",
    "decorative lighting",
    "Noida",
    "Delhi NCR",
    "Nivoseas",
  ],
  openGraph: {
    title: "Nivoseas Lighting | Modern & Decorative Lighting — Noida",
    description:
      "Modern, elegant and functional lighting solutions for homes, offices and commercial spaces.",
    url: "https://nivoseas.com",
    siteName: "Nivoseas Lighting LLP",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className="h-full">
        <head>
          {/* Google Fonts: Schibsted Grotesk, Fraunces, and Inter */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          {/* LocalBusiness JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "Nivoseas Lighting LLP",
                description:
                  "Modern, elegant and functional lighting solutions for homes, offices and commercial spaces.",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Khasra No 514, Sector 104",
                  addressLocality: "Noida",
                  addressRegion: "UP",
                  postalCode: "201301",
                  addressCountry: "IN",
                },
                telephone: "+91-9990179666",
                email: "nivoseasLLP@gmail.com",
                url: "https://nivoseas.com",
                priceRange: "₹₹",
                openingHours: "Mo-Sa 10:00-19:00",
              }),
            }}
          />
        </head>
            <body className="min-h-full flex flex-col bg-[#F3EDE4] text-[#2A1810] font-sans antialiased">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </body>
          </html>
          );
}
