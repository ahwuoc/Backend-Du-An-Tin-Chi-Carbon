import type { Request, Response } from "express";
import { Types } from "mongoose";
import { AffiliateService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Affiliate Controller
 * Chỉ handle request/response, business logic nằm ở service
 */
class AffiliateController {
  /**
   * Tạo affiliate mới
   * POST /api/affiliates
   */
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const affiliate = await AffiliateService.create(req.body);

      sendSuccess(
        res,
        "Đăng ký affiliate thành công. Đang chờ phê duyệt.",
        {
          _id: affiliate._id,
          userId: affiliate.userId,
          fullName: affiliate.fullName,
          email: affiliate.email,
          status: affiliate.status,
        },
        201
      );
    }
  );

  /**
   * Lấy tất cả affiliates
   * GET /api/affiliates
   */
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const affiliates = await AffiliateService.getAll();
      sendSuccess(res, "Lấy danh sách affiliate thành công", affiliates, 200);
    }
  );

  /**
   * Lấy affiliate theo user ID
   * GET /api/affiliates/:id
   */
  public getByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User ID là bắt buộc");

      const result = await AffiliateService.getByUserId(id);
      sendSuccess(res, "Lấy thông tin affiliate thành công", result, 200);
    }
  );

  /**
   * Cập nhật affiliate status
   * PUT /api/affiliates/:id
   */
  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) throw new BadRequestError("Affiliate ID là bắt buộc");
      if (!status) throw new BadRequestError("Trường 'status' là bắt buộc");

      const affiliate = await AffiliateService.updateStatus(id, status);
      sendSuccess(res, "Cập nhật trạng thái affiliate thành công", affiliate, 200);
    }
  );

  /**
   * Xóa affiliate
   * DELETE /api/affiliates/:id
   */
  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Affiliate ID không hợp lệ");
      }

      await AffiliateService.delete(id);
      sendSuccess(res, "Xóa affiliate thành công", { affiliateId: id }, 200);
    }
  );
}

export default new AffiliateController();
