import { Types } from "mongoose";

export interface IAffiliateTransaction {
  affiliateId: Types.ObjectId;
  customer: string;
  product: string;
  amount: number;
  commission: number;
  status: "Đã thanh toán" | "Đang xử lý";
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAffiliateTransactionCreate {
  affiliateId: Types.ObjectId;
  customer: string;
  product: string;
  amount: number;
  commission: number;
  status?: "Đã thanh toán" | "Đang xử lý";
  date?: Date;
}

export interface IAffiliateTransactionUpdate {
  customer?: string;
  product?: string;
  amount?: number;
  commission?: number;
  status?: "Đã thanh toán" | "Đang xử lý";
  date?: Date;
}
