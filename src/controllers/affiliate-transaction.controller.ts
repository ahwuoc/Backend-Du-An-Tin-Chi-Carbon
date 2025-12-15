import type { Request, Response } from "express";
import AffiliateTransaction from "../models/affiliate-transaction.model";
import type { IAffiliateTransaction } from "../types/affiliate-transaction";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError } from "../utils";

/**
 * Affiliate Transaction Controller
 */
class AffiliateTransactionController {
  /**
   * Lấy tất cả transactions
   * GET /api/transactions
   */
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const transactions = await AffiliateTransaction.find().lean();
      sendSuccess(res, "Lấy danh sách giao dịch thành công", transactions, 200);
    }
  );

  /**
   * Lấy transaction theo affiliate ID
   * GET /api/transactions/:id
   */
  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("Affiliate ID là bắt buộc");
      }

      const transaction = await AffiliateTransaction.findOne({
        affiliateId: id,
      }).lean();

      if (!transaction) {
        throw new NotFoundError("Không tìm thấy giao dịch");
      }

      sendSuccess(res, "Lấy giao dịch thành công", transaction, 200);
    }
  );

  /**
   * Tạo transaction mới
   * POST /api/transactions
   */
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body as Partial<IAffiliateTransaction>;
      const newTransaction = await AffiliateTransaction.create(data);

      sendSuccess(res, "Tạo giao dịch thành công", newTransaction, 201);
    }
  );

  /**
   * Cập nhật transaction
   * PUT /api/transactions/:id
   */
  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("Transaction ID là bắt buộc");
      }

      const updated = await AffiliateTransaction.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        throw new NotFoundError("Không tìm thấy giao dịch");
      }

      sendSuccess(res, "Cập nhật giao dịch thành công", updated, 200);
    }
  );

  /**
   * Xóa transaction
   * DELETE /api/transactions/:id
   */
  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("Transaction ID là bắt buộc");
      }

      const deleted = await AffiliateTransaction.findByIdAndDelete(id).lean();

      if (!deleted) {
        throw new NotFoundError("Không tìm thấy giao dịch");
      }

      sendSuccess(res, "Xóa giao dịch thành công", deleted, 200);
    }
  );
}

export default new AffiliateTransactionController();
