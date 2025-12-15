import type { Request, Response } from "express";
import { Types } from "mongoose";
import Affiliate from "../models/affiliate.model";
import { UserModel } from "../models/users.model";
import AffiliatePaymentMethod from "../models/affiliate-paymethod.model";
import { sendEmail } from "../utils/email/sendEmail";
import { templateAfifliate } from "../utils/email/emailTemplates";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, ConflictError } from "../utils";
import { config } from "../config/env";

/**
 * Affiliate Controller
 */
class AffiliateController {
  /**
   * Tạo affiliate mới
   * POST /api/affiliates
   */
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        userId,
        fullName,
        email,
        phone,
        company,
        reason,
        address,
        website,
        socialMedia,
        experience,
      } = req.body;

      // Validate required fields
      if (!userId || !fullName || !email || !phone) {
        throw new BadRequestError(
          "Thiếu thông tin bắt buộc: userId, fullName, email, phone"
        );
      }

      // Check user exists
      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        throw new NotFoundError("Người dùng không tồn tại");
      }

      // Check if already affiliate
      const existingAffiliate = await Affiliate.findOne({ userId });
      if (existingAffiliate) {
        throw new ConflictError("Người dùng đã đăng ký affiliate");
      }

      // Create referral link
      const referralLink = `${config.FRONTEND_URL}/dang-ky?ref=${userId}`;

      // Create affiliate
      const affiliate = await Affiliate.create({
        userId,
        fullName,
        email,
        phone,
        company,
        reason,
        address,
        website,
        socialMedia,
        experience,
        referralLink,
        totalClicks: 0,
        totalRegistrations: 0,
        totalCommission: 0,
        status: "pending",
      });

      // Send email
      const emailContent = templateAfifliate({
        name: fullName,
        email,
        referralLink,
      });
      await sendEmail(email, "Đăng ký affiliate thành công", emailContent);

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
      const affiliates = await Affiliate.find()
        .populate("userId", "username email")
        .lean();

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

      if (!id) {
        throw new BadRequestError("User ID là bắt buộc");
      }

      const affiliate = await Affiliate.findOne({ userId: id }).populate(
        "userId"
      );

      if (!affiliate) {
        throw new NotFoundError("Không tìm thấy affiliate");
      }

      const paymethod = await AffiliatePaymentMethod.findOne({
        affiliateId: affiliate._id,
      }).lean();

      sendSuccess(
        res,
        "Lấy thông tin affiliate thành công",
        {
          affiliate,
          paymethod: paymethod || null,
        },
        200
      );
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

      if (!id) {
        throw new BadRequestError("Affiliate ID là bắt buộc");
      }

      if (!status) {
        throw new BadRequestError("Trường 'status' là bắt buộc");
      }

      const affiliate = await Affiliate.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!affiliate) {
        throw new NotFoundError("Không tìm thấy affiliate");
      }

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

      const affiliate = await Affiliate.findByIdAndDelete(id);

      if (!affiliate) {
        throw new NotFoundError("Không tìm thấy affiliate");
      }

      sendSuccess(res, "Xóa affiliate thành công", { affiliateId: id }, 200);
    }
  );
}

export default new AffiliateController();
