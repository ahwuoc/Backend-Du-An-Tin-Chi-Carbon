import mongoose, { Schema, Document, Model } from "mongoose"; // Import Model

interface IDonation extends Document {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  note?: string;
  user?: string;
  treeCount?: number;
  totalAmount: number;
  bankInfo: {
    accountName: string;
    accountNumber: string;
    bank: string;
    branch: string;
    content: string;
  };
  createdAt: Date;
}

const DonationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  note: { type: String, default: "" },
  totalAmount: { type: Number, required: true },
  bankInfo: {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bank: { type: String, required: true },
    branch: { type: String, required: true },
    content: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema)) as Model<IDonation>;
