import mongoose, { Schema, model, models } from "mongoose";

export interface ICategoryImage {
  categoryId: string;
  heroImage: string;
  updatedAt: Date;
}

const CategoryImageSchema = new Schema<ICategoryImage>({
  categoryId: { type: String, required: true, unique: true, index: true },
  heroImage: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const CategoryImage =
  models.CategoryImage ||
  model<ICategoryImage>("CategoryImage", CategoryImageSchema);

export default CategoryImage;
