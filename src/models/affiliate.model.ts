import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IAffiliate extends Document {
  userId?: Types.ObjectId;
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  reason?: string;
  address?: string;
  website?: string;
  socialMedia?: string;
  experience?: string;
  referralLink?: string;
  referralCode?: string;
  totalClicks?: number;
  totalRegistrations?: number;
  totalCommission?: number;
  status?: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  paymentLinkId?: string;
}

const AffiliateSchema = new Schema<IAffiliate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    fullName: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    company: { type: String, required: false },
    reason: { type: String, required: false },
    address: { type: String, required: false },
    website: { type: String, required: false },
    socialMedia: { type: String, required: false },
    experience: { type: String, required: false },
    referralLink: { type: String, required: false },
    referralCode: {
      type: String,
      unique: false,
      trim: true,
    },
    totalClicks: { type: Number, default: 0 },
    totalRegistrations: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    paymentLinkId: { type: String, required: false },
  },
  { timestamps: true },
);

AffiliateSchema.pre("save", async function (next) {
  if (!this.referralCode) {
    let code = "";
    let isDuplicate = true;

    while (isDuplicate) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await mongoose.models.Affiliate?.findOne({
        referralCode: code,
      });
      if (!existing) isDuplicate = false;
    }
    this.referralCode = code;
  }
  next();
});

const AffiliateModel: Model<IAffiliate> =
  (mongoose.models.Affiliate as Model<IAffiliate>) ||
  mongoose.model<IAffiliate>("Affiliate", AffiliateSchema);

export default AffiliateModel;
