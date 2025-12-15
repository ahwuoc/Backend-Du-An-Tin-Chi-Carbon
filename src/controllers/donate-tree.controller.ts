import type { Request, Response } from "express";
import { DonationService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Donation Controller
 */
class DonationController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Get base URL
      let baseUrl =
        req.headers.referer?.toString() ||
        req.headers.origin?.toString() ||
        process.env.FRONT_END_URL;

      if (!baseUrl) {
        throw new BadRequestError("Không xác định được baseUrl");
      }

      baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

      const result = await DonationService.create(req.body, baseUrl);
      sendSuccess(
        res,
        "Đóng góp thành công, cảm ơn bạn đã góp xanh! 🌳",
        result,
        201
      );
    }
  );

  public getInfo = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const info = await DonationService.getInfo();
      sendSuccess(res, "Lấy thông tin đóng góp thành công", info, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const donations = await DonationService.getAll();
      sendSuccess(res, "Lấy danh sách đóng góp thành công", donations, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Donation ID là bắt buộc");

      const deleted = await DonationService.delete(id);
      sendSuccess(res, "Xóa donation thành công", deleted, 200);
    }
  );

  public updateStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Order code là bắt buộc");

      const donation = await DonationService.updateStatus(id);
      sendSuccess(res, "Cập nhật trạng thái thành công", donation, 200);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Donation ID là bắt buộc");

      const updated = await DonationService.update(id, req.body);
      sendSuccess(res, "Cập nhật donation thành công", updated, 200);
    }
  );
}

export default new DonationController();
