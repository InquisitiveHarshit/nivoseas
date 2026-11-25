import mongoose, { Document, Model, Schema } from "mongoose";
import slugify from "slugify";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  category?: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  coverImageAlt?: string;
  tags?: string[];
  faqs?: IFaqItem[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: [true, "Title is required."], trim: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    category: { type: String, trim: true },
    content: { type: String, required: [true, "Content is required."] },
    excerpt: { type: String },
    author: { type: String, default: "" },
    publishedAt: { type: Date },
    metaTitle: { type: String },
    metaDescription: { type: String },
    coverImage: { type: String },
    coverImageAlt: { type: String, default: "" },
    tags: { type: [String], default: [] },
    faqs: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
      default: [],
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug from title on first save if not supplied
BlogSchema.pre("save", function () {
  if (!this.slug || this.slug.trim() === "") {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
