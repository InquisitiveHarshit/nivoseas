# Nivoseas Lighting LLP

Full-stack e-catalogue, architectural lighting showcase, and admin management platform for **Nivoseas Lighting LLP** (Sector 104, Noida, Uttar Pradesh).

---

## Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js `16.4.3` | App Router, Turbopack (`@tailwindcss/turbopack`), `cacheComponents` & `partialPrefetching` enabled in `next.config.ts` |
| **UI Library** | React `19.3.0` | Server & Client Components with `ProductContext` deduplicated client-side caching |
| **Language** | TypeScript `^5` | Strict typing across models, API routes, data stores, and UI components |
| **Styling** | Tailwind CSS `^4` | `@tailwindcss/postcss` (`^4.3.4`), custom CSS tokens, warm architectural palette (`#F3EDE4`, `#EDE5DA`, `#E6DACB`, `#2A1810`, `#C8782A`, `#D9B46C`) |
| **Typography** | Google Fonts | `Schibsted Grotesk` (sans), `Fraunces` (display serif), and `Inter` |
| **Icons** | `react-icons` (`^5.7.0`) | Feather Icons (`react-icons/fi`) + custom inline SVG icons (WhatsApp, arrows, checkmarks) |
| **Database** | MongoDB + Mongoose (`^9.12.1`) | Cached serverless/hot-reload connection (`src/lib/mongodb.ts`) with `Product`, `Lead`, and `CategoryImage` schemas |
| **Media & CDN** | Cloudinary (`cloudinary ^2.11.0`, `next-cloudinary ^7.0.0`) | `f_auto`, `q_auto`, `dpr_auto`, responsive crop/resize presets (`src/lib/cloudinary.ts`) + direct unsigned upload from Admin |
| **Security & Reliability** | Custom Rate Limiter | Per-IP sliding-window in-memory rate limiting (`src/lib/rate-limit.ts`) returning HTTP `429` with `Retry-After` & `X-RateLimit-*` headers |
| **SEO & Structured Data** | Next.js Metadata API + JSON-LD | OpenGraph tags, viewport config, and `Schema.org` `LocalBusiness` JSON-LD in `src/app/layout.tsx` |
| **Linting** | ESLint `^9` (`eslint-config-next 16.4.3`) | Next.js recommended lint rules |

> **Note on Dependencies:** `gsap`, `@gsap/react`, `lenis`, and `zod` are listed in `package.json`, while current UI reveals and scrolling use native CSS transitions, `IntersectionObserver` (`Intro.tsx`), and `data-scroll-behavior="smooth"`.

---

## Website Features

### 1. Navigation & Global Shell (`src/components/Header.tsx`, `src/components/Footer.tsx`)
- **Architectural Mega-Menu Header:** Interactive dropdowns grouping live products from `ProductContext` across 7 categories (`Decorative`, `Indoor Lighting`, `Outdoor & Gate`, `Commercial`, `Architectural LED`, `LED Fans`, `Brands`).
- **Responsive Mobile Drawer:** Full-screen slide-over navigation with collapsible category hierarchies and direct WhatsApp studio helpline (`+91 99901 79666`).
- **Scroll-Aware Styling:** Sticky header state transitions on scroll.
- **Footer:** Quick links (`/collections`, `/products`, `/about`, `/contact`), showroom address, contact info, and business hours.

### 2. Homepage (`src/app/(main)/page.tsx`)
1. **Hero (`Hero.tsx`):** Full-bleed responsive banner (`/bannerbg.webp` on desktop, `/mobilebanner.webp` on mobile) with warm golden radial lighting scrim, champagne gold typography, primary **Explore Collections** CTA, and direct **WhatsApp Enquiry** CTA.
2. **Intro / About (`Intro.tsx`):** IntersectionObserver scroll-reveal introduction with parallax imagery (`ParallaxImage.tsx`) and studio stats.
3. **Collections Preview (`Collections.tsx`):** 7-category showcase grid with warm background photography (`opacity-50` + minimal warm gradient) and dark espresso typography. Clicking any card navigates directly to `/products?category=<slug>`.
4. **Full Catalogue Preview (`Catalogue.tsx`):** Interactive category filter pills (`All`, `Decorative`, `Outdoor & Gate`, `Architectural LED`, `LED Fans`), product cards, and pre-filled per-product WhatsApp enquiry links.
5. **Craftsmanship & Values (`Craftsmanship.tsx`):** 4-pillar brand promise cards (*Energy-efficient LED*, *Quality-checked*, *Made in India*, *2-Year Warranty*).
6. **Brand Partnerships (`Brands.tsx`):** Dedicated showcase for **Panasonic** (36 products: COB Down Lights, Surface Panels) and **GM** (15 products: Down Lights, Panels, Spots).
7. **WhatsApp Enquiry & Contact (`Enquiry.tsx`):** High-contrast CTA card with direct WhatsApp, phone, email (`nivoseasLLP@gmail.com`), and Google Maps showroom cards.

### 3. Collections Page (`/collections` — `CollectionsClient.tsx`)
- **Asymmetric Bento Grid Layout:**
  - **Row 1 (8 + 4):** Decorative hero + Indoor Lighting
  - **Row 2 (7 + 5):** Outdoor & Gate + Architectural LED
  - **Row 3 (4 + 4 + 4):** Commercial + LED Fans + Brands
- Full-bleed imagery with dark cinematic gradient overlays, product count pills, up to 3 subcategory tags, and direct links to `/products?category=<slug>`.

### 4. Product Catalogue (`/products` — `ProductListingClient.tsx`)
- **URL-Synced Category Filtering:** Reads `?category=` query parameter on load and updates `activeCategory` dynamically.
- **Multi-Facet Filtering & Search:**
  - Filter by **Category**, **Subcategory**, and **Usage** (`indoor`, `outdoor`, `both`).
  - Live search across product name, subcategory, material, tagline, and wattage.
  - Sort by **Featured**, **Name (A–Z)**, or **Category**.
- **Cloudinary Image Optimization:** Uses `cldPresets.thumbnail` for fast, auto-formatted grid thumbnails.

### 5. Product Detail Page (`/products/[slug]` — `ProductDetailView.tsx`)
- **Interactive Image Gallery:** Main 800×800 optimized preview (`cldPresets.productMain`) with clickable 160×160 thumbnails (`cldPresets.galleryThumb`).
- **Dynamic Technical Specifications:** Collapsible specification table supporting both ordered `technicalSpecs` arrays and legacy product fields (fixture type, material, wattage/dimensions, colour temperature, light output, voltage, warranty, lamp life, suggestive usage).
- **Pre-Filled WhatsApp Enquiry:** Generates a custom WhatsApp message containing the exact product name and SKU.
- **Related Products:** Recommends similar luminaires from the catalogue.

### 6. About & Contact Pages (`/about`, `/contact`)
- **About Page (`src/app/(main)/about/page.tsx`):** Brand story, 4 craftsmanship pillars, studio metrics (`150+` luminaires, `2,000+` spaces illuminated, `2 Years` warranty, `1 pc` MOQ), and Sector 104 Noida experience center details.
- **Contact Page (`src/app/(main)/contact/ContactClient.tsx`):**
  - **Lead Capture Form:** Submits inquiries (`name`, `phone`, `email`, `projectType`, `message`) to `POST /api/leads`.
  - **Interactive FAQ Accordion:** Answers on custom duplex ceiling drops, Noida showroom visits, pan-India crate packaging, 2-year warranty, and architect/BOQ collaborations.

### 7. Admin Dashboard (`/admin` — `src/app/admin/page.tsx`)
A full-featured management console with 5 views:
- **Overview & Analytics:** Real-time product counts broken down across all 7 categories and quick actions.
- **Catalogue Inventory:** Searchable, category-filterable product table with **inline SKU editing** (with duplicate validation), slide-over **Fixture Inspection Drawer**, edit trigger, and delete confirmation.
- **Add / Edit Luminaire:**
  - Multi-category selection and real-time duplicate SKU validation.
  - Ordered **Technical Specifications** builder (add, remove, reorder rows, reset to `DEFAULT_TECHNICAL_SPECS`).
  - Dynamic multi-slot **Gallery Image Manager** supporting preset images, URL input, and **Cloudinary upload** (with local `FileReader` Data URL fallback).
- **Customer Leads:** View inquiries captured from the storefront, filter by status (`new`, `contacted`, `in-progress`, `closed`) or search term, update status, launch WhatsApp/call directly, or delete leads.
- **Category Images:** Manage hero images for all 7 categories with live previews, **Custom vs. Default** status badges, URL paste, Cloudinary device upload, and **Reset to Default** (`categories.ts` fallback).

---

## API Routes

| Endpoint | Methods | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD for luminaires in MongoDB with automatic first-boot seeding from `src/data/products.ts`, duplicate SKU/slug checks, and local cache sync. | `GET`: 120/min, `POST`: 30/min, `PUT`: 40/min, `DELETE`: 20/min |
| `/api/categories` | `GET`, `PUT`, `DELETE` | Fetch all 7 categories merged with MongoDB `CategoryImage` overrides, upsert custom hero images, or reset to static defaults. | — |
| `/api/leads` | `GET`, `POST`, `PATCH`, `DELETE` | Capture customer enquiries, list leads sorted by newest, update lead status/notes, and delete leads. | `POST`: 60/min |
| `/api/health` | `GET` | Verifies `MONGODB_URI` configuration and live Mongoose connection state (`disconnected`, `connected`, `connecting`, `disconnecting`). | `GET`: 60/min |

---

## Project Structure

```text
src/
├── app/
│   ├── (main)/                 # Public storefront layout & pages
│   │   ├── page.tsx            # Homepage (7 sections)
│   │   ├── about/              # About Us page
│   │   ├── collections/        # Asymmetric Bento Grid collections page
│   │   ├── contact/            # Contact form + FAQ page
│   │   └── products/           # Product catalogue & [slug] detail pages
│   ├── admin/                  # Admin dashboard (/admin)
│   ├── api/                    # Route handlers (products, categories, leads, health)
│   ├── globals.css             # Tailwind v4 styles & design tokens
│   └── layout.tsx              # Root layout, Google Fonts, SEO & LocalBusiness JSON-LD
├── components/
│   ├── Header.tsx              # Mega-menu & mobile drawer
│   ├── Footer.tsx              # Site footer
│   ├── Hero.tsx                # Homepage hero banner
│   ├── sections/               # Intro, Collections, Catalogue, Craftsmanship, Brands, Enquiry
│   └── ui/ParallaxImage.tsx    # Parallax image wrapper
├── context/
│   └── ProductContext.tsx      # Deduplicated client product fetch & state provider
├── data/
│   ├── categories.ts           # Static category metadata & fallback hero images
│   ├── products.ts             # Seed product data & default technical specs
│   ├── products.json           # Local product cache
│   └── leads.json              # Local leads fallback store
├── lib/
│   ├── cloudinary.ts           # Cloudinary URL builder & size presets
│   ├── mongodb.ts              # Cached Mongoose connection helper
│   ├── products-store.ts       # Product store helpers
│   ├── leads-store.ts          # Lead store helpers
│   └── rate-limit.ts           # IP-based sliding-window rate limiter
└── models/
    ├── Product.ts              # Mongoose Product schema
    ├── Lead.ts                 # Mongoose Lead schema
    └── CategoryImage.ts        # Mongoose CategoryImage override schema
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nivoseas?retryWrites=true&w=majority
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nivoseas_products
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the storefront, [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard, or [http://localhost:3000/api/health](http://localhost:3000/api/health) to verify database connectivity.
