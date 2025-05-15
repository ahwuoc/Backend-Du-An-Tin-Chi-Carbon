import { Document, Types } from "mongoose";

export default interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  sku: string;
  status: "active" | "inactive" | "deleted";
  categories: Types.ObjectId[];
  images: string[];
  seo_title: string;
  seo_description: string;
  createdAt: Date;
  updatedAt: Date;
}
