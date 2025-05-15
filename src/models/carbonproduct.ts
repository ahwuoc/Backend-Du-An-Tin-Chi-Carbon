import { Schema, model, Document } from "mongoose";

interface IResource {
  id: string;
  title: string;
  type: "pdf" | "video" | "excel";
  icon: string;
  size: string;
  date: string;
}

interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface IActivity {
  id: string;
  date: string;
  action: string;
  user: string;
}

interface IUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface IUsageStats {
  totalUsage: number;
  lastMonthUsage: number;
  trend: "up" | "down";
  usageLimit: number;
  usagePercentage: number;
}

interface IContact {
  email: string;
  phone: string;
  supportHours?: string;
}

interface IAccountManager {
  name: string;
  email: string;
  phone: string;
}

export interface ICarbonProduct extends Document {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  description: string;
  image: string;
  dashboardImage: string;
  aiPlatformUrl: string;
  documentsDriveUrl: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  paymentMethod: string;
  cardInfo: string;
  usageStats: IUsageStats;
  supportContact: IContact;
  accountManager: IAccountManager;
  resources: IResource[];
  features: IFeature[];
  recentActivities: IActivity[];
  updates: IUpdate[];
}

const resourceSchema = new Schema<IResource>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["pdf", "video", "excel"], required: true },
  icon: { type: String, required: true },
  size: { type: String, required: true },
  date: { type: String, required: true },
});

const featureSchema = new Schema<IFeature>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

const activitySchema = new Schema<IActivity>({
  id: { type: String, required: true },
  date: { type: String, required: true },
  action: { type: String, required: true },
  user: { type: String, required: true },
});

const updateSchema = new Schema<IUpdate>({
  id: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const usageStatsSchema = new Schema<IUsageStats>({
  totalUsage: { type: Number, required: true },
  lastMonthUsage: { type: Number, required: true },
  trend: { type: String, enum: ["up", "down"], required: true },
  usageLimit: { type: Number, required: true },
  usagePercentage: { type: Number, required: true },
});

const contactSchema = new Schema<IContact>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  supportHours: { type: String },
});

const accountManagerSchema = new Schema<IAccountManager>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const carbonProductSchema = new Schema<ICarbonProduct>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  dashboardImage: { type: String, required: true },
  aiPlatformUrl: { type: String, required: true },
  documentsDriveUrl: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, required: true },
  nextBillingDate: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cardInfo: { type: String, required: true },
  usageStats: { type: usageStatsSchema, required: true },
  supportContact: { type: contactSchema, required: true },
  accountManager: { type: accountManagerSchema, required: true },
  resources: [{ type: resourceSchema }],
  features: [{ type: featureSchema }],
  recentActivities: [{ type: activitySchema }],
  updates: [{ type: updateSchema }],
});

export const CarbonProduct = model<ICarbonProduct>(
  "CarbonProduct",
  carbonProductSchema,
);
