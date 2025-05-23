import mongoose, { Schema, Document, Model } from "mongoose"; // Import Model
import IDonation from "../types/donation";

const DonationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  quantity: { type: Number, required: true, min: 1 },
  note: { type: String, default: "" },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, required: false, default: null },
  checkoutUrl: { type: String, require: false, default: null },
  orderCode: { type: String, require: false, default: null },
  status: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
  },
});

export default (mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema)) as Model<IDonation>;
