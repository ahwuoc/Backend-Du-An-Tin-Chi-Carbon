import type { Request, Response } from "express";
import mongoose from "mongoose";
import { AffiliatePaymentMethodService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

/**
 * Affiliate Payment Method Controller
 */
class AffiliatePaymentMethodController {
  /**
   * Lấy payment methods theo user ID
   * GET /api/payment-method/:id
   */
  public getByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User ID là bắt buộc");

      const paymentMethods = await AffiliatePaymentMethodService.getByUserId(id);
      sendSuccess(res, "Lấy danh sách phương thức thanh toán thành công", paymentMethods, 200);
    }
  );

  /**
   * Lấy payment method theo ID
   * GET /api/payment-method/detail/:methodId
   */
  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { methodId } = req.params;
      if (!methodId || !isValidObjectId(methodId)) {
        throw new BadRequestError("Method ID không hợp lệ");
      }

      const paymentMethod = await AffiliatePaymentMethodService.getById(methodId);
      sendSuccess(res, "Lấy phương thức thanh toán thành công", paymentMethod, 200);
    }
  );

  /**
   * Tạo payment method mới
   * POST /api/payment-method
   */
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newPaymentMethod = await AffiliatePaymentMethodService.create(req.body);
      sendSuccess(res, "Tạo phương thức thanh toán thành công", newPaymentMethod, 201);
    }
  );

  /**
   * Cập nhật payment method
   * PUT /api/payment-method/:methodId
   */
  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { methodId } = req.params;
      if (!methodId || !isValidObjectId(methodId)) {
        throw new BadRequestError("Method ID không hợp lệ");
      }

      const paymentMethod = await AffiliatePaymentMethodService.update(methodId, req.body);
      sendSuccess(res, "Cập nhật phương thức thanh toán thành công", paymentMethod, 200);
    }
  );

  /**
   * Xóa payment method
   * DELETE /api/payment-method/:methodId
   */
  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { methodId } = req.params;
      if (!methodId || !isValidObjectId(methodId)) {
        throw new BadRequestError("Method ID không hợp lệ");
      }

      await AffiliatePaymentMethodService.delete(methodId);
      sendSuccess(res, "Xóa phương thức thanh toán thành công", null, 200);
    }
  );
}

export default new AffiliatePaymentMethodController();
