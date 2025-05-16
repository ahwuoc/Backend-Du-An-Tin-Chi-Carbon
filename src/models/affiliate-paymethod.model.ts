import mongoose, { Schema, Document, Model, Types } from "mongoose";
// Import Affiliate interface/type
import { IAffiliate } from "./affiliate.model";

// Define Interface for Affiliate Payment Method Document
export interface IAffiliatePaymentMethod extends Document {
  // Reference to the Affiliate this payment method belongs to
  affiliateId: Types.ObjectId | IAffiliate;
  type: "bank_transfer" | "paypal" | "other"; // Payout methods
  name?: string; // Friendly name
  details: any;
  isDefault: boolean; // Is this the default payout method for the affiliate
  createdAt: Date;
  updatedAt: Date;
}

// Define Affiliate Payment Method Schema
const AffiliatePaymentMethodSchema: Schema<IAffiliatePaymentMethod> =
  new Schema(
    {
      // Reference to the Affiliate model
      affiliateId: {
        type: Schema.Types.ObjectId,
        ref: "Affiliate",
        required: true,
      },

      // Type of payout method
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

// Add indexes for efficient querying
AffiliatePaymentMethodSchema.index({ affiliateId: 1 });
AffiliatePaymentMethodSchema.index({ affiliateId: 1, isDefault: -1 });

// Create and export AffiliatePaymentMethod Model
const AffiliatePaymentMethod: Model<IAffiliatePaymentMethod> =
  mongoose.models.AffiliatePaymentMethod ||
  mongoose.model<IAffiliatePaymentMethod>(
    "AffiliatePaymentMethod",
    AffiliatePaymentMethodSchema
  );

export default AffiliatePaymentMethod;
