import mongoose, { Schema, Document, Model } from "mongoose";

/** ── Sub-document schemas ── */
const TechnicalSpecSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

/** ── Main Product Schema ── */
export interface IProduct extends Document {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  tagline?: string;
  description?: string;
  features?: string[];
  wattage?: string;
  shape?: string;
  colourTemp?: string;
  lightColour?: string;
  material?: string;
  voltage?: string;
  warranty?: string;
  lampLife?: string;
  usage?: "indoor" | "outdoor" | "both";
  suggestiveUsage?: string;
  origin?: string;
  moq?: number;
  images: string[];
  specs?: Map<string, string>;
  technicalSpecs?: { label: string; value: string }[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    tagline: { type: String },
    description: { type: String },
    features: [{ type: String }],
    wattage: { type: String },
    shape: { type: String },
    colourTemp: { type: String },
    lightColour: { type: String },
    material: { type: String },
    voltage: { type: String },
    warranty: { type: String },
    lampLife: { type: String },
    usage: { type: String, enum: ["indoor", "outdoor", "both"], default: "indoor" },
    suggestiveUsage: { type: String },
    origin: { type: String },
    moq: { type: Number, default: 1 },
    images: [{ type: String }],
    specs: { type: Map, of: String },
    technicalSpecs: [TechnicalSpecSchema],
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // expose the MongoDB _id as `id` string field for compatibility with existing code
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret.sku || String(ret._id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = ret as any;
        delete r._id;
        delete r.__v;
        return ret;
      },
    },
  }
);

// Indexes for fast querying (sku and slug indexes are auto-created by unique: true on the fields)
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: -1, createdAt: -1 });

const ProductModel: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;