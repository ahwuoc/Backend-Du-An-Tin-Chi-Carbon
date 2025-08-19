import { Types } from "mongoose";
import { IAffiliate } from "./affiliate";

export interface IAffiliatePaymentMethod {
  affiliateId: Types.ObjectId | IAffiliate;
  type: "bank_transfer" | "paypal" | "other";
  name?: string;
  details: any;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAffiliatePaymentMethodCreate {
  affiliateId: Types.ObjectId;
  type: "bank_transfer" | "paypal" | "other";
  name?: string;
  details: any;
  isDefault?: boolean;
}

export interface IAffiliatePaymentMethodUpdate {
  type?: "bank_transfer" | "paypal" | "other";
  name?: string;
  details?: any;
  isDefault?: boolean;
}
