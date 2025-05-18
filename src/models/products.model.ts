import mongoose, { Schema, Document } from "mongoose";

interface IFeature {
  title: string;
  description: string;
  icon: string;
}
interface IBenefits {
  title: string;
}

interface IAccountManager {
  name: string;
  email: string;
  phone: string;
}
interface ITimeLine {
  date: string;
  event: string;
  upcoming?: boolean;
}
interface ReportItem {
  title: string;
  date: string;
  url: string;
}
interface Certificate {
  title: string;
  date: Date;
  url: string;
}
interface IUsageStats {
  totalUsage: number;
  lastMonthUsage: number;
  trend: "up" | "down" | "stable";
}
export interface IProduct extends Document {
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  status: "active" | "pending" | "expired";
  expiryDate?: Date;
  image?: string;
  price?: number;
  billingCycle: string;
  projectLocation?: string;
  totalCredits?: number;
  usedCredits?: number;
  verificationStandard?: string;
  reports?: ReportItem[];
  benefits: IBenefits[];
  usageStats?: IUsageStats[];
  features?: IFeature[];
  subscriptionTier?: "free" | "expert" | "research" | "enterprise";
  nextPayment?: Date;
  certificationLevel?: string;
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
  accountManager: IAccountManager;
  area?: number;
  timeline?: ITimeLine[];
  certificates?: Certificate[];
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
    certificates: {
      type: [
        {
          title: { type: String, required: true },
          date: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      required: false,
      _id: true,
    },
    benefits: {
      type: [
        {
          title: { type: String, required: true },
        },
      ],
      required: true,
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "pending", "expired"],
      required: true,
    },
    timeline: {
      type: [
        {
          date: { type: String, required: true },
          event: { type: String, required: true },
          upcoming: { type: Boolean, required: false },
        },
      ],
      required: false,
      _id: true,
    },
    reports: {
      type: [
        {
          title: { type: String, required: true },
          date: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      _id: true,
      required: false,
    },
    expiryDate: { type: Date, required: false },
    image: { type: String, required: false },
    features: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: String,
        },
      ],
      required: false,
      _id: true,
    },
    price: { type: Number, required: false },
    projectLocation: { type: String, required: false },
    totalCredits: { type: Number, required: false },
    usedCredits: { type: Number, required: false },
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
      enum: ["free", "expert", "research", "enterprise"],
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
    area: { type: Number, required: false },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
