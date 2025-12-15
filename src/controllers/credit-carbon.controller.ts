import type { Request, Response } from "express";
import CarbonCredit from "../models/carboncredit.model";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError } from "../utils";

class CarbonCreditController {
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const data = await CarbonCredit.find().lean();
      sendSuccess(res, "Lấy danh sách carbon credit thành công", data, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Carbon Credit ID là bắt buộc");

      const data = await CarbonCredit.findById(id).lean();
      if (!data) throw new NotFoundError("Không tìm thấy carbon credit");

      sendSuccess(res, "Lấy carbon credit thành công", data, 200);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newItem = await CarbonCredit.create(req.body);
      sendSuccess(res, "Tạo carbon credit thành công", newItem, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Carbon Credit ID là bắt buộc");

      const updated = await CarbonCredit.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) throw new NotFoundError("Không tìm thấy carbon credit");

      sendSuccess(res, "Cập nhật carbon credit thành công", updated, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Carbon Credit ID là bắt buộc");

      const deleted = await CarbonCredit.findByIdAndDelete(id).lean();
      if (!deleted) throw new NotFoundError("Không tìm thấy carbon credit");

      sendSuccess(res, "Xóa carbon credit thành công", null, 200);
    }
  );
}

export default new CarbonCreditController();
