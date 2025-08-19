import mongoose, { Schema, Document, Model } from "mongoose";
import { IAffiliatePaymentMethod } from "../types/affiliate-paymethod";

export interface IAffiliatePaymentMethodDocument extends IAffiliatePaymentMethod, Document {}

const AffiliatePaymentMethodSchema: Schema<IAffiliatePaymentMethodDocument> =
  new Schema(
    {
      affiliateId: {
        type: Schema.Types.ObjectId,
        ref: "Affiliate",
        required: true,
      },

      type: {
        type: String,
        enum: ["bank_transfer", "paypal", "other"],
        required: true,
      },

     // Optional friendly name
      name: { type: String, trim: true },
      details: { type: Object, required: true },

      // Default payout method flag
      isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
  ); // Auto add createdAt and updatedAt

AffiliatePaymentMethodSchema.index({ affiliateId: 1 });
AffiliatePaymentMethodSchema.index({ affiliateId: 1, isDefault: -1 });

const AffiliatePaymentMethod: Model<IAffiliatePaymentMethodDocument> =
  mongoose.models.AffiliatePaymentMethod ||
  mongoose.model<IAffiliatePaymentMethodDocument>(
    "AffiliatePaymentMethod",
    AffiliatePaymentMethodSchema
  );

export default AffiliatePaymentMethod;
