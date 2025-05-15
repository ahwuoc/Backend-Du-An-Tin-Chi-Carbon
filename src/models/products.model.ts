import mongoose, { Schema, Document } from "mongoose";

interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface IAccountManager {
  name: string;
  email: string;
  phone: string;
}

export interface IProduct extends Document {
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  purchaseDate: Date;
  status: "active" | "pending" | "expired";
  expiryDate?: Date;
  image?: string;
  price?: number;
  billingCycle: string;
  projectLocation?: string;
  carbonAmount?: number;
  carbonUsed?: number;
  verificationStandard?: string;
  usageStats?: {
    totalUsage: number;
    lastMonthUsage: number;
    trend: "up" | "down" | "stable";
  };
  features: IFeature[];
  subscriptionTier?: "basic" | "professional" | "enterprise";
  nextPayment?: Date;
  certificationLevel?: string;
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
  accountManager: IAccountManager;
  area?: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "carbon_credits",
        "carbon_accounting",
        "international_certificates",
      ],
      required: true,
    },
    description: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "pending", "expired"],
      required: true,
    },
    expiryDate: { type: Date, required: false },
    image: { type: String, required: false },
    features: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: { type: String, required: true },
        },
      ],
      required: false,
    },
    price: { type: Number, required: false },
    projectLocation: { type: String, required: false },
    carbonAmount: { type: Number, required: false },
    carbonUsed: { type: Number, required: false },
    verificationStandard: { type: String, required: false },
    usageStats: {
      totalUsage: { type: Number, required: false },
      lastMonthUsage: { type: Number, required: false },
      trend: {
        type: String,
        enum: ["up", "down", "stable"],
        required: false,
      },
    },
    subscriptionTier: {
      type: String,
      enum: ["basic", "professional", "enterprise"],
      required: false,
    },
    nextPayment: { type: Date, required: false },
    certificationLevel: { type: String, required: false },
    courseProgress: { type: Number, required: false },
    lastAccessed: { type: Date, required: false },
    issuer: { type: String, required: false },
    billingCycle: { type: String, required: true },
    accountManager: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    area: { type: Number, required: false }, // Thêm diện tích vào schema
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
