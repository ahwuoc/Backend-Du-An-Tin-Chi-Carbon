import { Types } from "mongoose";

export interface IDonation {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  quantity: number;
  note?: string;
  totalAmount: number;
  createdAt?: Date;
  expiredAt?: Date;
  checkoutUrl?: string;
  orderCode?: string;
  status: "pending" | "success";
  updatedAt?: Date;
}

export interface IDonationCreate {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  quantity: number;
  note?: string;
  totalAmount: number;
  expiredAt?: Date;
  checkoutUrl?: string;
  orderCode?: string;
  status?: "pending" | "success";
}

export interface IDonationUpdate {
  name?: string;
  email?: string;
  phone?: string;
  quantity?: number;
  note?: string;
  totalAmount?: number;
  expiredAt?: Date;
  checkoutUrl?: string;
  orderCode?: string;
  status?: "pending" | "success";
}
