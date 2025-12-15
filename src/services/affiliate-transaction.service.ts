import AffiliateTransaction from "../models/affiliate-transaction.model";
import { NotFoundError } from "../utils";

export interface ICreateTransactionInput {
  affiliateId: string;
  amount: number;
  type: "commission" | "payout" | "bonus";
  description?: string;
  status?: "pending" | "completed" | "failed";
}

class AffiliateTransactionService {
  async getAll() {
    return AffiliateTransaction.find().lean();
  }

  async getByAffiliateId(affiliateId: string) {
    const transaction = await AffiliateTransaction.findOne({ affiliateId }).lean();
    if (!transaction) {
      throw new NotFoundError("Không tìm thấy giao dịch");
    }
    return transaction;
  }

  async getById(id: string) {
    const transaction = await AffiliateTransaction.findById(id).lean();
    if (!transaction) {
      throw new NotFoundError("Không tìm thấy giao dịch");
    }
    return transaction;
  }

  async create(data: ICreateTransactionInput) {
    return AffiliateTransaction.create(data);
  }

  async update(id: string, data: Partial<ICreateTransactionInput>) {
    const updated = await AffiliateTransaction.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      throw new NotFoundError("Không tìm thấy giao dịch");
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await AffiliateTransaction.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy giao dịch");
    }
    return deleted;
  }
}

export default new AffiliateTransactionService();
