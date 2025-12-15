import type { Request, Response } from "express";
import Donation from "../models/donate.model";
import { validateFlow } from "../fsm/base-fsm";
import { DonationForm } from "../validate/donation.form";
import { createPayOs, IData, IPayOs } from "../utils/payment";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, ValidationError } from "../utils";

class DonationController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, email, phone, quantity, note } = req.body;

      // Validate
      const errors = await validateFlow(req.body, DonationForm);
      if (errors.length > 0) {
        throw new ValidationError("Thiếu thông tin bắt buộc", errors);
      }

      // Get base URL
      let baseUrl =
        req.headers.referer?.toString() ||
        req.headers.origin?.toString() ||
        process.env.FRONT_END_URL;

      if (!baseUrl) {
        throw new BadRequestError("Không xác định được baseUrl");
      }

      baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

      // Create PayOS payment
      const random6Digits = Math.floor(100000 + Math.random() * 900000);
      const payosPayload: IPayOs = {
        orderCode: random6Digits,
        amount: quantity * 55000,
        description: note,
        cancelUrl: `${baseUrl}/gop-mam-xanh#plant-tree-section`,
        returnUrl: `${baseUrl}/gop-mam-xanh#plant-tree-section`,
      };

      const dataPayload: IData = {
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
      };

      const response = await createPayOs(payosPayload, dataPayload);

      if (response.code === "00") {
        const donation = await Donation.create({
          name,
          email,
          phone,
          quantity,
          orderCode: response.data.orderCode,
          note: response.data.description,
          totalAmount: response.data.amount,
          expiredAt: response.data.expiredAt,
          checkoutUrl: response.data.checkoutUrl,
          success: "success",
        });

        sendSuccess(
          res,
          "Đóng góp thành công, cảm ơn bạn đã góp xanh! 🌳",
          { donation, checkoutUrl: response.data.checkoutUrl },
          201
        );
      }
    }
  );

  public getInfo = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const donations = await Donation.find().sort({ createdAt: -1 }).limit(50).lean();

      const totalQuantity = donations.reduce((acc, d) => acc + d.quantity, 0);
      const totalTreeCount = donations.reduce((acc, d) => acc + (d.quantity || 0), 0);

      const contributorMap: Record<string, number> = {};
      donations.forEach((d) => {
        const key = d.email || d.userId?.toString() || "unknown";
        contributorMap[key] = (contributorMap[key] || 0) + (d.quantity || 0);
      });

      const treeCountByUser = Object.entries(contributorMap).map(([email, treeCount]) => ({
        email,
        treeCount,
      }));

      sendSuccess(res, "Lấy thông tin đóng góp thành công", {
        donations,
        totalQuantity,
        totalTreeCount,
        contributorCount: Object.keys(contributorMap).length,
        treeCountByUser,
      }, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const donations = await Donation.find().sort({ createdAt: -1 }).limit(50).lean();
      sendSuccess(res, "Lấy danh sách đóng góp thành công", donations, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Donation ID là bắt buộc");

      const deleted = await Donation.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundError("Không tìm thấy donation cần xóa");

      sendSuccess(res, "Xóa donation thành công", deleted, 200);
    }
  );

  public updateStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Order code là bắt buộc");

      const donation = await Donation.findOneAndUpdate(
        { orderCode: id },
        { $set: { status: "success" } },
        { new: true }
      );

      if (!donation) throw new NotFoundError("Không tìm thấy đơn đóng góp với mã đơn này");

      sendSuccess(res, "Cập nhật trạng thái thành công", donation, 200);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Donation ID là bắt buộc");

      const updated = await Donation.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) throw new NotFoundError("Không tìm thấy donation để cập nhật");

      sendSuccess(res, "Cập nhật donation thành công", updated, 200);
    }
  );
}

export default new DonationController();
