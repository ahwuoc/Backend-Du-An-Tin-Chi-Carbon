import type { Request, Response } from "express";
import { CarbonCreditService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Carbon Credit Controller
 */
class CarbonCreditController {
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const data = await CarbonCreditService.getAll();
      sendSuccess(res, "Lấy danh sách carbon credit thành công", data, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Carbon Credit ID là bắt buộc");

      const data = await CarbonCreditService.getById(id);
      sendSuccess(res, "Lấy carbon credit thành công", data, 200);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newItem = await CarbonCreditService.create(req.body);
      sendSuccess(res, "Tạo carbon credit thành công", newItem, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Carbon Credit ID là bắt buộc");

      const updated = await CarbonCreditService.update(id, req.body);
      sendSuccess(res, "Cập nhật carbon credit thành công", updated, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Carbon Credit ID là bắt buộc");

      await CarbonCreditService.delete(id);
      sendSuccess(res, "Xóa carbon credit thành công", null, 200);
    }
  );
}

export default new CarbonCreditController();
