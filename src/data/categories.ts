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
      { name: "Outdoor Light" },
    ],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/gate-light-category.jpg",
    accentColor: "#4A2C1A",
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
    subcategories: [],
    heroImage:
      "https://nivoseas.com/wp-content/uploads/2024/01/led-fan-category.jpg",
    accentColor: "#D9B46C",
  },
];

