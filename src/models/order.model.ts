import mongoose, { Schema, Document, Model } from "mongoose"; // Import Model

// Định nghĩa interface cho Order
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  nameItem?: string;
  orderCode: string;
  buyerPhone: string;
  buyerAddress: string;
  amount: number;
  paymentStatus?: string;
  expiredAt?: Date;
  linkthanhtoan?: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: Date;
}

// Định nghĩa schema cho Order
const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true, lowercase: true },
    orderCode: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    expiredAt: { type: Date, required: false, default: null },
    nameItem: { type: String, required: false },
    linkthanhtoan: { type: String, required: false, default: null },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Order ||
  mongoose.model<IOrder>("Order", orderSchema)) as Model<IOrder>;
