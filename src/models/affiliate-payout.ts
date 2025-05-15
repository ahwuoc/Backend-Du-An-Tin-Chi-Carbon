import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAffiliatePayout extends Document {
  affiliateId: Types.ObjectId;
  amount: number;
  method: string;
  status: string;
  date: Date;
}

const AffiliatePayoutSchema: Schema = new Schema(
  {
    affiliateId: {
      type: Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    method: {
      type: String,
      required: true,
      trim: true,
      enum: ["Bank Transfer", "PayPal", "Other"], // Có thể tùy chỉnh
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const AffiliatePayout =
  mongoose.models.AffiliatePayout ||
  mongoose.model<IAffiliatePayout>("AffiliatePayout", AffiliatePayoutSchema);

export default AffiliatePayout;
