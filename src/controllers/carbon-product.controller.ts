import type { Request, Response } from "express";
import { CarbonProductService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Carbon Product Controller
 */
class CarbonProductController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newProduct = await CarbonProductService.create(req.body);
      sendSuccess(res, "Tạo sản phẩm thành công", newProduct, 201);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const products = await CarbonProductService.getAll();
      sendSuccess(res, "Lấy danh sách sản phẩm thành công", products, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID sản phẩm là bắt buộc");

      const product = await CarbonProductService.getById(id);
      sendSuccess(res, "Lấy sản phẩm thành công", product, 200);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID sản phẩm là bắt buộc");

      const updatedProduct = await CarbonProductService.update(id, req.body);
      sendSuccess(res, "Cập nhật sản phẩm thành công", updatedProduct, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID sản phẩm là bắt buộc");

      const deletedProduct = await CarbonProductService.delete(id);
      sendSuccess(res, "Xóa sản phẩm thành công", deletedProduct, 200);
    }
  );
}

export default new CarbonProductController();
