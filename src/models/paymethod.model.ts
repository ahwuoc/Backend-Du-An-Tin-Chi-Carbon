import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPaymentMethod extends Document {
  userId: Types.ObjectId;
  type: "credit_card" | "bank_transfer" | "paypal";
  name?: string;
  details: any;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema: Schema<IPaymentMethod> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: ["credit_card", "bank_transfer", "paypal"],
      required: true,
    },

    name: { type: String, trim: true },

    details: { type: Object, required: true },

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentMethodSchema.index({ user: 1 });
PaymentMethodSchema.index({ user: 1, isDefault: -1 });

const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;
