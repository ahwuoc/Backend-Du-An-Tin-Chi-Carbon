import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAffiliate extends Document {
  userId: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  reason?: string;
  address?: string;
  website?: string;
  socialMedia?: string;
  experience?: string;
  referralLink: string;
  totalClicks: number;
  totalRegistrations: number;
  totalCommission: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  paymentLinkId?: string;
}

const AffiliateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    email: String,
    phone: String,
    company: String,
    reason: String,
    address: String,
    website: String,
    socialMedia: String,
    experience: String,
    referralLink: String,
    totalClicks: Number,
    totalRegistrations: Number,
    totalCommission: Number,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentLinkId: String,
  },
  { timestamps: true }, // để tự động có createdAt + updatedAt
);

const Affiliate =
  mongoose.models.Affiliate ||
  mongoose.model<IAffiliate>("Affiliate", AffiliateSchema);

export default Affiliate;
