import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  message?: string;
  productName?: string;
  productId?: string;
  status: "new" | "contacted" | "in-progress" | "closed";
  source?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    projectType: { type: String, trim: true, default: "Residential" },
    message: { type: String, trim: true },
    productName: { type: String, trim: true },
    productId: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "closed"],
      default: "new",
    },
    source: { type: String, default: "contact-form" },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in Next.js development hot-reload
const LeadModel: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default LeadModel;
