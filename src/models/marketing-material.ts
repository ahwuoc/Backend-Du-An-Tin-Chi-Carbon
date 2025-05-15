import mongoose, { Schema, Document } from "mongoose";

export interface IMarketingMaterial extends Document {
  name: string;
  type: "Banner" | "Video" | "PDF" | "Image";
  size: string;
  downloadUrl: string;
}

const MarketingMaterialSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Banner", "Video", "PDF", "Image"],
    },
    size: {
      type: String,
      required: true,
      trim: true, // VD: "1200x600" hoặc "2MB"
    },
    downloadUrl: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/i, "Please enter a valid URL"],
    },
  },
  {
    timestamps: true,
  },
);

const MarketingMaterial =
  mongoose.models.MarketingMaterial ||
  mongoose.model<IMarketingMaterial>(
    "MarketingMaterial",
    MarketingMaterialSchema,
  );

export default MarketingMaterial;
