import mongoose, { Schema, Document, Model } from "mongoose";
import { IAffiliateTransaction } from "../types/affiliate-transaction";

export interface IAffiliateTransactionDocument extends IAffiliateTransaction, Document {}

const AffiliateTransactionSchema: Schema = new Schema(
  {
    affiliateId: {
      type: Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
      index: true,
    },
    customer: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    commission: {
      type: Number,
      required: true,
      min: [0, "Commission cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Đã thanh toán", "Đang xử lý"],
      default: "Đang xử lý",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AffiliateTransaction = (mongoose.models.AffiliateTransaction ||
  mongoose.model<IAffiliateTransactionDocument>(
    "AffiliateTransaction",
    AffiliateTransactionSchema
  )) as Model<IAffiliateTransactionDocument>; 
export default AffiliateTransaction;
