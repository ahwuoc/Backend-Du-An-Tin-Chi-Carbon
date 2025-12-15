import type { Request, Response } from "express";
import { CarbonProduct, type ICarbonProduct } from "../models/carbonproduct";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError } from "../utils";

/**
 * Carbon Product Controller
 * Quản lý các sản phẩm carbon
 */
class CarbonProductController {
  /**
   * Tạo sản phẩm carbon mới
   * POST /api/carbons
   */
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const productData: ICarbonProduct = req.body;
      const newProduct = await CarbonProduct.create(productData);

      sendSuccess(res, "Tạo sản phẩm thành công", newProduct, 201);
    }
  );

  /**
   * Lấy tất cả sản phẩm carbon
   * GET /api/carbons
   */
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const products = await CarbonProduct.find().lean();

      sendSuccess(res, "Lấy danh sách sản phẩm thành công", products, 200);
    }
  );

  /**
   * Lấy sản phẩm carbon theo ID
   * GET /api/carbons/:id
   */
  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("ID sản phẩm là bắt buộc");
      }

      const product = await CarbonProduct.findById(id).lean();

      if (!product) {
        throw new NotFoundError("Không tìm thấy sản phẩm");
      }

      sendSuccess(res, "Lấy sản phẩm thành công", product, 200);
    }
  );

  /**
   * Cập nhật sản phẩm carbon
   * PUT /api/carbons/:id
   */
  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateData: Partial<ICarbonProduct> = req.body;

      if (!id) {
        throw new BadRequestError("ID sản phẩm là bắt buộc");
      }

      const updatedProduct = await CarbonProduct.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedProduct) {
        throw new NotFoundError("Không tìm thấy sản phẩm để cập nhật");
      }

      sendSuccess(res, "Cập nhật sản phẩm thành công", updatedProduct, 200);
    }
  );

  /**
   * Xóa sản phẩm carbon
   * DELETE /api/carbons/:id
   */
  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("ID sản phẩm là bắt buộc");
      }

      const deletedProduct = await CarbonProduct.findByIdAndDelete(id).lean();

      if (!deletedProduct) {
        throw new NotFoundError("Không tìm thấy sản phẩm để xóa");
      }

      sendSuccess(res, "Xóa sản phẩm thành công", deletedProduct, 200);
    }
  );
}

// Export instance và individual functions cho backward compatibility
const carbonProductController = new CarbonProductController();

export const createCarbonProduct = carbonProductController.create;
export const getAllCarbonProducts = carbonProductController.getAll;
export const getCarbonProductById = carbonProductController.getById;
export const updateCarbonProduct = carbonProductController.update;
export const deleteCarbonProduct = carbonProductController.delete;

export default carbonProductController;
