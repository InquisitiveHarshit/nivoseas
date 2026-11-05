export type ProductUsage = "indoor" | "outdoor" | "both";
export type ProductCategory =
  | "decorative"
  | "outdoor-gate"
  | "architectural-led"
  | "led-fans";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  tagline?: string;
  wattage?: string;
  shape?: string;
  colourTemp?: string;
  lightColour?: string;
  material?: string;
  voltage?: string;
  warranty?: string;
  lampLife?: string;
  usage?: ProductUsage;
  origin?: string;
  moq?: number;
  images: string[];
  specs?: Record<string, string>;
  featured?: boolean;
}

const WC = (path: string) =>
  `https://nivoseas.com/wp-content/uploads/${path}`;

export const PRODUCTS: Product[] = [
  {
    id: "109-3",
    name: "Nivoseas 109/3 Decorative 3-Light",
    slug: "nivoseas-109-3-decorative-3-light",
    category: "decorative",
    subcategory: "Chandelier",
    tagline: "Three arms. One statement.",
    material: "Metal",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/nivoseas-109-3.jpg")],
    featured: true,
  },
  {
    id: "jl8558",
    name: "Nivoseas JL8558 Rose Gold Designer",
    slug: "nivoseas-jl8558-rose-gold-designer",
    category: "decorative",
    subcategory: "Chandelier",
    tagline: "Rose gold that earns the ceiling.",
    material: "Metal — Rose Gold Finish",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/jl8558-rose-gold.jpg")],
    featured: true,
  },
  {
    id: "699-300",
    name: "Nivoseas 699/300 Decorative LED Ceiling Light",
    slug: "nivoseas-699-300-decorative-led-ceiling-light",
    category: "decorative",
    subcategory: "Hanging Light",
    tagline: "Warm glow. All evening.",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/699-300-ceiling.jpg")],
    featured: true,
  },
  {
    id: "2413-wall",
    name: "2413 Wall Light",
    slug: "2413-wall-light",
    category: "decorative",
    subcategory: "Wall Light",
    tagline: "Side-lit warmth for every corridor.",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/2413-wall-light.jpg")],
  },
  {
    id: "419-table",
    name: "419 Table Lamp",
    slug: "419-table-lamp",
    category: "decorative",
    subcategory: "Table Lamp",
    tagline: "The desk, the bedside, the corner.",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/419-table-lamp.jpg")],
  },
  {
    id: "t-pinjara",
    name: "T-Pinjara",
    slug: "t-pinjara",
    category: "decorative",
    subcategory: "Hanging Light",
    tagline: "Traditional craft. Modern space.",
    material: "Metal Jali",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/t-pinjara.jpg")],
  },
  {
    id: "turtle-outdoor",
    name: "Turtle (3+3) Outdoor Light",
    slug: "turtle-3-3-outdoor-light",
    category: "outdoor-gate",
    subcategory: "Outdoor Light",
    tagline: "Built for the garden. Stays there.",
    usage: "outdoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/turtle-outdoor.jpg")],
  },
  {
    id: "led-prince-gate",
    name: "LED Prince Gate Light 15W",
    slug: "led-prince-gate-light-15w",
    category: "outdoor-gate",
    subcategory: "Gate Light — LED",
    tagline: "Every entrance, well lit.",
    wattage: "15W",
    usage: "outdoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/led-prince-gate.jpg")],
    specs: { Wattage: "15W", Usage: "Outdoor" },
    featured: true,
  },
  {
    id: "led-smart-jalwa",
    name: "LED Smart Jalwa 18W",
    slug: "led-smart-jalwa-18w",
    category: "outdoor-gate",
    subcategory: "Gate Light — LED",
    tagline: "Make the entrance count.",
    wattage: "18W",
    usage: "outdoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/led-smart-jalwa.jpg")],
    specs: { Wattage: "18W", Usage: "Outdoor" },
  },
  {
    id: "led-world-cup-gate",
    name: "LED World Cup Gate Light 18W",
    slug: "led-world-cup-gate-light-18w",
    category: "outdoor-gate",
    subcategory: "Gate Light — LED",
    tagline: "Bold. Bright. Built to last.",
    wattage: "18W",
    usage: "outdoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/led-world-cup-gate.jpg")],
    specs: { Wattage: "18W", Usage: "Outdoor" },
  },
  {
    id: "glare-gate",
    name: "Glare Gate Light 12W",
    slug: "glare-gate-light-12w",
    category: "outdoor-gate",
    subcategory: "Gate Light — Casting",
    tagline: "Casting body. Zero glare.",
    wattage: "12W",
    material: "Casting Body",
    usage: "outdoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/glare-gate-light.jpg")],
    specs: { Wattage: "12W", Body: "Casting", Usage: "Outdoor" },
  },
  {
    id: "gm-cino-6w",
    name: "GM Cino LED Down Light 6W",
    slug: "gm-cino-led-down-light-6w",
    category: "architectural-led",
    subcategory: "Down Lights",
    tagline: "Aluminium precision. Warm light.",
    wattage: "6W",
    colourTemp: "3000K",
    lightColour: "Warm White",
    material: "Aluminium",
    warranty: "2 Years",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/gm-cino-6w.jpg")],
    specs: {
      Wattage: "6W",
      "Colour Temp": "3000K",
      Material: "Aluminium",
      Warranty: "2 Years",
    },
    featured: true,
  },
  {
    id: "gm-cino-18w",
    name: "GM Cino LED Down Light 18W",
    slug: "gm-cino-led-down-light-18w",
    category: "architectural-led",
    subcategory: "Down Lights",
    tagline: "Bigger rooms. Same precision.",
    wattage: "18W",
    colourTemp: "3000K",
    lightColour: "Warm White",
    material: "Aluminium",
    warranty: "2 Years",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/gm-cino-18w.jpg")],
    specs: {
      Wattage: "18W",
      "Colour Temp": "3000K",
      Material: "Aluminium",
      Warranty: "2 Years",
    },
  },
  {
    id: "gm-yolo-slim-15w",
    name: "GM Yolo Slim Panel Light 15W",
    slug: "gm-yolo-slim-panel-light-15w",
    category: "architectural-led",
    subcategory: "Panel Lights",
    tagline: "Slim profile. Cool daylight.",
    wattage: "15W",
    colourTemp: "6500K",
    lightColour: "Cool White",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/gm-yolo-slim-15w.jpg")],
    specs: { Wattage: "15W", "Colour Temp": "6500K" },
  },
  {
    id: "gm-9w-spot-festo",
    name: "GM 9W LED Spot Light Festo",
    slug: "gm-9w-led-spot-light-festo",
    category: "architectural-led",
    subcategory: "Spot Lights",
    tagline: "Accent lighting. Done right.",
    wattage: "9W",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/gm-9w-festo.jpg")],
    specs: { Wattage: "9W" },
  },
  {
    id: "panasonic-cob-7w",
    name: "Panasonic COB Down Light 7W",
    slug: "panasonic-cob-down-light-7w",
    category: "architectural-led",
    subcategory: "Down Lights",
    tagline: "25,000 hours of perfect light.",
    wattage: "7W",
    material: "Aluminium Swivel",
    lampLife: "25,000 hours",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/panasonic-cob-7w.jpg")],
    specs: {
      Wattage: "7W",
      Material: "Aluminium Swivel",
      "Lamp Life": "25,000h",
    },
    featured: true,
  },
  {
    id: "panasonic-surface-panel-6w",
    name: "Panasonic Surface LED Panel Light 6W",
    slug: "panasonic-surface-led-panel-light-6w",
    category: "architectural-led",
    subcategory: "Panel Lights",
    tagline: "Surface mount. Clean finish.",
    wattage: "6W",
    usage: "indoor",
    origin: "India",
    moq: 1,
    images: [WC("2024/01/panasonic-surface-panel-6w.jpg")],
    specs: { Wattage: "6W" },
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

