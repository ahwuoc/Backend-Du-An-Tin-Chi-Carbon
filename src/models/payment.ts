import mongoose, { Schema } from "mongoose";
import { IPayment } from "../types/payment";

const paymentSchema: Schema<IPayment> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId as any,

      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
