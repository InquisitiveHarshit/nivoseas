export interface Subcategory {
  name: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  productCount: number;
  subcategories?: Subcategory[];
  heroImage?: string;
  accentColor?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "decorative",
    name: "Decorative",
    slug: "decorative",
    tagline: "For the rooms that matter most.",
    description:
      "Chandeliers, hanging lights, wall lights and table lamps — each one chosen to become the room's focal point.",
    productCount: 97,
    subcategories: [
      { name: "Chandelier", count: 8 },
      { name: "Thali", count: 9 },
      { name: "Hanging Light", count: 61 },
      { name: "Wall Light", count: 18 },
      { name: "Picture Light" },
      { name: "Table Lamp" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/chandelier-category.jpg",
    accentColor: "#C8782A",
  },
  {
    id: "indoor-lighting",
    name: "Indoor Lighting",
    slug: "indoor-lighting",
    tagline: "Every room, perfectly lit.",
    description:
      "Ceiling lights, wall lights, hanging lights, downlights, spotlights and picture lights — crafted for Indian interiors.",
    productCount: 0,
    subcategories: [
      { name: "Ceiling Lights" },
      { name: "Surface Ceiling Lights" },
      { name: "Recessed Lights" },
      { name: "Wall Lights" },
      { name: "Indian Wall Lights" },
      { name: "Imported Wall Lights" },
      { name: "Decorative Wall Lights" },
      { name: "Hanging Lights" },
      { name: "Single Pendant Lights" },
      { name: "Multi-Pendant Lights" },
      { name: "Linear Hanging Lights" },
      { name: "Downlights" },
      { name: "Spotlights" },
      { name: "Picture Lights" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/chandelier-category.jpg",
    accentColor: "#C8782A",
  },
  {
    id: "outdoor-gate",
    name: "Outdoor & Gate",
    slug: "outdoor-gate",
    tagline: "From the drawing room to the gate.",
    description:
      "Weather-rated gate lights and outdoor fixtures built for Indian conditions — LED, casting, PVC, steel and pole options.",
    productCount: 27,
    subcategories: [
      { name: "Gate Light — LED" },
      { name: "Gate Light — MS" },
      { name: "Gate Light — Casting" },
      { name: "Gate Light — PVC" },
      { name: "Gate Light — Pole" },
      { name: "Gate Light — Steel" },
      { name: "Garden Lights" },
      { name: "Outdoor Wall Lights" },
      { name: "Flood Lights" },
      { name: "Street Lights" },
      { name: "Bollard Lights" },
      { name: "Outdoor Light" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/gate-light-category.jpg",
    accentColor: "#4A2C1A",
  },
  {
    id: "commercial",
    name: "Commercial",
    slug: "commercial",
    tagline: "Precision light for professional spaces.",
    description:
      "Office lights, track lights, panel lights, high bay and industrial lighting for commercial and business environments.",
    productCount: 0,
    subcategories: [
      { name: "Office Lights" },
      { name: "Track Lights" },
      { name: "Panel Lights" },
      { name: "High Bay Lights" },
      { name: "Industrial Lights" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/led-panel-category.jpg",
    accentColor: "#2A1810",
  },
  {
    id: "architectural-led",
    name: "Architectural LED",
    slug: "architectural-led",
    tagline: "Precision light. Zero compromise.",
    description:
      "Down lights, panel lights and spot lights from Panasonic and GM — engineered for uniform illumination with long lamp life.",
    productCount: 51,
    subcategories: [
      { name: "Down Lights" },
      { name: "Panel Lights" },
      { name: "Spot Lights" },
      { name: "Panasonic Range", count: 36 },
      { name: "GM Range", count: 15 },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/led-panel-category.jpg",
    accentColor: "#2A1810",
  },
  {
    id: "led-fans",
    name: "LED Fans",
    slug: "led-fans",
    tagline: "Light and air. Beautifully combined.",
    description:
      "Ceiling fans with integrated LED lighting for bedrooms, living rooms and covered outdoor spaces.",
    productCount: 12,
    subcategories: [
      { name: "LED Fans" },
      { name: "Ceiling Fans" },
      { name: "Decorative Fans" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/led-fan-category.jpg",
    accentColor: "#D9B46C",
  },
  {
    id: "brands",
    name: "Brands",
    slug: "brands",
    tagline: "Trusted names. Assured quality.",
    description:
      "Shop by brand — Panasonic, GM, and other leading names in lighting.",
    productCount: 0,
    subcategories: [
      { name: "Panasonic" },
      { name: "GM" },
      { name: "Other Brands" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/led-panel-category.jpg",
    accentColor: "#4A2C1A",
  },
];

