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
  referralCode: string; // <-- thêm dòng này
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
    referralCode: {
      type: String,
      unique: true,
      trim: true,
    },
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
  { timestamps: true }
);

// Tạo mã ngẫu nhiên trước khi lưu
AffiliateSchema.pre("save", async function (next) {
  if (!this.referralCode) {
    let code: string = "";
    let isDuplicate = true;

    while (isDuplicate) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase(); // VD: "X9A2BZ"
      const existing = await mongoose.models.Affiliate.findOne({
        referralCode: code,
      });
      if (!existing) isDuplicate = false;
    }
    this.referralCode = code;
  }
  next();
});

const Affiliate =
  mongoose.models.Affiliate ||
  mongoose.model<IAffiliate>("Affiliate", AffiliateSchema);

export default Affiliate;
